define(['react', 'react-dom', '..', '../../../../IO/Core/QueryDataModel', '../../../../Rendering/Image/QueryDataModelImageBuilder', 'tonic-arctic-sample-data/data/earth/index.json', 'normalize.css'], function (_react, _reactDom, _, _QueryDataModel, _QueryDataModelImageBuilder, _index) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _2 = _interopRequireDefault(_);

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _QueryDataModelImageBuilder2 = _interopRequireDefault(_QueryDataModelImageBuilder);

    var _index2 = _interopRequireDefault(_index);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    /* global __BASE_PATH__ */
    var queryDataModel = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/earth/'),
        imageBuilder = new _QueryDataModelImageBuilder2.default(queryDataModel);

    _reactDom2.default.render(_react2.default.createElement(_2.default, { queryDataModel: queryDataModel, imageBuilder: imageBuilder }), document.querySelector('.content'));

    queryDataModel.fetchData();
});