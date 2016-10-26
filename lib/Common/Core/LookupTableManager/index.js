'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _LookupTable = require('../LookupTable');

var _LookupTable2 = _interopRequireDefault(_LookupTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TOPIC = {
  CHANGE: 'LookupTable.change',
  ACTIVE_CHANGE: 'LookupTable.active.change',
  LIST_CHANGE: 'LookupTable.list.change'
};

var LookupTableManager = function () {
  function LookupTableManager() {
    var _this = this;

    _classCallCheck(this, LookupTableManager);

    this.luts = {};
    this.lutSubscriptions = {};

    this.onChangeCallback = function (data, envelope) {
      _this.emit(TOPIC.CHANGE, data);
    };
  }

  _createClass(LookupTableManager, [{
    key: 'addLookupTable',
    value: function addLookupTable(name, range, preset) {
      if (!this.activeField) {
        this.activeField = name;
      }

      var lut = this.luts[name];
      if (lut === undefined) {
        lut = new _LookupTable2.default(name);

        this.luts[name] = lut;
        this.lutSubscriptions[name] = lut.onChange(this.onChangeCallback);
      }

      lut.setPreset(preset || 'spectralflip');
      lut.setScalarRange(range[0], range[1]);

      this.emit(TOPIC.LIST_CHANGE, this);

      return lut;
    }
  }, {
    key: 'removeLookupTable',
    value: function removeLookupTable(name) {
      if (this.luts.hasOwn(name)) {
        this.lutSubscriptions[name].unsubscribe();
        this.luts[name].destroy();

        delete this.luts[name];
        delete this.lutSubscriptions[name];

        this.emit(TOPIC.LIST_CHANGE, this);
      }
    }
  }, {
    key: 'updateActiveLookupTable',
    value: function updateActiveLookupTable(name) {
      var _this2 = this;

      setImmediate(function () {
        _this2.emit(TOPIC.ACTIVE_CHANGE, name);
      });
      this.activeField = name;
    }
  }, {
    key: 'getLookupTable',
    value: function getLookupTable(name) {
      return this.luts[name];
    }
  }, {
    key: 'addFields',
    value: function addFields(fieldsRange, lutConfigs) {
      var _this3 = this;

      Object.keys(fieldsRange).forEach(function (field) {
        var lut = _this3.addLookupTable(field, fieldsRange[field]);
        if (lutConfigs && lutConfigs[field]) {
          if (lutConfigs[field].discrete !== undefined) {
            lut.discrete = lutConfigs[field].discrete;
          }
          if (lutConfigs[field].preset) {
            lut.setPreset(lutConfigs[field].preset);
          } else if (lutConfigs[field].controlpoints) {
            lut.updateControlPoints(lutConfigs[field].controlpoints);
          }
          if (lutConfigs[field].range) {
            lut.setScalarRange(lutConfigs[field].range[0], lutConfigs[field].range[1]);
          }
        }
      });
    }
  }, {
    key: 'getActiveField',
    value: function getActiveField() {
      return this.activeField;
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      return this.on(TOPIC.CHANGE, callback);
    }
  }, {
    key: 'onFieldsChange',
    value: function onFieldsChange(callback) {
      return this.on(TOPIC.LIST_CHANGE, callback);
    }
  }, {
    key: 'onActiveLookupTableChange',
    value: function onActiveLookupTableChange(callback) {
      return this.on(TOPIC.ACTIVE_CHANGE, callback);
    }
  }]);

  return LookupTableManager;
}();

// Add Observer pattern using Monologue.js


exports.default = LookupTableManager;
_monologue2.default.mixInto(LookupTableManager);