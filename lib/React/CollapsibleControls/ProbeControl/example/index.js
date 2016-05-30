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

var crossHair = true,
    renderMethod = 'XY';

var callbacks = {
    probeChange: [],
    lineReady: []
},
    probeValue = [1, 2, 4],
    imageBuilder = {
    getProbe: function getProbe() {
        return probeValue;
    },
    onProbeChange: function onProbeChange(c) {
        callbacks.probeChange.push(c);
        return null;
    },
    onProbeLineReady: function onProbeLineReady(c) {
        callbacks.lineReady.push(c);
        return null;
    },
    setRenderMethod: function setRenderMethod(m) {
        renderMethod = m;
    },
    getRenderMethod: function getRenderMethod() {
        return renderMethod;
    },
    getRenderMethods: function getRenderMethods() {
        return ['XY', 'XZ', 'YZ'];
    },
    render: function render() {},
    setProbe: function setProbe(i, j, k) {
        probeValue[0] = i;
        probeValue[1] = j;
        probeValue[2] = k;
        callbacks.probeChange.forEach(function (cb) {
            cb(probeValue);
        });
    },
    setCrossHairEnable: function setCrossHairEnable(e) {
        crossHair = !!e;
    },
    isCrossHairEnabled: function isCrossHairEnabled() {
        return crossHair;
    },
    isRenderMethodMutable: function isRenderMethodMutable() {
        return true;
    },
    getFieldValueAtProbeLocation: function getFieldValueAtProbeLocation() {
        return Math.random();
    },

    metadata: {
        dimensions: [10, 20, 30]
    }
},
    imageBuilders = {},
    container = document.querySelector('.content');

_reactDom2.default.render(_react2.default.createElement(_2.default, { imageBuilder: imageBuilder, imageBuilders: imageBuilders }), container);

document.body.style.margin = '10px';