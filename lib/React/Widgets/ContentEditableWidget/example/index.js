'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

var container = document.querySelector('.content'),
    html = 'initial value';

function onChange(name, action, user) {
    console.log(name, action, user);
}

_reactDom2.default.render(_react2.default.createElement(_2.default, { html: html, onChange: onChange }), container);

document.body.style.margin = '10px';