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

  var PlotlyPieChartWidget = function PlotlyPieChartWidget(props) {
    function handleChange(event) {
      var rootContainer = event.target.parentNode.parentNode.parentNode;
      var newLabelArray = rootContainer.querySelector('.jsLabels').value;
      var newValueArray = rootContainer.querySelector('.jsValues').value;
      var forceNewPlot = props.arrays[props.chartState.labels] !== props.arrays[newLabelArray] || props.arrays[props.chartState.values] !== props.arrays[newValueArray];
      props.onChange({
        chartType: 'PieChart',
        labels: newLabelArray,
        values: newValueArray,
        operation: rootContainer.querySelector('.jsOps').value,
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
              'labels'
            ),
            _react2.default.createElement(
              'td',
              { className: _PlotlySelectionWidgets2.default.fullWidth },
              _react2.default.createElement(
                'select',
                { className: ['jsLabels', _PlotlySelectionWidgets2.default.fullWidth].join(' '), onChange: handleChange, value: props.chartState.labels },
                Object.keys(props.arrays).filter(function (elt, idx, array) {
                  return props.arrays[elt] === 'categorical';
                }).map(function (name) {
                  return _react2.default.createElement(
                    'option',
                    { value: name, key: name },
                    name
                  );
                })
              )
            )
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'td',
              { className: _PlotlySelectionWidgets2.default.label },
              'values'
            ),
            _react2.default.createElement(
              'td',
              null,
              _react2.default.createElement(
                'select',
                { className: ['jsValues', _PlotlySelectionWidgets2.default.fullWidth].join(' '), onChange: handleChange, value: props.chartState.values },
                Object.keys(props.arrays).map(function (name) {
                  return _react2.default.createElement(
                    'option',
                    { value: name, key: name },
                    name
                  );
                })
              )
            )
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'td',
              { className: _PlotlySelectionWidgets2.default.label },
              'Operation'
            ),
            _react2.default.createElement(
              'td',
              null,
              _react2.default.createElement(
                'select',
                { className: ['jsOps', _PlotlySelectionWidgets2.default.fullWidth].join(' '), onChange: handleChange, value: props.chartState.operation },
                _react2.default.createElement(
                  'option',
                  { value: 'Count', key: 'Count' },
                  'Count'
                ),
                _react2.default.createElement(
                  'option',
                  { value: 'Average', key: 'Average' },
                  'Average'
                )
              )
            )
          )
        )
      )
    );
  };

  PlotlyPieChartWidget.propTypes = {
    chartState: _react2.default.PropTypes.object,
    arrays: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func
  };

  PlotlyPieChartWidget.defaultProps = {
    chartState: {},
    arrays: [],
    onChange: function onChange() {}
  };

  exports.default = PlotlyPieChartWidget;
});