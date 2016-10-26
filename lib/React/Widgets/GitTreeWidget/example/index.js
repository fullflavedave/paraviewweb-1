'use strict';

require('babel-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodes = [{ name: 'another branch', visible: true, id: '40', parent: '1' }, { name: 'child of branch', visible: false, id: '50', parent: '40' }, { name: 'branch of branch', visible: true, id: '51', parent: '40' }, { name: 'actually the final node', visible: true, id: '30', parent: '20' }, { name: 'other node', visible: true, id: '1', parent: '199' }, { name: 'top node', visible: false, id: '199', parent: '0' }, { name: 'branched node', visible: false, id: '10', parent: '1' }, { name: 'branched node child', visible: false, id: '11', parent: '10' }, { name: 'final node', visible: true, id: '20', parent: '1' }];

function onChange(event) {
    console.log(event);
}

_reactDom2.default.render(_react2.default.createElement(_2.default, {
    nodes: nodes,
    onChange: onChange,
    multiselect: true,
    enableDelete: true }), document.querySelector('.content'));