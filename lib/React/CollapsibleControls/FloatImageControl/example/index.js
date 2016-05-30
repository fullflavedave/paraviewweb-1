'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _pipeline = require('./pipeline.js');

var _pipeline2 = _interopRequireDefault(_pipeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

document.body.style.padding = '10px';

var layerMapByName = {},
    state = {
    light: 200
},
    model = {
    dimensions: _pipeline2.default.dimensions,
    onProbeChange: function onProbeChange() {
        return null;
    },
    getTimeProbe: function getTimeProbe() {
        return {
            enabled: false,
            query: null,
            draw: false
        };
    },
    getLayers: function getLayers() {
        return _pipeline2.default.layers;
    },
    getLight: function getLight() {
        return state.light;
    },
    setLight: function setLight(v) {
        state.light = v;
    },
    isMultiView: function isMultiView() {
        return false;
    },
    updateMaskLayerVisibility: function updateMaskLayerVisibility(name, value) {
        layerMapByName[name].meshActive = value;
        render();
    },
    updateLayerVisibility: function updateLayerVisibility(name, value) {
        layerMapByName[name].active = value;
        render();
    },
    updateLayerColorBy: function updateLayerColorBy(name, value) {
        layerMapByName[name].array = value;
        render();
    }
};

// Fill map
_pipeline2.default.layers.forEach(function (item) {
    layerMapByName[item.name] = item;
});

// Keep element for rerendering it
var element = _react2.default.createElement(_2.default, { model: model });

function render() {
    _reactDom2.default.render(element, document.querySelector('.content'));
}

render();