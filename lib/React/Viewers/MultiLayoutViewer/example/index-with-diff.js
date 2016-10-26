define(['react', 'react-dom', '../../../../Rendering/Image/DataProberImageBuilder', '../../../../Rendering/Image/PixelOperatorImageBuilder', '../../../../Common/Core/LookupTableManager', '..', '../../../../IO/Core/QueryDataModel', 'tonic-arctic-sample-data/data/probe/index.json', 'normalize.css'], function (_react, _reactDom, _DataProberImageBuilder, _PixelOperatorImageBuilder, _LookupTableManager, _, _QueryDataModel, _index) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _DataProberImageBuilder2 = _interopRequireDefault(_DataProberImageBuilder);

    var _PixelOperatorImageBuilder2 = _interopRequireDefault(_PixelOperatorImageBuilder);

    var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

    var _2 = _interopRequireDefault(_);

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _index2 = _interopRequireDefault(_index);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    /* global __BASE_PATH__ */
    var bodyElement = document.querySelector('.content'),
        dataModelA = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/probe/'),
        dataModelB = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/probe/'),
        dataModelC = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/probe/'),
        lutManager = new _LookupTableManager2.default(),
        imageBuilderA = new _DataProberImageBuilder2.default(dataModelA, lutManager),
        imageBuilderB = new _DataProberImageBuilder2.default(dataModelB, lutManager),
        imageBuilderC = new _DataProberImageBuilder2.default(dataModelC, lutManager),
        diffImageBuilder = new _PixelOperatorImageBuilder2.default();

    // Handling Diff computation
    imageBuilderA.onImageReady(function (data, envelope) {
        diffImageBuilder.updateData('a', data);
    });
    imageBuilderB.onImageReady(function (data, envelope) {
        diffImageBuilder.updateData('b', data);
    });
    imageBuilderC.onImageReady(function (data, envelope) {
        diffImageBuilder.updateData('c', data);
    });

    function updateCrosshairVisibility(data, envelope) {
        var builders = [imageBuilderA, imageBuilderB, imageBuilderC];

        builders.forEach(function (builder) {
            builder.setCrossHairEnable(data);
        });
    }

    imageBuilderA.onCrosshairVisibilityChange(updateCrosshairVisibility);
    imageBuilderB.onCrosshairVisibilityChange(updateCrosshairVisibility);
    imageBuilderC.onCrosshairVisibilityChange(updateCrosshairVisibility);

    // Create UI element
    _reactDom2.default.render(_react2.default.createElement(_2.default, {
        queryDataModel: dataModelA,
        renderers: {
            'a': { builder: imageBuilderA, name: 'a' },
            'b': { builder: imageBuilderB, name: 'b' },
            'c': { builder: imageBuilderC, name: 'c' },
            'Operation': { builder: diffImageBuilder, name: 'Operation' }
        }
    }), bodyElement);

    dataModelA.fetchData();
    dataModelB.fetchData();
    dataModelC.fetchData();
});