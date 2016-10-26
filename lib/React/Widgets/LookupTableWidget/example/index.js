define(['../../../../Common/Core/LookupTableManager', '..', 'react', 'react-dom', 'normalize.css'], function (_LookupTableManager, _, _react, _reactDom) {
    'use strict';

    var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // Get react component
    var lookupTableManager = new _LookupTableManager2.default(),
        lookupTable = lookupTableManager.addLookupTable('demo', [-5, 15], 'spectral');

    document.body.style.padding = '10px';

    var component = _reactDom2.default.render(_react2.default.createElement(_2.default, {
        lookupTable: lookupTable,
        originalRange: [-5, 15],
        inverse: true,
        lookupTableManager: lookupTableManager
    }), document.querySelector('.content'));

    setTimeout(function () {
        component.resetRange();
    }, 500);
});