'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = document.querySelector('.content');

// Load CSS
require('normalize.css');
require('font-awesome/css/font-awesome.css');

document.body.style.padding = '10px';

function onChange(value, name) {
    console.log(name, ' => ', value);
}

_reactDom2.default.render(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_2.default, { name: 'wifi', icon: 'fa-wifi', value: true, onChange: onChange }),
    _react2.default.createElement(_2.default, { name: 'btooth', icon: 'fa-bluetooth', value: false, onChange: onChange }),
    _react2.default.createElement(_2.default, { name: 'a', icon: 'fa-at', onChange: onChange }),
    _react2.default.createElement(_2.default, { name: 'b', icon: 'fa-ban', toggle: true, onChange: onChange }),
    _react2.default.createElement(_2.default, { name: 'c', icon: 'fa-bank', alwaysOn: true, onChange: onChange })
), container);