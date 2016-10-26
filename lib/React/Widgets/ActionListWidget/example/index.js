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
require('font-awesome/css/font-awesome.css');

var container = document.querySelector('.content'),
    list = [{ name: 'Menu', action: 'something', data: 'CustomData...', icon: 'fa fa-fw fa-bars' }, { name: 'Sub-menu', action: 'something else', icon: 'fa fa-fw fa-folder-o' }, { name: 'regular', action: 'justMe', icon: 'fa fa-fw ' }, { name: 'a', action: 'a', icon: 'fa fa-fw fa-file-o' }, { name: 'b', action: 'b', icon: 'fa fa-fw fa-file-o' }, { name: 'c', action: 'c', icon: 'fa fa-fw fa-file-o' }];

function onClick(name, action, user) {
    console.log(name, action, user);
}

_reactDom2.default.render(_react2.default.createElement(_2.default, { list: list, onClick: onClick }), container);

document.body.style.margin = '10px';