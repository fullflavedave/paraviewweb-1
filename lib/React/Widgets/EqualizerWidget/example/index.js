'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.body.style.margin = 0;
document.body.style.padding = 0;
document.querySelector('.content').style.height = '98vh';

function onChange(opacityList) {
    console.log(opacityList);
}

(0, _reactDom.render)(_react2.default.createElement(_2.default, {
    layers: [0, 0.1, 0.2, 1.0, 0.8, 0.4, 0.1, 0.2, 1.0, 0.8, 0.4, 0.1, 0.2, 1.0, 0.8, 0.4, 0.1, 0.2, 1.0, 0.8],
    onChange: onChange,
    height: 512
}), document.querySelector('.content'));