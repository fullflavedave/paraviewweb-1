define(['exports', 'monologue.js', '../../../IO/Core/CSVReader', './chartTypes.json', './Histogram', './Histogram2D', './Scatter3D', './PieChart'], function (exports, _monologue, _CSVReader, _chartTypes, _Histogram, _Histogram2D, _Scatter3D, _PieChart) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _monologue2 = _interopRequireDefault(_monologue);

  var _CSVReader2 = _interopRequireDefault(_CSVReader);

  var _chartTypes2 = _interopRequireDefault(_chartTypes);

  var _Histogram2 = _interopRequireDefault(_Histogram);

  var _Histogram2D2 = _interopRequireDefault(_Histogram2D);

  var _Scatter3D2 = _interopRequireDefault(_Scatter3D);

  var _PieChart2 = _interopRequireDefault(_PieChart);

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

  var chartFactory = {
    Histogram: _Histogram2.default,
    Histogram2D: _Histogram2D2.default,
    Scatter3D: _Scatter3D2.default,
    PieChart: _PieChart2.default
  };

  var DATA_READY_TOPIC = 'data-ready';

  var PlotlyChartBuilder = function () {
    function PlotlyChartBuilder(queryDataModel) {
      var _this = this;

      _classCallCheck(this, PlotlyChartBuilder);

      this.queryDataModel = queryDataModel;
      this.csvReader = null;
      this.currentChartInfo = null;
      this.availableChartTypes = Object.keys(_chartTypes2.default);
      this.chartState = {
        chartType: this.availableChartTypes[0]
      };

      // Handle data fetching
      if (this.queryDataModel) {
        this.queryDataModel.onDataChange(function (data, envelope) {
          if (data.chart) {
            if (_this.csvReader === null) {
              _this.csvReader = new _CSVReader2.default(data.chart.data);
            } else {
              _this.csvReader.setData(data.chart.data);
            }

            _this.updateState();
          }
        });
      }

      this.controlWidgets = [];
      if (this.queryDataModel) {
        this.controlWidgets.push({
          name: 'PlotlyChartControl',
          model: this
        });
        this.controlWidgets.push({
          name: 'QueryDataModelWidget',
          queryDataModel: queryDataModel
        });
      }
    }

    // ------------------------------------------------------------------------

    _createClass(PlotlyChartBuilder, [{
      key: 'getArrays',
      value: function getArrays() {
        return this.queryDataModel.originalData.Chart.arrays;
      }
    }, {
      key: 'buildChart',
      value: function buildChart() {
        if (this.chartState.chartType) {
          var builder = chartFactory[this.chartState.chartType];
          var dataArrays = this.queryDataModel.originalData.Chart.arrays;
          var traces = builder(this.chartState, this.csvReader, dataArrays);
          if (traces) {
            this.dataReady({
              forceNewPlot: this.chartState.forceNewPlot,
              traces: traces
            });
          }
        }
      }
    }, {
      key: 'updateState',
      value: function updateState(state) {
        if (state) {
          this.chartState = Object.assign(this.chartState, state);
        }

        this.buildChart();
      }
    }, {
      key: 'getState',
      value: function getState() {
        return this.chartState;
      }
    }, {
      key: 'setChartData',
      value: function setChartData(chartData, layout) {
        this.dataReady({
          forceNewPlot: false,
          traces: chartData,
          layout: layout
        });
      }
    }, {
      key: 'onDataReady',
      value: function onDataReady(callback) {
        return this.on(DATA_READY_TOPIC, callback);
      }
    }, {
      key: 'dataReady',
      value: function dataReady(readyData) {
        this.emit(DATA_READY_TOPIC, readyData);
      }
    }, {
      key: 'getControlWidgets',
      value: function getControlWidgets() {
        return this.controlWidgets;
      }
    }, {
      key: 'getControlModels',
      value: function getControlModels() {
        return {
          queryDataModel: this.queryDataModel
        };
      }
    }]);

    return PlotlyChartBuilder;
  }();

  exports.default = PlotlyChartBuilder;


  // Add Observer pattern using Monologue.js
  _monologue2.default.mixInto(PlotlyChartBuilder);
});