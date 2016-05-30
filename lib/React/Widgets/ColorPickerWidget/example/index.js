'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = null;

function colorChange(color) {
    component.updateColor([color[0], color[1], color[2]]);
    console.log('color', color);
}

component = _reactDom2.default.render(_react2.default.createElement(_2.default, { color: [122, 10, 30], onChange: colorChange }), document.querySelector('.content'));