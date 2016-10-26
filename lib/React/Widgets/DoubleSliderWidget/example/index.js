'use strict';

require('babel-polyfill');

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function onChange(name, value) {
    console.log(name, value);
}

_reactDom2.default.render(_react2.default.createElement(_2.default, {
    name: 'sample',
    min: '0',
    max: '100',
    value: 50,
    onChange: onChange
}), document.querySelector('.content'));