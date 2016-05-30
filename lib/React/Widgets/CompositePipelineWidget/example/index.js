'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _PipelineState = require('../../../../Common/State/PipelineState');

var _PipelineState2 = _interopRequireDefault(_PipelineState);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _info = require('./info.js');

var _info2 = _interopRequireDefault(_info);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');
document.body.style.padding = '10px';

var model = new _PipelineState2.default(_info2.default);

var component = _reactDom2.default.render(_react2.default.createElement(_2.default, { pipeline: _info2.default.CompositePipeline, model: model }), document.querySelector('.content'));

model.onChange(function (data, envelope) {
    component.forceUpdate();
});