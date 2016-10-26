define(['../../../Widgets/QueryDataModelWidget/example/info.js', '../../../../IO/Core/QueryDataModel', '..', 'react', 'react-dom', 'babel-polyfill', 'normalize.css'], function (_info, _QueryDataModel, _, _react, _reactDom) {
    'use strict';

    var _info2 = _interopRequireDefault(_info);

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // Get react component
    var dataModel = new _QueryDataModel2.default(_info2.default, '/');

    document.body.style.padding = '10px';

    _reactDom2.default.render(_react2.default.createElement(_2.default, { model: dataModel, handleExploration: true }), document.querySelector('.content'));
});