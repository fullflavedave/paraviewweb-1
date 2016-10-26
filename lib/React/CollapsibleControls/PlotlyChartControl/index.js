define(['exports', 'react', '../../Widgets/CollapsibleWidget', '../../Widgets/DropDownWidget', './Histogram', './Histogram2D', './Scatter3D', './PieChart'], function (exports, _react, _CollapsibleWidget, _DropDownWidget, _Histogram, _Histogram2D, _Scatter3D, _PieChart) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

  var _DropDownWidget2 = _interopRequireDefault(_DropDownWidget);

  var _Histogram2 = _interopRequireDefault(_Histogram);

  var _Histogram2D2 = _interopRequireDefault(_Histogram2D);

  var _Scatter3D2 = _interopRequireDefault(_Scatter3D);

  var _PieChart2 = _interopRequireDefault(_PieChart);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var types = {
    Histogram: _Histogram2.default,
    Histogram2D: _Histogram2D2.default,
    Scatter3D: _Scatter3D2.default,
    PieChart: _PieChart2.default
  };

  exports.default = _react2.default.createClass({

    displayName: 'PlotlyChartControl',

    propTypes: {
      model: _react2.default.PropTypes.object.isRequired
    },

    updateChartType: function updateChartType(chartType) {
      this.props.model.updateState({
        chartType: chartType
      });
      this.forceUpdate();
    },
    updateChartData: function updateChartData(data) {
      this.props.model.updateState(data);
      this.forceUpdate();
    },
    render: function render() {
      var arrays = this.props.model.getArrays();
      var chartState = this.props.model.getState();

      return _react2.default.createElement(
        _CollapsibleWidget2.default,
        {
          title: 'Chart',
          activeSubTitle: true,
          subtitle: _react2.default.createElement(_DropDownWidget2.default, {
            field: chartState.chartType,
            fields: Object.keys(types),
            onChange: this.updateChartType
          })
        },
        _react2.default.createElement(types[chartState.chartType], { chartState: chartState, arrays: arrays, onChange: this.updateChartData })
      );
    }
  });
});