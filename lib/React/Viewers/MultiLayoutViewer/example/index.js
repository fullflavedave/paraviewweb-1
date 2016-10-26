define(['react', 'react-dom', 'mout/src/array/equals', '../../../../Rendering/Image/DataProberImageBuilder', '../../../../Rendering/Painter/LineChartPainter', '../../../../Common/Core/LookupTableManager', '..', '../../../../IO/Core/QueryDataModel', 'tonic-arctic-sample-data/data/probe/index.json', 'normalize.css'], function (_react, _reactDom, _equals, _DataProberImageBuilder, _LineChartPainter, _LookupTableManager, _, _QueryDataModel, _index) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _equals2 = _interopRequireDefault(_equals);

    var _DataProberImageBuilder2 = _interopRequireDefault(_DataProberImageBuilder);

    var _LineChartPainter2 = _interopRequireDefault(_LineChartPainter);

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
        dataModel = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/probe/'),
        lutManager = new _LookupTableManager2.default(),
        imageBuilderA = new _DataProberImageBuilder2.default(dataModel, lutManager),
        imageBuilderB = new _DataProberImageBuilder2.default(dataModel, lutManager),
        imageBuilderC = new _DataProberImageBuilder2.default(dataModel, lutManager),
        xChartPainter = new _LineChartPainter2.default("X: {x}"),
        yChartPainter = new _LineChartPainter2.default("Y: {x}"),
        zChartPainter = new _LineChartPainter2.default("Z: {x}"),
        dimensions = dataModel.originalData.InSituDataProber.dimensions;

    // Configure Image builders
    imageBuilderA.setRenderMethod(imageBuilderA.getRenderMethods()[0]);
    imageBuilderB.setRenderMethod(imageBuilderA.getRenderMethods()[1]);
    imageBuilderC.setRenderMethod(imageBuilderA.getRenderMethods()[2]);

    imageBuilderA.setRenderMethodImutable();
    imageBuilderB.setRenderMethodImutable();
    imageBuilderC.setRenderMethodImutable();

    imageBuilderA.setProbeLineNotification(true);
    imageBuilderB.setProbeLineNotification(true);
    imageBuilderC.setProbeLineNotification(true);

    function updateProbeLocation(data, envelope) {
        var builders = [imageBuilderA, imageBuilderB, imageBuilderC];

        builders.forEach(function (builder) {
            if (!(0, _equals2.default)(data, builder.getProbe())) {
                builder.setProbe(data[0], data[1], data[2]);
            }
        });

        // Update charts
        xChartPainter.setMarkerLocation(data[0] / (dimensions[0] - 1));
        yChartPainter.setMarkerLocation(data[1] / (dimensions[1] - 1));
        zChartPainter.setMarkerLocation(data[2] / (dimensions[2] - 1));
    }

    imageBuilderA.onProbeChange(updateProbeLocation);
    imageBuilderB.onProbeChange(updateProbeLocation);
    imageBuilderC.onProbeChange(updateProbeLocation);

    function updateCrosshairVisibility(data, envelope) {
        var builders = [imageBuilderA, imageBuilderB, imageBuilderC];

        builders.forEach(function (builder) {
            builder.setCrossHairEnable(data);
        });

        // Update charts
        xChartPainter.enableMarker(data);
        yChartPainter.enableMarker(data);
        zChartPainter.enableMarker(data);
    }

    imageBuilderA.onCrosshairVisibilityChange(updateCrosshairVisibility);
    imageBuilderB.onCrosshairVisibilityChange(updateCrosshairVisibility);
    imageBuilderC.onCrosshairVisibilityChange(updateCrosshairVisibility);

    // Line Chart handling
    imageBuilderA.onProbeLineReady(updateChartPainters);
    imageBuilderB.onProbeLineReady(updateChartPainters);
    imageBuilderC.onProbeLineReady(updateChartPainters);

    function updateChartPainters(data, envelope) {
        if (data.x.fields[0].data.length) {
            xChartPainter.updateData(data.x);
        }
        if (data.y.fields[0].data.length) {
            yChartPainter.updateData(data.y);
        }
        if (data.z.fields[0].data.length) {
            zChartPainter.updateData(data.z);
        }
    }

    // Create UI element
    _reactDom2.default.render(_react2.default.createElement(_2.default, {
        queryDataModel: dataModel,
        renderers: {
            'XY': { builder: imageBuilderA, name: 'XY' },
            'ZY': { builder: imageBuilderB, name: 'ZY' },
            'XZ': { builder: imageBuilderC, name: 'XZ' },
            'Chart X': { painter: xChartPainter, name: 'Chart X' },
            'Chart Y': { painter: yChartPainter, name: 'Chart Y' },
            'Chart Z': { painter: zChartPainter, name: 'Chart Z' }
        }
    }), bodyElement);

    dataModel.fetchData();
});