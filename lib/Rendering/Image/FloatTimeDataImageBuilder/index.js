define(['exports', 'monologue.js', '../../Painter/LineChartPainter'], function (exports, _monologue, _LineChartPainter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _monologue2 = _interopRequireDefault(_monologue);

  var _LineChartPainter2 = _interopRequireDefault(_LineChartPainter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var IMAGE_READY_TOPIC = 'image-ready';
  var CHANGE_TOPIC = 'FloatTimeDataImageBuilder.change';

  function buildListenerWrapper(floatTimeDataImageBuilder) {
    var imageBuilder = floatTimeDataImageBuilder.imageBuilder;
    var probeManager = floatTimeDataImageBuilder.probeManager;

    var listener = imageBuilder.getListeners();
    var myListener = {};

    ['drag'].forEach(function (name) {
      myListener[name] = function (e) {
        if (!probeManager[name](e)) {
          return listener[name] ? listener[name](e) : false;
        }
        floatTimeDataImageBuilder.render();
        return true;
      };
    });

    // Attache remaining method if any
    Object.keys(listener).forEach(function (name) {
      if (!myListener[name]) {
        myListener[name] = listener[name];
      }
    });

    return myListener;
  }

  function updateRange(rangeToUpdate, range) {
    rangeToUpdate[0] = rangeToUpdate[0] < range[0] ? rangeToUpdate[0] : range[0];
    rangeToUpdate[1] = rangeToUpdate[1] > range[1] ? rangeToUpdate[1] : range[1];
  }

  function findProbeColor(probe, chartFields) {
    for (var i = 0; i < chartFields.length; ++i) {
      if (chartFields[i].name === probe.name && chartFields[i].color) {
        return chartFields[i].color;
      }
    }
    return 'black';
  }

  var FloatTimeDataImageBuilder = function () {

    // ------------------------------------------------------------------------

    function FloatTimeDataImageBuilder(floatDataImageBuilder, timeProbeManager, painter) {
      var _this = this;

      _classCallCheck(this, FloatTimeDataImageBuilder);

      this.imageBuilder = floatDataImageBuilder;
      this.probeManager = timeProbeManager;
      this.queryDataModel = floatDataImageBuilder.queryDataModel;
      this.listeners = buildListenerWrapper(this);
      this.activeView = 0;
      this.subscriptions = [];
      this.painter = painter || new _LineChartPainter2.default('');
      this.painter.setBackgroundColor('#ffffff');
      this.chartData = { fields: [], xRange: [0, 10] };

      // Hide probe panel
      this.imageBuilder.isMultiView = function () {
        return false;
      };

      // Image ready interceptor
      this.subscriptions.push(this.imageBuilder.onImageReady(function (data, envelope) {
        var canvas = data.canvas;
        var outputSize = data.outputSize;

        var ctx = canvas.getContext('2d');

        _this.probeManager.setSize(outputSize[0], outputSize[1]);
        _this.probeManager.getProbes().forEach(function (probe) {
          var rgbStr = findProbeColor(probe, _this.chartData.fields);
          var ext = probe.getExtent();
          ctx.beginPath();
          ctx.lineWidth = '2';
          ctx.strokeStyle = rgbStr;
          ctx.rect(ext[0], ext[2], ext[1] - ext[0], ext[3] - ext[2]);
          ctx.stroke();
        });

        _this.emit(IMAGE_READY_TOPIC, data);
      }));

      this.subscriptions.push(this.imageBuilder.onTimeDataReady(function (data) {
        _this.updateChart(data);
      }));

      this.subscriptions.push(this.queryDataModel.onStateChange(function (data) {
        if (data.name === 'time') {
          _this.painter.setMarkerLocation(_this.queryDataModel.getIndex('time') / (_this.queryDataModel.getSize('time') - 1));
          _this.render();
          _this.emit(CHANGE_TOPIC, _this);
        }
      }));

      this.subscriptions.push(this.probeManager.onChange(function () {
        _this.imageBuilder.fetchTimeData();
      }));
    }

    // ------------------------------------------------------------------------

    _createClass(FloatTimeDataImageBuilder, [{
      key: 'render',
      value: function render() {
        this.imageBuilder.render();
      }
    }, {
      key: 'update',
      value: function update() {
        this.imageBuilder.update();
      }
    }, {
      key: 'updateChart',
      value: function updateChart(data) {
        var arrayType = '';
        var field = '';
        var layerName = '';

        this.imageBuilder.layers.forEach(function (layer) {
          if (layer.active) {
            arrayType = layer.type;
            field = layer.array;
            layerName = layer.name;
          }
        });

        var fieldName = layerName + '_' + field;
        var timeTypedArray = data.fullData.data.map(function (t) {
          return new window[arrayType](t[fieldName].data);
        });

        this.chartData = Object.assign({}, { xRange: data.xRange });
        this.chartData.fields = this.probeManager.processTimeData(timeTypedArray);

        // Use same y scale for each field
        var sharedRange = [Number.MAX_VALUE, Number.MIN_VALUE];
        this.chartData.fields.forEach(function (f) {
          updateRange(sharedRange, f.range);
          f.range = sharedRange;
        });

        this.painter.updateData(this.chartData);
        this.render();

        this.emit(CHANGE_TOPIC, this);
      }
    }, {
      key: 'onImageReady',
      value: function onImageReady(callback) {
        return this.on(IMAGE_READY_TOPIC, callback);
      }
    }, {
      key: 'onModelChange',
      value: function onModelChange(callback) {
        return this.on(CHANGE_TOPIC, callback);
      }
    }, {
      key: 'sortProbesByName',
      value: function sortProbesByName() {
        this.probeManager.sortProbesByName();
        this.emit(CHANGE_TOPIC, this);
        this.imageBuilder.fetchTimeData();
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.off();
        while (this.subscriptions.length) {
          this.subscriptions.pop().unsubscribe();
        }

        this.imageBuilder.destroy();
        this.probeManager.destroy();
      }
    }, {
      key: 'setActiveView',
      value: function setActiveView(index) {
        this.activeView = index;
        this.emit(CHANGE_TOPIC, this);
        if (index !== 0) {
          this.imageBuilder.fetchTimeData();
        }
        this.render();
      }
    }, {
      key: 'getActiveView',
      value: function getActiveView() {
        return this.activeView;
      }
    }, {
      key: 'enableProbe',
      value: function enableProbe(probeName) {
        var enable = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        this.probeManager.getProbes().forEach(function (probe) {
          if (probe.name === probeName) {
            probe.setActive(enable);
          }
        });
        this.chartData.fields.forEach(function (field) {
          if (field.name === probeName) {
            field.active = !!enable;
          }
        });
        this.emit(CHANGE_TOPIC, this);
        this.render();
      }
    }, {
      key: 'getControlWidgets',
      value: function getControlWidgets() {
        var model = this;

        var _getControlModels = this.getControlModels();

        var lookupTableManager = _getControlModels.lookupTableManager;
        var queryDataModel = _getControlModels.queryDataModel;

        return [{
          name: 'TimeFloatImageControl',
          model: model
        }, {
          name: 'LookupTableManagerWidget',
          lookupTableManager: lookupTableManager
        }, {
          name: 'QueryDataModelWidget',
          queryDataModel: queryDataModel
        }];
      }
    }, {
      key: 'getControlModels',
      value: function getControlModels() {
        return this.imageBuilder.getControlModels();
      }
    }, {
      key: 'getListeners',
      value: function getListeners() {
        return this.listeners;
      }
    }, {
      key: 'setRenderer',
      value: function setRenderer(renderer) {
        var _this2 = this;

        this.renderer = renderer;

        this.subscriptions.push(renderer.onDrawDone(function (rComponent) {
          if (_this2.activeView > 0) {
            if (rComponent && rComponent.getRenderingCanvas && _this2.painter.isReady()) {
              var canvasRenderer = rComponent.getRenderingCanvas();
              var width = canvasRenderer.width;
              var height = canvasRenderer.height;

              var ctxRenderer = canvasRenderer.getContext('2d');
              var offset = 5;
              var location = { x: offset, y: Number(height) / 2 + offset, width: Number(width) / 2 - 2 * offset, height: Number(height) / 2 - 2 * offset };
              ctxRenderer.fillStyle = '#ffffff';
              ctxRenderer.fillRect(location.x - 1, location.y - 1, location.width + 2, location.height + 2);
              _this2.painter.paint(ctxRenderer, location);
              ctxRenderer.strokeStyle = '#ccc';
              ctxRenderer.rect(location.x, location.y, location.width, location.height);
              ctxRenderer.stroke();
            }
          }
        }));
      }
    }]);

    return FloatTimeDataImageBuilder;
  }();

  exports.default = FloatTimeDataImageBuilder;


  _monologue2.default.mixInto(FloatTimeDataImageBuilder);
});