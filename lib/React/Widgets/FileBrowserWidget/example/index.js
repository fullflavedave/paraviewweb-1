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

function onAction(type, files, aaa) {
    console.log(type, files, aaa);
}

(0, _reactDom.render)(_react2.default.createElement(_2.default, {
    directories: ['a', 'b', 'c'],
    groups: [{ label: 'd', files: ['da', 'db', 'dc'] }, { label: 'e', files: ['ea', 'eb', 'ec'] }, { label: 'f', files: ['fa', 'fb', 'fc'] }],
    files: ['g', 'h', 'i', 'Super long name with not much else bla bla bla bla bla bla bla bla bla bla bla bla.txt'],
    onAction: onAction,
    path: ['Home', 'subDir1', 'subDir2', 'subDir3']
}), document.querySelector('.content'));