'use strict';

require('babel-polyfill');

var _info = require('../../../Widgets/QueryDataModelWidget/example/info.js');

var _info2 = _interopRequireDefault(_info);

var _QueryDataModel = require('../../../../IO/Core/QueryDataModel');

var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

// Get react component
var dataModel = new _QueryDataModel2.default(_info2.default, '/');

document.body.style.padding = '10px';

_reactDom2.default.render(_react2.default.createElement(_2.default, { model: dataModel, handleExploration: true }), document.querySelector('.content'));