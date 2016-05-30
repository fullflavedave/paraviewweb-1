'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

var _sortedCompositorCpu = require('./sorted-compositor-cpu');

var _sortedCompositorCpu2 = _interopRequireDefault(_sortedCompositorCpu);

var _EqualizerState = require('../../../Common/State/EqualizerState');

var _EqualizerState2 = _interopRequireDefault(_EqualizerState);

var _sortedCompositorGpu = require('./sorted-compositor-gpu');

var _sortedCompositorGpu2 = _interopRequireDefault(_sortedCompositorGpu);

var _ToggleState = require('../../../Common/State/ToggleState');

var _ToggleState2 = _interopRequireDefault(_ToggleState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LUT_NAME = 'VolumeScalar';

var SortedCompositeImageBuilder = function (_AbstractImageBuilder) {
  _inherits(SortedCompositeImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function SortedCompositeImageBuilder(queryDataModel, lookupTableManager) {
    _classCallCheck(this, SortedCompositeImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SortedCompositeImageBuilder).call(this, { queryDataModel: queryDataModel, lookupTableManager: lookupTableManager, dimensions: queryDataModel.originalData.SortedComposite.dimensions }));

    _this.dataQuery = {
      name: 'data_fetch',
      categories: []
    };
    _this.metadata = queryDataModel.originalData.SortedComposite;

    // Add Lut
    _this.originalRange = [_this.metadata.scalars[0], _this.metadata.scalars[_this.metadata.scalars.length - 1]];
    _this.lutTextureData = new Uint8Array(_this.metadata.layers * 4);
    lookupTableManager.addFields({ VolumeScalar: [0, 1] }, _this.queryDataModel.originalData.LookupTables);
    _this.lookupTable = lookupTableManager.getLookupTable(LUT_NAME);
    _this.registerSubscription(_this.lookupTable.onChange(function (data, envelope) {
      for (var idx = 0; idx < _this.metadata.layers; idx++) {
        var color = _this.lookupTable.getColor(_this.metadata.scalars[idx]);

        _this.lutTextureData[idx * 4] = color[0] * 255;
        _this.lutTextureData[idx * 4 + 1] = color[1] * 255;
        _this.lutTextureData[idx * 4 + 2] = color[2] * 255;
      }
      _this.render();
    }));

    _this.compositors = [new _sortedCompositorCpu2.default(queryDataModel, _this, _this.lutTextureData, _this.metadata.reverseCompositePass), new _sortedCompositorGpu2.default(queryDataModel, _this, _this.lutTextureData, _this.metadata.reverseCompositePass)];
    _this.compositor = _this.compositors[1];

    _this.intensityModel = new _ToggleState2.default(true);
    _this.computationModel = new _ToggleState2.default(true); // true: GPU / false: CPU
    _this.equalizerModel = new _EqualizerState2.default({
      size: _this.metadata.layers,
      scalars: _this.metadata.scalars,
      lookupTable: _this.lookupTable
    });

    _this.intensityModel.onChange(function (data, envelope) {
      _this.update();
    });
    _this.computationModel.onChange(function (data, envelope) {
      _this.compositor = _this.compositors[data ? 1 : 0];
      _this.update();
    });
    _this.equalizerModel.onChange(function (data, envelope) {
      var opacities = data.getOpacities();
      for (var idx = 0; idx < _this.metadata.layers; idx++) {
        _this.lutTextureData[idx * 4 + 3] = opacities[idx] * 255;
      }
      _this.render();
    });

    // Force the filling of the color texture
    _this.lookupTable.setScalarRange(_this.originalRange[0], _this.originalRange[1]);

    // Relay normal data fetch to query based on
    _this.registerSubscription(_this.queryDataModel.onDataChange(function () {
      _this.update();
    }));

    _this.registerSubscription(queryDataModel.on('data_fetch', function (data, envelope) {
      _this.compositor.updateData(data);
      _this.render();
    }));

    // Handle destroy
    _this.registerObjectToFree(_this.compositors[0]);
    _this.registerObjectToFree(_this.compositors[1]);
    _this.registerObjectToFree(_this.intensityModel);
    _this.registerObjectToFree(_this.computationModel);
    _this.registerObjectToFree(_this.equalizerModel);
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(SortedCompositeImageBuilder, [{
    key: 'update',
    value: function update() {
      if (this.intensityModel.getState()) {
        this.dataQuery.categories = ['_', 'intensity'];
      } else {
        this.dataQuery.categories = ['_'];
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
      _get(Object.getPrototypeOf(SortedCompositeImageBuilder.prototype), 'destroy', this).call(this);

      this.compositor = null;
      this.compositors = null;
      this.computationModel = null;
      this.dataQuery = null;
      this.equalizerModel = null;
      this.intensityModel = null;
      this.lookupTable = null;
      this.lutTextureData = null;
      this.metadata = null;
      this.originalRange = null;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      var _getControlModels = this.getControlModels();

      var lookupTable = _getControlModels.lookupTable;
      var equalizer = _getControlModels.equalizer;
      var intensity = _getControlModels.intensity;
      var computation = _getControlModels.computation;
      var queryDataModel = _getControlModels.queryDataModel;

      return [{
        name: 'VolumeControlWidget',
        lookupTable: lookupTable,
        equalizer: equalizer,
        intensity: intensity,
        computation: computation
      }, {
        name: 'QueryDataModelWidget',
        queryDataModel: queryDataModel
      }];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlModels',
    value: function getControlModels() {
      return {
        lookupTable: {
          lookupTable: this.lookupTable,
          lookupTableManager: this.lookupTableManager,
          originalRange: this.originalRange
        },
        equalizer: this.equalizerModel,
        intensity: this.intensityModel,
        computation: this.computationModel,
        queryDataModel: this.queryDataModel,
        dimensions: this.metadata.dimensions
      };
    }
  }]);

  return SortedCompositeImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = SortedCompositeImageBuilder;