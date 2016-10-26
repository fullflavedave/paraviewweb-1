'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

document.body.style.padding = '10px';

var layout = '2x2',
    renderMethod = 'XY';

var renderer = {
    onLayoutChange: function onLayoutChange() {
        return null;
    },
    onActiveViewportChange: function onActiveViewportChange() {
        return null;
    },
    getActiveRenderMethod: function getActiveRenderMethod() {
        return renderMethod;
    },
    getActiveLayout: function getActiveLayout() {
        return layout;
    },
    setLayout: function setLayout(l) {
        layout = l;
        console.log('setLayout', l);
    },
    setRenderMethod: function setRenderMethod(r) {
        renderMethod = r;
        console.log('setRenderMethod', r);
    },
    getRenderMethods: function getRenderMethods() {
        return ['XY', 'XZ', 'YZ'];
    }
};

_reactDom2.default.render(_react2.default.createElement(_2.default, { renderer: renderer }), document.querySelector('.content'));