'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PlotlySelectionWidgets = require('PVWStyle/ReactWidgets/PlotlySelectionWidgets.mcss');

var _PlotlySelectionWidgets2 = _interopRequireDefault(_PlotlySelectionWidgets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/no-unused-prop-types */

var PlotlyScatter3Didget = function PlotlyScatter3Didget(props) {
  function handleChange(event) {
    var rootContainer = event.target.parentNode.parentNode.parentNode;
    var newXArray = rootContainer.querySelector('.jsX').value;
    var newYArray = rootContainer.querySelector('.jsY').value;
    var newZArray = rootContainer.querySelector('.jsZ').value;
    var forceNewPlot = props.arrays[props.chartState.x] !== props.arrays[newXArray] || props.arrays[props.chartState.y] !== props.arrays[newYArray] || props.arrays[props.chartState.z] !== props.arrays[newZArray];
    props.onChange({
      chartType: 'Scatter3D',
      x: newXArray,
      y: newYArray,
      z: newZArray,
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
        ),
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'td',
            { className: _PlotlySelectionWidgets2.default.label },
            'z'
          ),
          _react2.default.createElement(
            'td',
            null,
            _react2.default.createElement(
              'select',
              { className: ['jsZ', _PlotlySelectionWidgets2.default.fullWidth].join(' '), onChange: handleChange, value: props.chartState.z },
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

PlotlyScatter3Didget.propTypes = {
  chartState: _react2.default.PropTypes.object,
  arrays: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func
};

PlotlyScatter3Didget.defaultProps = {
  chartState: {},
  arrays: [],
  onChange: function onChange() {}
};

exports.default = PlotlyScatter3Didget;