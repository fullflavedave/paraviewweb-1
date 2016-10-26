define(['../../../../Rendering/Image/DataProberImageBuilder', 'tonic-arctic-sample-data/data/probe/index.json', '../../../../Common/Core/LookupTableManager', '..', '../../../../IO/Core/QueryDataModel', 'react', 'react-dom', 'normalize.css'], function (_DataProberImageBuilder, _index, _LookupTableManager, _, _QueryDataModel, _react, _reactDom) {
    'use strict';

    var _DataProberImageBuilder2 = _interopRequireDefault(_DataProberImageBuilder);

    var _index2 = _interopRequireDefault(_index);

    var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

    var _2 = _interopRequireDefault(_);

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var bodyElement = document.querySelector('.content');

    // Fix dimension
    _index2.default.metadata.dimensions = [50, 50, 50];

    /* global __BASE_PATH__ */
    var dataModel = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/probe/');

    _reactDom2.default.render(_react2.default.createElement(_2.default, {
        queryDataModel: dataModel,
        imageBuilder: new _DataProberImageBuilder2.default(dataModel, new _LookupTableManager2.default()),
        probe: true
    }), bodyElement);

    setImmediate(function () {
        dataModel.fetchData();
    });
});