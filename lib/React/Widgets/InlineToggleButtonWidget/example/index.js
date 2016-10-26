'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('font-awesome/css/font-awesome.css');
require('normalize.css');
var logo = require('../../../../../documentation/images/ui.png');

function onChange(obj, idx) {
    console.log('Active', obj, idx);
}

(0, _reactDom.render)(_react2.default.createElement(_2.default, {
    activeColor: 'red',
    defaultColor: 'green',
    height: '0.75em',
    options: [{ label: 'First' }, { label: 'A' }, { label: 'B' }, { label: 'C' }, { img: logo }, { icon: 'fa fa-twitter' }, { label: 'Last' }],
    onChange: onChange
}), document.querySelector('.content'));