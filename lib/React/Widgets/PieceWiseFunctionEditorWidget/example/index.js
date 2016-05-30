'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = document.querySelector('.content');

function onChange(list) {
  console.log(list);
}

container.style.height = "50%";
container.style.width = "50%";

_reactDom2.default.render(_react2.default.createElement(_2.default, { rangeMin: 0, rangeMax: 100, onChange: onChange }), container);

document.body.style.margin = '10px';