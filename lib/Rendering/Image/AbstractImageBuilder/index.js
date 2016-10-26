'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMAGE_READY_TOPIC = 'image-ready';

var AbstractImageBuilder = function () {

  // ------------------------------------------------------------------------

  function AbstractImageBuilder(_ref) {
    var queryDataModel = _ref.queryDataModel;
    var pipelineModel = _ref.pipelineModel;
    var lookupTableManager = _ref.lookupTableManager;
    var _ref$handleRecord = _ref.handleRecord;
    var handleRecord = _ref$handleRecord === undefined ? false : _ref$handleRecord;
    var _ref$dimensions = _ref.dimensions;
    var dimensions = _ref$dimensions === undefined ? [500, 500] : _ref$dimensions;

    _classCallCheck(this, AbstractImageBuilder);

    this.queryDataModel = queryDataModel;
    this.pipelineModel = pipelineModel;
    this.lookupTableManager = lookupTableManager;
    this.handleRecord = handleRecord;
    this.subscriptions = [];
    this.objectsToFree = [];
    this.dimensions = dimensions;

    this.controlWidgets = [];
    if (this.lookupTableManager) {
      this.controlWidgets.push({
        name: 'LookupTableManagerWidget',
        lookupTableManager: lookupTableManager
      });
    }
    if (this.pipelineModel) {
      this.controlWidgets.push({
        name: 'CompositeControl',
        pipelineModel: pipelineModel
      });
    }
    if (this.queryDataModel) {
      this.controlWidgets.push({
        name: 'QueryDataModelWidget',
        queryDataModel: queryDataModel
      });
    }
  }

  // ------------------------------------------------------------------------

  _createClass(AbstractImageBuilder, [{
    key: 'update',
    value: function update() {
      if (this.queryDataModel) {
        this.queryDataModel.fetchData();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onImageReady',
    value: function onImageReady(callback) {
      return this.on(IMAGE_READY_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'imageReady',
    value: function imageReady(readyImage) {
      this.emit(IMAGE_READY_TOPIC, readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'registerSubscription',
    value: function registerSubscription(subscription) {
      this.subscriptions.push(subscription);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'registerObjectToFree',
    value: function registerObjectToFree(obj) {
      this.objectsToFree.push(obj);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getListeners',
    value: function getListeners() {
      return this.queryDataModel ? this.queryDataModel.getMouseListener() : {};
    }

    // ------------------------------------------------------------------------

    // Method meant to be used with the WidgetFactory

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      return this.controlWidgets;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlModels',
    value: function getControlModels() {
      return {
        pipelineModel: this.pipelineModel,
        queryDataModel: this.queryDataModel,
        lookupTableManager: this.lookupTableManager,
        dimensions: this.dimensions
      };
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();

      while (this.subscriptions.length) {
        this.subscriptions.pop().unsubscribe();
      }

      while (this.objectsToFree.length) {
        this.objectsToFree.pop().destroy();
      }

      this.queryDataModel = null;
      this.pipelineModel = null;
      this.lookupTableManager = null;
      this.dimensions = null;
      this.controlWidgets = null;
    }
  }]);

  return AbstractImageBuilder;
}();

// Add Observer pattern using Monologue.js


exports.default = AbstractImageBuilder;
_monologue2.default.mixInto(AbstractImageBuilder);