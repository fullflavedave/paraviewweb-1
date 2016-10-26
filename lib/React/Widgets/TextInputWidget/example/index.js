'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = document.querySelector('.content'),
    textValue = 'Some text example...';

// Load CSS
require('normalize.css');

document.body.style.padding = '10px';

function onChange(value, name) {
    render(name, value);
    console.log(name, ' => ', value);
}

function render(name, value) {
    _reactDom2.default.render(_react2.default.createElement(_2.default, { name: name, value: value, onChange: onChange }), container);
}

render('example', textValue);