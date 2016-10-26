define(['exports', 'react', 'PVWStyle/ReactWidgets/PlotlySelectionWidgets.mcss'], function (exports, _react, _PlotlySelectionWidgets) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _PlotlySelectionWidgets2 = _interopRequireDefault(_PlotlySelectionWidgets);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var PlotlyHistogramWidget = function PlotlyHistogramWidget(props) {
    function handleChange(event) {
      var newXArray = event.target.value;
      var forceNewPlot = props.arrays[props.chartState.x] !== props.arrays[newXArray];
      props.onChange({
        chartType: 'Histogram',
        x: newXArray,
        forceNewPlot: forceNewPlot
      });
    }

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'table',
        { className: _PlotlySelectionWidgets2.default.fullWidth },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'td',
              { className: _PlotlySelectionWidgets2.default.label },
              'x'
            ),
            _react2.default.createElement(
              'td',
              { className: _PlotlySelectionWidgets2.default.fullWidth },
              _react2.default.createElement(
                'select',
                { className: _PlotlySelectionWidgets2.default.fullWidth, onChange: handleChange, value: props.chartState.x },
                Object.keys(props.arrays).map(function (arrayName) {
                  return _react2.default.createElement(
                    'option',
                    { value: arrayName, key: arrayName },
                    arrayName
                  );
                })
              )
            )
          )
        )
      )
    );
  };

  PlotlyHistogramWidget.propTypes = {
    chartState: _react2.default.PropTypes.object,
    arrays: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func
  };

  PlotlyHistogramWidget.defaultProps = {
    chartState: {},
    arrays: {},
    onChange: function onChange() {}
  };

  exports.default = PlotlyHistogramWidget;
});