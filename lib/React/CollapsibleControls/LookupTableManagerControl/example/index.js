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

    document.body.style.padding = '10px';

    // Create needed property
    var lookupTableManager = new _LookupTableManager2.default();

    // Add several LookupTables
    lookupTableManager.addLookupTable('Temperature', [-5, 25], 'cold2warm');
    lookupTableManager.addLookupTable('Pressure', [0, 15000], 'spectral');
    lookupTableManager.addLookupTable('Velocity', [5, 150], 'rainbow');

    // Render
    _reactDom2.default.render(_react2.default.createElement(_2.default, {
        field: 'Temperature',
        lookupTableManager: lookupTableManager }), document.querySelector('.content'));
});