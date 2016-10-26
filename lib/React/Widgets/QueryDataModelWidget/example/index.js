define(['../../../../IO/Core/QueryDataModel', '..', 'react', 'react-dom', './info.js', 'normalize.css'], function (_QueryDataModel, _, _react, _reactDom, _info) {
    'use strict';

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _info2 = _interopRequireDefault(_info);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // Get react component
    var dataModel = new _QueryDataModel2.default(_info2.default, '/');

    document.body.style.padding = '10px';

    _reactDom2.default.render(_react2.default.createElement(_2.default, { model: dataModel }), document.querySelector('.content'));
});