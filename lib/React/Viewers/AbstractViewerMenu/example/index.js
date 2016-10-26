define(['..', '../../../../IO/Core/QueryDataModel', '../../../../Rendering/Image/QueryDataModelImageBuilder', 'react', 'react-dom', 'tonic-arctic-sample-data/data/earth/index.json', 'normalize.css'], function (_, _QueryDataModel, _QueryDataModelImageBuilder, _react, _reactDom, _index) {
    'use strict';

    var _2 = _interopRequireDefault(_);

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _QueryDataModelImageBuilder2 = _interopRequireDefault(_QueryDataModelImageBuilder);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _index2 = _interopRequireDefault(_index);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    /* global __BASE_PATH__ */
    var bodyElement = document.querySelector('.content'),
        queryDataModel = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/earth/'),
        imageBuilder = new _QueryDataModelImageBuilder2.default(queryDataModel);

    _reactDom2.default.render(_react2.default.createElement(_2.default, {
        queryDataModel: queryDataModel,
        imageBuilder: imageBuilder,
        children: [_react2.default.createElement(
            'p',
            { key: 'a' },
            'This is the ',
            _react2.default.createElement(
                'em',
                null,
                'AbstractViewerMenu'
            ),
            ', takes a QueryDataModel and this content.'
        ), _react2.default.createElement(
            'p',
            { key: 'b' },
            'You can put HTML or a React component here, a ',
            _react2.default.createElement(
                'em',
                null,
                'QueryDataModelWidget'
            ),
            ' for example goes well here.'
        ), _react2.default.createElement(
            'button',
            { key: 'c', onClick: function onClick() {
                    return alert('button pressed');
                } },
            'Press me'
        )]
    }), bodyElement);

    queryDataModel.fetchData();
});