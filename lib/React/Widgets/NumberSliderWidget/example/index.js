'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

var ColorField = _react2.default.createClass({

  displayName: 'NumberSliderWidget-Example',

  getInitialState: function getInitialState() {
    return { r: 30, g: 60, b: 90 };
  },
  componentDidMount: function componentDidMount() {
    this.drawColor();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.drawColor();
  },
  updateVal: function updateVal(e) {
    var which = e.target.name,
        newVal = e.target.value,
        toUpdate = {};
    toUpdate[which] = newVal;
    this.setState(toUpdate);
  },
  drawColor: function drawColor() {
    var ctx = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d'),
        width = ctx.canvas.width,
        height = ctx.canvas.height;
    ctx.fillStyle = 'rgb(' + this.state.r + ', ' + this.state.g + ', ' + this.state.b + ')';
    ctx.rect(0, 0, width, height);
    ctx.fill();
  },
  render: function render() {
    var r = this.state.r;
    var g = this.state.g;
    var b = this.state.b;

    return _react2.default.createElement(
      'section',
      { style: { margin: '20px' } },
      _react2.default.createElement(_2.default, { value: r, max: '255', min: '0', onChange: this.updateVal, name: 'r' }),
      _react2.default.createElement(_2.default, { value: g, max: '255', min: '0', onChange: this.updateVal, name: 'g' }),
      _react2.default.createElement(_2.default, { value: b, max: '255', min: '0', onChange: this.updateVal, name: 'b' }),
      _react2.default.createElement('canvas', { ref: 'canvas', width: '50', height: '50' })
    );
  }
});

_reactDom2.default.render(_react2.default.createElement(ColorField, null), document.querySelector('.content'));