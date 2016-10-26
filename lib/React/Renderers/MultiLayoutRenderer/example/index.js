define(['react', 'react-dom', 'mout/src/array/equals', '..', '../../../../Common/Core/LookupTableManager', '../../../../IO/Core/QueryDataModel', '../../../../Rendering/Image/DataProberImageBuilder', 'tonic-arctic-sample-data/data/probe/index.json', 'normalize.css'], function (_react, _reactDom, _equals, _, _LookupTableManager, _QueryDataModel, _DataProberImageBuilder, _index) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _equals2 = _interopRequireDefault(_equals);

    var _2 = _interopRequireDefault(_);

    var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

    var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

    var _DataProberImageBuilder2 = _interopRequireDefault(_DataProberImageBuilder);

    var _index2 = _interopRequireDefault(_index);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    /* global __BASE_PATH__ */
    var container = document.querySelector('.content'),
        dataModel = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/probe/'),
        lutManager = new _LookupTableManager2.default(),
        imageBuilderA = new _DataProberImageBuilder2.default(dataModel, lutManager),
        imageBuilderB = new _DataProberImageBuilder2.default(dataModel, lutManager),
        imageBuilderC = new _DataProberImageBuilder2.default(dataModel, lutManager);

    // Configure Image builders
    var field = imageBuilderA.getFields()[0];
    imageBuilderA.setField(field);
    imageBuilderB.setField(field);
    imageBuilderC.setField(field);

    imageBuilderA.setProbe(10, 10, 10);
    imageBuilderB.setProbe(10, 10, 10);
    imageBuilderC.setProbe(10, 10, 10);

    imageBuilderA.renderMethod = 'XY';
    imageBuilderB.renderMethod = 'ZY';
    imageBuilderC.renderMethod = 'XZ';

    imageBuilderA.update();
    imageBuilderB.update();
    imageBuilderC.update();

    function updateProbeLocationFromA(data, envelope) {
        var builders = [imageBuilderB, imageBuilderC];

        builders.forEach(function (builder) {
            if (!(0, _equals2.default)(data, builder.getProbe())) {
                builder.setProbe(data[0], data[1], data[2]);
            }
        });
    }
    function updateProbeLocationFromB(data, envelope) {
        var builders = [imageBuilderA, imageBuilderC];

        builders.forEach(function (builder) {
            if (!(0, _equals2.default)(data, builder.getProbe())) {
                builder.setProbe(data[0], data[1], data[2]);
            }
        });
    }
    function updateProbeLocationFromC(data, envelope) {
        var builders = [imageBuilderA, imageBuilderB];

        builders.forEach(function (builder) {
            if (!(0, _equals2.default)(data, builder.getProbe())) {
                builder.setProbe(data[0], data[1], data[2]);
            }
        });
    }
    imageBuilderA.onProbeChange(updateProbeLocationFromA);
    imageBuilderB.onProbeChange(updateProbeLocationFromB);
    imageBuilderC.onProbeChange(updateProbeLocationFromC);

    // Configure container
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';

    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'absolute';

    _reactDom2.default.render(_react2.default.createElement(_2.default, {
        renderers: {
            'XY': { builder: imageBuilderA, name: 'XY' },
            'ZY': { builder: imageBuilderB, name: 'ZY' },
            'XZ': { builder: imageBuilderC, name: 'XZ' }
        }
    }), container);

    dataModel.fetchData();
});