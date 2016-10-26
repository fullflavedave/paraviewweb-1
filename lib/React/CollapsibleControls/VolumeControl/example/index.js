'use strict';

var _EqualizerState = require('../../../../Common/State/EqualizerState');

var _EqualizerState2 = _interopRequireDefault(_EqualizerState);

var _LookupTableManager = require('../../../../Common/Core/LookupTableManager');

var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ToggleState = require('../../../../Common/State/ToggleState');

var _ToggleState2 = _interopRequireDefault(_ToggleState);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

var computation = new _ToggleState2.default(),
    intensity = new _ToggleState2.default(),
    equalizer = new _EqualizerState2.default({ size: 26 }),
    lookupTableManager = new _LookupTableManager2.default(),
    lookupTable = {
    originalRange: [-5, 15],
    lookupTableManager: lookupTableManager,
    lookupTable: lookupTableManager.addLookupTable('demo', [-5, 15], 'spectral')
},
    container = document.querySelector('.content');

_reactDom2.default.render(_react2.default.createElement(_2.default, { computation: computation, equalizer: equalizer, intensity: intensity, lookupTable: lookupTable }), container);

document.body.style.margin = '10px';