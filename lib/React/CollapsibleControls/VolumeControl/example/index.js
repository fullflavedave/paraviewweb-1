define(['../../../../Common/State/EqualizerState', '../../../../Common/Core/LookupTableManager', 'react', 'react-dom', '../../../../Common/State/ToggleState', '..', 'normalize.css'], function (_EqualizerState, _LookupTableManager, _react, _reactDom, _ToggleState, _) {
    'use strict';

    var _EqualizerState2 = _interopRequireDefault(_EqualizerState);

    var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _ToggleState2 = _interopRequireDefault(_ToggleState);

    var _2 = _interopRequireDefault(_);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

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
});