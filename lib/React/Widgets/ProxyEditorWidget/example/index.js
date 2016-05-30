'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _sourceProxy = require('./source-proxy.json');

var _sourceProxy2 = _interopRequireDefault(_sourceProxy);

var _representationProxy = require('./representation-proxy.json');

var _representationProxy2 = _interopRequireDefault(_representationProxy);

var _viewProxy = require('./view-proxy.json');

var _viewProxy2 = _interopRequireDefault(_viewProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

var container = document.querySelector('.content'),
    sections = [Object.assign({ name: 'source', collapsed: false }, _sourceProxy2.default), Object.assign({ name: 'representation', collapsed: true }, _representationProxy2.default), Object.assign({ name: 'view', collapsed: true }, _viewProxy2.default)];

_reactDom2.default.render(_react2.default.createElement(_2.default, { sections: sections }), container);

document.body.style.margin = '10px';