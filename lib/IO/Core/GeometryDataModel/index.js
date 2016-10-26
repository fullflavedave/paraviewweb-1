'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window */

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _DataManager = require('../DataManager');

var _DataManager2 = _interopRequireDefault(_DataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataManager = new _DataManager2.default(),
    OBJECT_READY_TOPIC = 'object-ready';

var geometryDataModelCounter = 0;

var GeometryDataModel = function () {
  function GeometryDataModel(basepath) {
    var _this = this;

    _classCallCheck(this, GeometryDataModel);

    geometryDataModelCounter += 1;

    this.basepath = basepath; // Needed for cloning
    this.id = ['GeometryDataModel', geometryDataModelCounter].join('_');
    this.coloByMapping = {};
    this.currentScene = null;
    this.sceneData = {};
    this.dataMapping = {};

    dataManager.on(this.id, function (data, envelope) {
      var url = data.requestedURL,
          dataDescription = _this.dataMapping[url];

      if (dataDescription) {
        (function () {
          var obj = _this.sceneData[dataDescription.name];
          var objectComplete = true;

          _this.sceneData[dataDescription.name][dataDescription.field] = new window[dataDescription.type](data.data);

          Object.keys(obj).forEach(function (key) {
            if (obj[key] === null) {
              objectComplete = false;
            }
          });
          if (objectComplete) {
            _this.geometryReady(obj);
          }
        })();
      }
    });
  }

  _createClass(GeometryDataModel, [{
    key: 'onGeometryReady',
    value: function onGeometryReady(callback) {
      return this.on(OBJECT_READY_TOPIC, callback);
    }
  }, {
    key: 'geometryReady',
    value: function geometryReady(obj) {
      this.emit(OBJECT_READY_TOPIC, obj);
    }
  }, {
    key: 'colorGeometryBy',
    value: function colorGeometryBy(objectName, fieldName) {
      var changeDetected = false;
      if (fieldName) {
        changeDetected = this.coloByMapping[objectName] !== fieldName;
        this.coloByMapping[objectName] = fieldName;
      } else {
        delete this.coloByMapping[objectName];
      }

      if (changeDetected) {
        this.loadScene(this.currentScene);
      }
    }
  }, {
    key: 'loadScene',
    value: function loadScene(scene) {
      var _this2 = this;

      this.currentScene = scene;
      if (scene) {
        (function () {
          // Reset data
          _this2.dataMapping = {};
          _this2.sceneData = {};
          var sceneData = _this2.sceneData;

          // Fill data with expected
          scene.forEach(function (obj) {
            var name = obj.name,
                urls = [];
            var url = null;

            // Init structure
            sceneData[name] = {
              name: name,
              points: null,
              index: null
            };

            // Register urls
            url = _this2.basepath + obj.points;
            _this2.dataMapping[url] = {
              name: name,
              field: 'points',
              type: obj.points.split('.').slice(-1)[0]
            };
            urls.push(url);

            url = _this2.basepath + obj.index;
            _this2.dataMapping[url] = {
              name: name,
              field: 'index',
              type: obj.index.split('.').slice(-1)[0]
            };
            urls.push(url);

            if (_this2.coloByMapping[name]) {
              sceneData[name].field = null;
              sceneData[name].fieldName = _this2.coloByMapping[name];

              url = _this2.basepath + obj.fields[_this2.coloByMapping[name]];
              _this2.dataMapping[url] = {
                name: name,
                field: 'field',
                type: obj.fields[_this2.coloByMapping[name]].split('.').slice(-1)[0]
              };
              urls.push(url);
            }

            // Make the requests
            urls.forEach(function (urlToFecth) {
              dataManager.fetchURL(urlToFecth, 'array', null, _this2.id);
            });
          });
        })();
      }
    }
  }]);

  return GeometryDataModel;
}();

// Add Observer pattern using Monologue.js


exports.default = GeometryDataModel;
_monologue2.default.mixInto(GeometryDataModel);