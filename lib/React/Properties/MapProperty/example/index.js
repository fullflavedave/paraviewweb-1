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

var container = document.querySelector('.content');

var properties = {
  data: { value: [], id: 'map.property.id' },
  help: 'Dynamic property list',
  name: 'Map',
  onChange: function onChange(data) {
    console.log(data);
  },
  show: function show() {
    return true;
  },
  ui: { label: 'Custom constants', help: 'Dynamic property list' },
  viewData: {}
};

_reactDom2.default.render(_react2.default.createElement(_2.default, properties), container);

document.body.style.margin = '10px';