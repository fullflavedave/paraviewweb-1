define(['react', 'react-dom', '..', './presets.json', 'babel-polyfill'], function (_react, _reactDom, _, _presets) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _2 = _interopRequireDefault(_);

  var _presets2 = _interopRequireDefault(_presets);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var container = document.querySelector('.content');

  var ColorMapEditorTestWidget = _react2.default.createClass({
    displayName: 'ColorMapEditorTestWidget',

    getInitialState: function getInitialState() {
      return {
        currentPreset: 'Cool to Warm',
        rangeMin: 0,
        rangeMax: 200,
        points: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      };
    },
    updatePreset: function updatePreset(name) {
      this.setState({ currentPreset: name });
    },
    updateOpacityPoints: function updateOpacityPoints(points) {
      this.setState({ points: points });
    },
    updateRange: function updateRange(range) {
      this.setState({ rangeMin: range[0], rangeMax: range[1] });
    },
    rangeToCurrent: function rangeToCurrent() {
      this.setState({ rangeMin: 0, rangeMax: 150 });
    },
    rangeToTime: function rangeToTime() {
      this.setState({ rangeMin: 0, rangeMax: 200 });
    },
    render: function render() {
      return _react2.default.createElement(_2.default, {
        currentPreset: this.state.currentPreset,
        currentOpacityPoints: this.state.points,
        presets: _presets2.default,
        dataRangeMin: 0,
        dataRangeMax: 200,
        rangeMin: this.state.rangeMin,
        rangeMax: this.state.rangeMax,
        onOpacityTransferFunctionChanged: this.updateOpacityPoints,
        onPresetChanged: this.updatePreset,
        onRangeEdited: this.updateRange,
        onScaleRangeToCurrent: this.rangeToCurrent,
        onScaleRangeOverTime: this.rangeToTime
      });
    }
  });
  container.style.height = "50%";
  container.style.width = "50%";

  _reactDom2.default.render(_react2.default.createElement(ColorMapEditorTestWidget, {}), container);

  document.body.style.margin = '10px';
});