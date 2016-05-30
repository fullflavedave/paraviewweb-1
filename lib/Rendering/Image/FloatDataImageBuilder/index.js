'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

var _contains = require('mout/src/array/contains');

var _contains2 = _interopRequireDefault(_contains);

var _equals = require('mout/src/object/equals');

var _equals2 = _interopRequireDefault(_equals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PROBE_CHANGE_TOPIC = 'probe-change',
    TIME_DATA_READY = 'time-data-ready';

var FloatDataImageBuilder = function (_AbstractImageBuilder) {
  _inherits(FloatDataImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function FloatDataImageBuilder(queryDataModel, lookupTableManager) {
    _classCallCheck(this, FloatDataImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FloatDataImageBuilder).call(this, { queryDataModel: queryDataModel, lookupTableManager: lookupTableManager, handleRecord: true, dimensions: queryDataModel.originalData.FloatImage.dimensions }));

    _this.timeDataQueryDataModel = queryDataModel.clone();
    _this.registerObjectToFree(_this.timeDataQueryDataModel);

    _this.light = 200;
    _this.meshColor = [50, 50, 50];
    _this.timeData = {
      data: [],
      pending: false
    };

    _this.metadata = queryDataModel.originalData.FloatImage;
    _this.layers = _this.metadata.layers;
    _this.dimensions = _this.metadata.dimensions;
    _this.timeProbe = {
      x: _this.dimensions[0] / 2,
      y: _this.dimensions[1] / 2,
      query: _this.timeDataQueryDataModel.getQuery(),
      enabled: false,
      draw: true,
      pending: false,
      forceUpdate: false,
      tIdx: _this.queryDataModel.getIndex('time') || 0,
      updateValue: function updateValue() {
        _this.timeProbe.value = _this.timeProbe.dataValues ? _this.timeProbe.dataValues[_this.timeProbe.tIdx] : _this.timeProbe.pending ? 'Fetching...' : '';
      },
      triggerChange: function triggerChange() {
        _this.timeProbe.forceUpdate = false;
        _this.timeProbe.updateValue();
        _this.emit(PROBE_CHANGE_TOPIC, _this.timeProbe);
      }
    };
    _this.bgCanvas = new _CanvasOffscreenBuffer2.default(_this.dimensions[0], _this.dimensions[1]);
    _this.registerObjectToFree(_this.bgCanvas);

    // Update LookupTableManager with data range
    _this.lookupTableManager.addFields(_this.metadata.ranges, _this.queryDataModel.originalData.LookupTables);

    // Handle events
    _this.registerSubscription(queryDataModel.onStateChange(function () {
      if (_this.timeProbe.tIdx !== _this.queryDataModel.getIndex('time')) {
        _this.timeProbe.tIdx = _this.queryDataModel.getIndex('time');
        _this.timeProbe.triggerChange();
      } else {
        _this.render();
      }
      _this.update();
    }));

    _this.registerSubscription(queryDataModel.on('pipeline_data', function (data, envelope) {
      _this.layers.forEach(function (item) {
        var dataId = item.name + '_' + item.array,
            dataLight = item.name + '__light',
            dataMesh = item.name + '__mesh';
        if (item.active && data[dataId]) {
          item.data = new window[item.type](data[dataId].data);
          item.light = new Uint8Array(data[dataLight].data);
          if (data[dataMesh]) {
            item.mesh = new Uint8Array(data[dataMesh].data);
          }
        }
      });
      _this.render();
    }));

    _this.registerSubscription(_this.lookupTableManager.onChange(function (data, envelope) {
      _this.render();
    }));

    // Handle time data
    _this.registerSubscription(_this.timeDataQueryDataModel.on('pipeline_data', function (data, envelope) {
      _this.timeData.data.push(data);
      if (_this.timeData.data.length < _this.timeDataQueryDataModel.getSize('time')) {
        _this.timeDataQueryDataModel.next('time');
        _this.timeData.pending = true;
        _this.timeProbe.pending = true;
        var categories = _this.getCategories();
        _this.timeDataQueryDataModel.fetchData({
          name: 'pipeline_data',
          categories: categories
        });
      } else {
        _this.timeData.pending = false;
        _this.timeProbe.pending = false;
        if (_this.timeProbe.enabled) {
          _this.getTimeChart();
        }
        _this.timeProbe.triggerChange();
        _this.emit(TIME_DATA_READY, { fields: [], xRange: [0, _this.timeDataQueryDataModel.getSize('time')], fullData: _this.timeData });
      }
    }));
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(FloatDataImageBuilder, [{
    key: 'getCategories',
    value: function getCategories() {
      var categories = [];

      this.layers.forEach(function (layer) {
        if (layer.active) {
          categories.push([layer.name, layer.array].join('_'));
          categories.push(layer.name + '__light');
          if (layer.hasMesh && layer.meshActive) {
            categories.push(layer.name + '__mesh');
          }
        }
      });

      return categories;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'update',
    value: function update() {
      var categories = this.getCategories();
      this.queryDataModel.fetchData({
        name: 'pipeline_data',
        categories: categories
      });
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'fetchTimeData',
    value: function fetchTimeData() {
      var _this2 = this;

      var categories = this.getCategories(),
          query = this.queryDataModel.getQuery();

      // Prevent concurrent data fetching for time
      if (this.timeData.pending || !this.timeDataQueryDataModel.getValues('time')) {
        return;
      }

      this.timeData.pending = true;
      this.timeProbe.pending = true;
      this.timeProbe.triggerChange();

      // Reset time data
      this.timeData.data = [];
      this.timeProbe.query = query;

      // Synch the time query data model
      Object.keys(query).forEach(function (key) {
        _this2.timeDataQueryDataModel.setValue(key, query[key]);
      });

      this.timeDataQueryDataModel.first('time');
      this.timeDataQueryDataModel.fetchData({
        name: 'pipeline_data',
        categories: categories
      });
    }

    // ------------------------------------------------------------------------

    /* eslint-disable complexity */

  }, {
    key: 'getTimeChart',
    value: function getTimeChart(xx, yy) {
      var x = xx;
      var y = yy;
      var probeHasChanged = !this.timeProbe.enabled || this.timeProbe.forceUpdate;
      this.timeProbe.enabled = true;

      // this.timeProbe.value = '';
      if (x === undefined && y === undefined) {
        x = this.timeProbe.x;
        y = this.timeProbe.y;
      } else {
        probeHasChanged = probeHasChanged || this.timeProbe.x !== x || this.timeProbe.y !== y;
        this.timeProbe.x = x;
        this.timeProbe.y = y;
      }

      var qA = this.queryDataModel.getQuery(),
          qB = this.timeProbe.query;

      // Time is irrelevant
      qB.time = qA.time;
      if (this.timeData.data.length === 0 || !(0, _equals2.default)(qA, qB)) {
        this.fetchTimeData();
        return;
      }

      // Find the layer under (x,y)
      var width = this.dimensions[0],
          height = this.dimensions[1],
          idx = (height - y - 1) * width + x;

      var arrayType = '',
          field = null,
          layerName = null;

      this.layers.forEach(function (layer) {
        if (layer.active && !isNaN(layer.data[idx])) {
          arrayType = layer.type;
          field = layer.array;
          layerName = layer.name;
        }
      });

      // Make sure the loaded data is the one we need to plot
      if (layerName && this.timeProbe.layer !== layerName && field && this.timeProbe.field !== field) {
        this.timeProbe.layer = layerName;
        this.timeProbe.field = field;

        if (this.timeProbe.layer && this.timeProbe.field) {
          this.fetchTimeData();
        }
        return;
      }

      // Build chart data information
      var timeValues = this.timeDataQueryDataModel.getValues('time'),
          dataValues = [],
          chartData = {
        xRange: [Number(timeValues[0]), Number(timeValues[timeValues.length - 1])],
        fields: [{
          name: field,
          data: dataValues
        }]
      },
          timeSize = this.timeData.data.length;

      if (field && this.lookupTableManager.getLookupTable(field)) {
        chartData.fields[0].range = this.lookupTableManager.getLookupTable(field).getScalarRange();
      }

      // Keep track of the chart values
      this.timeProbe.dataValues = dataValues;
      this.timeProbe.tIdx = this.queryDataModel.getIndex('time');

      var layerNameField = layerName + '_' + field;
      if (layerName && field && this.timeData.data[0][layerNameField]) {
        for (var i = 0; i < timeSize; i++) {
          var floatArray = new window[arrayType](this.timeData.data[i][layerNameField].data);
          dataValues.push(floatArray[idx]);
        }
      } else if (layerName && field && !this.timeData.data[0][layerNameField]) {
        this.fetchTimeData();
      }

      this.emit(TIME_DATA_READY, chartData);
      if (probeHasChanged) {
        this.timeProbe.triggerChange();
      }
      this.render();
    }
    /* eslint-enable complexity */

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var ctx = this.bgCanvas.get2DContext(),
          width = this.dimensions[0],
          height = this.dimensions[1],
          size = width * height,
          imageData = ctx.createImageData(width, height),
          pixels = imageData.data;

      function flipY(idx) {
        var x = idx % width,
            y = Math.floor(idx / width);

        return (height - y - 1) * width + x;
      }

      ctx.clearRect(0, 0, width, height);
      this.layers.forEach(function (layer) {
        if (layer.active) {
          var lut = _this3.lookupTableManager.getLookupTable(layer.array);
          for (var i = 0; i < size; i++) {
            var flipedY = flipY(i),
                color = lut.getColor(layer.data[flipedY]),
                light = layer.light ? layer.light[flipedY] ? layer.light[flipedY] - _this3.light : 0 : 0;

            if (color[3]) {
              pixels[i * 4] = color[0] * 255 + light;
              pixels[i * 4 + 1] = color[1] * 255 + light;
              pixels[i * 4 + 2] = color[2] * 255 + light;
              pixels[i * 4 + 3] = color[3] * 255;

              if (layer.hasMesh && layer.meshActive && layer.mesh && layer.mesh[flipedY]) {
                pixels[i * 4] = _this3.meshColor[0];
                pixels[i * 4 + 1] = _this3.meshColor[1];
                pixels[i * 4 + 2] = _this3.meshColor[2];
              }
            }
          }
        }
      });
      ctx.putImageData(imageData, 0, 0);

      // Update draw flag based on query
      var currentQuery = this.queryDataModel.getQuery();
      this.timeProbe.query.time = currentQuery.time; // We don't care about time
      this.timeProbe.draw = (0, _equals2.default)(this.timeProbe.query, currentQuery);

      // Draw time probe if enabled
      if (this.timeProbe.enabled && this.timeProbe.draw) {
        var x = this.timeProbe.x,
            y = this.timeProbe.y,
            delta = 10;

        ctx.beginPath();
        ctx.moveTo(x - delta, y);
        ctx.lineTo(x + delta, y);
        ctx.moveTo(x, y - delta);
        ctx.lineTo(x, y + delta);

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      }

      var readyImage = {
        canvas: this.bgCanvas.el,
        area: [0, 0, width, height],
        outputSize: [width, height],
        builder: this,
        arguments: this.queryDataModel.getQuery()
      };

      // FIXME should add var for pipeline

      // Let everyone know the image is ready
      this.imageReady(readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onTimeDataReady',
    value: function onTimeDataReady(callback) {
      return this.on(TIME_DATA_READY, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onProbeChange',
    value: function onProbeChange(callback) {
      return this.on(PROBE_CHANGE_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(FloatDataImageBuilder.prototype), 'destroy', this).call(this);

      this.off();

      this.bgCanvas = null;
      this.dimensions = null;
      this.layers = null;
      this.light = null;
      this.meshColor = null;
      this.metadata = null;
      this.timeData = null;
      this.timeDataQueryDataModel = null;
      this.timeProbe = null;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      var model = this;

      var _getControlModels = this.getControlModels();

      var lookupTableManager = _getControlModels.lookupTableManager;
      var queryDataModel = _getControlModels.queryDataModel;


      return [{
        name: 'LookupTableManagerWidget',
        lookupTableManager: lookupTableManager
      }, {
        name: 'FloatImageControl',
        model: model
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
        lookupTableManager: this.lookupTableManager,
        queryDataModel: this.queryDataModel
      };
    }

    // ------------------------------------------------------------------------
    // FIXME method below should be encapsulated in a State/Model
    // ------------------------------------------------------------------------

  }, {
    key: 'isMultiView',
    value: function isMultiView() {
      return !(0, _contains2.default)(this.queryDataModel.originalData.type, 'single-view');
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getLayers',
    value: function getLayers() {
      return this.layers;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLight',
    value: function setLight(lightValue) {
      if (this.light !== lightValue) {
        this.light = lightValue;
        this.render();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getLight',
    value: function getLight() {
      return this.light;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getTimeProbe',
    value: function getTimeProbe() {
      return this.timeProbe;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setMeshColor',
    value: function setMeshColor(r, g, b) {
      if (this.meshColor[0] !== r && this.meshColor[1] !== g && this.meshColor[2] !== b) {
        this.meshColor = [r, g, b];
        this.update();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getMeshColor',
    value: function getMeshColor() {
      return this.meshColor;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateLayerVisibility',
    value: function updateLayerVisibility(name, visible) {
      var array = this.layers,
          count = array.length;

      while (count--) {
        if (array[count].name === name) {
          array[count].active = visible;
          this.update();
          if (this.timeProbe.enabled) {
            this.timeProbe.forceUpdate = true;
            this.getTimeChart();
          }
          return;
        }
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateMaskLayerVisibility',
    value: function updateMaskLayerVisibility(name, visible) {
      var array = this.layers,
          count = array.length;

      while (count--) {
        if (array[count].name === name) {
          array[count].meshActive = visible;
          this.update();
          return;
        }
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateLayerColorBy',
    value: function updateLayerColorBy(name, arrayName) {
      var array = this.layers,
          count = array.length;

      while (count--) {
        if (array[count].name === name) {
          array[count].array = arrayName;
          this.update();
          if (this.timeProbe.enabled) {
            this.getTimeChart();
          }
          return;
        }
      }
    }
  }]);

  return FloatDataImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = FloatDataImageBuilder;