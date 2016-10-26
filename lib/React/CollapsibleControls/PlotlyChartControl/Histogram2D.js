'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PlotlySelectionWidgets = require('PVWStyle/ReactWidgets/PlotlySelectionWidgets.mcss');

var _PlotlySelectionWidgets2 = _interopRequireDefault(_PlotlySelectionWidgets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlotlyHistogram2DWidget = function PlotlyHistogram2DWidget(props) {
  function handleChange(event) {
    var rootContainer = event.target.parentNode.parentNode.parentNode;
    var newXArray = rootContainer.querySelector('.jsX').value;
    var newYArray = rootContainer.querySelector('.jsY').value;
    // const forceNewPlot = props.arrays[props.chartState.x] !== props.arrays[newXArray] ||
    //   props.arrays[props.chartState.y] !== props.arrays[newYArray];
    props.onChange({
      chartType: 'Histogram2D',
      x: newXArray,
      y: newYArray,
      forceNewPlot: true
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
              { className: ['jsX', _PlotlySelectionWidgets2.default.fullWidth].join(' '), onChange: handleChange, value: props.chartState.x },
              Object.keys(props.arrays).map(function (arrayName) {
                return _react2.default.createElement(
                  'option',
                  { value: arrayName, key: arrayName },
                  arrayName
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
            'y'
          ),
          _react2.default.createElement(
            'td',
            null,
            _react2.default.createElement(
              'select',
              { className: ['jsY', _PlotlySelectionWidgets2.default.fullWidth].join(' '), onChange: handleChange, value: props.chartState.y },
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

PlotlyHistogram2DWidget.propTypes = {
  chartState: _react2.default.PropTypes.object,
  arrays: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

PlotlyHistogram2DWidget.defaultProps = {
  chartState: {},
  arrays: [],
  onChange: function onChange() {}
};

exports.default = PlotlyHistogram2DWidget;