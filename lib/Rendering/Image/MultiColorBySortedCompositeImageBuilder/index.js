'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

var _colorByHelper = require('./colorByHelper');

var _colorByHelper2 = _interopRequireDefault(_colorByHelper);

var _cpuCompositor = require('./cpu-compositor');

var _cpuCompositor2 = _interopRequireDefault(_cpuCompositor);

var _gpuCompositor = require('./gpu-compositor');

var _gpuCompositor2 = _interopRequireDefault(_gpuCompositor);

var _ToggleState = require('../../../Common/State/ToggleState');

var _ToggleState2 = _interopRequireDefault(_ToggleState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FETCH_DATA_TOPIC = 'data_to_fetch';

var MultiColorBySortedCompositeImageBuilder = function (_AbstractImageBuilder) {
  _inherits(MultiColorBySortedCompositeImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function MultiColorBySortedCompositeImageBuilder(queryDataModel, lookupTableManager, pipelineModel) {
    _classCallCheck(this, MultiColorBySortedCompositeImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiColorBySortedCompositeImageBuilder).call(this, { queryDataModel: queryDataModel, lookupTableManager: lookupTableManager, pipelineModel: pipelineModel, handleRecord: true, dimensions: queryDataModel.originalData.SortedComposite.dimensions }));

    _this.metadata = queryDataModel.originalData.SortedComposite;
    _this.intensityModel = new _ToggleState2.default(true);
    _this.normalsModel = new _ToggleState2.default(false);
    _this.computationModel = new _ToggleState2.default(true);

    _this.intensityModel.onChange(function (data, envelope) {
      _this.update();
    });

    _this.normalsModel.onChange(function (data, envelope) {
      _this.update();
    });

    _this.computationModel.onChange(function (data, envelope) {
      _this.compositor = _this.compositors[data ? 1 : 0];
      _this.update();
    });

    // Update LookupTableManager with data range
    _this.lookupTableManager.addFields(_this.metadata.ranges, _this.queryDataModel.originalData.LookupTables);

    // Need to have the LookupTable created
    _this.colorHelper = new _colorByHelper2.default(_this.metadata.pipeline, queryDataModel.originalData.CompositePipeline.fields, lookupTableManager);

    _this.lookupTableManager.updateActiveLookupTable(_this.metadata.activeLookupTable || _this.metadata.pipeline[0].colorBy[0].name);
    _this.dataQuery = {
      name: FETCH_DATA_TOPIC,
      categories: []
    };

    _this.compositors = [new _cpuCompositor2.default(queryDataModel, _this, _this.colorHelper, _this.metadata.reverseCompositePass), new _gpuCompositor2.default(queryDataModel, _this, _this.colorHelper, _this.metadata.reverseCompositePass)];
    _this.compositor = _this.compositors[1];

    _this.controlWidgets = [{
      name: 'LookupTableManagerWidget',
      lookupTableManager: _this.lookupTableManager
    }, {
      name: 'LightPropertiesWidget',
      light: _this
    }, {
      name: 'CompositeControl',
      pipelineModel: _this.pipelineModel
    }, {
      name: 'QueryDataModelWidget',
      queryDataModel: _this.queryDataModel
    }];
    if (_this.metadata.light && _this.metadata.light.indexOf('normal') >= 0) {
      if (_this.metadata.light.indexOf('intensity') < 0) {
        _this.normalsModel.setState(true);
      }
    } else {
      // No LightPropertiesWidget
      _this.controlWidgets.splice(1, 1);
    }

    // Relay normal data fetch to query based on
    _this.registerSubscription(_this.queryDataModel.onDataChange(function () {
      _this.update();
    }));

    _this.registerSubscription(queryDataModel.on(FETCH_DATA_TOPIC, function (data, envelope) {
      _this.colorHelper.updateData(data);
      _this.compositor.updateData(data);
      _this.render();
    }));

    _this.registerSubscription(_this.pipelineModel.onChange(function (data, envelope) {
      _this.colorHelper.updatePipeline(data);
      _this.update();
    }));
    _this.colorHelper.updatePipeline(_this.pipelineModel.getPipelineQuery());

    _this.registerSubscription(_this.lookupTableManager.onChange(function (data, envelope) {
      _this.render();
    }));

    _this.registerSubscription(_this.pipelineModel.onOpacityChange(function (data, envelope) {
      _this.colorHelper.updateAlphas(data);
      _this.render();
    }));

    // Set initial opacity
    _this.pipelineModel.resetOpacity(100);

    // Manage destroy
    _this.registerObjectToFree(_this.compositors[0]);
    _this.registerObjectToFree(_this.compositors[1]);
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(MultiColorBySortedCompositeImageBuilder, [{
    key: 'update',
    value: function update() {
      if (this.normalsModel.getState()) {
        this.dataQuery.categories = ['_', 'normal'].concat(this.colorHelper.getCategories());
      } else if (this.intensityModel.getState()) {
        this.dataQuery.categories = ['_', 'intensity'].concat(this.colorHelper.getCategories());
      } else {
        this.dataQuery.categories = ['_'].concat(this.colorHelper.getCategories());
      }

      this.queryDataModel.fetchData(this.dataQuery);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      this.compositor.render();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(MultiColorBySortedCompositeImageBuilder.prototype), 'destroy', this).call(this);

      this.compositors = null;
      this.compositor = null;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getLightingEnabled',
    value: function getLightingEnabled() {
      return this.normalsModel.getState();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLightingEnabled',
    value: function setLightingEnabled(lightingEnabled) {
      this.normalsModel.setState(lightingEnabled);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getLightProperties',
    value: function getLightProperties() {
      return this.compositor.getLightProperties();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLightProperties',
    value: function setLightProperties(lightProps) {
      this.compositor.setLightProperties(lightProps);
      this.render();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlModels',
    value: function getControlModels() {
      return {
        lookupTableManager: this.lookupTableManager,
        intensity: this.intensityModel,
        computation: this.computationModel,
        normal: this.normalsModel,
        queryDataModel: this.queryDataModel,
        light: this,
        dimensions: this.metadata.dimensions
      };
    }
  }]);

  return MultiColorBySortedCompositeImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = MultiColorBySortedCompositeImageBuilder;