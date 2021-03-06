'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _QueryDataModel = require('../../../../IO/Core/QueryDataModel');

var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

var _DataProberImageBuilder = require('../../../../Rendering/Image/DataProberImageBuilder');

var _DataProberImageBuilder2 = _interopRequireDefault(_DataProberImageBuilder);

var _LookupTableManager = require('../../../../Common/Core/LookupTableManager');

var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

var _equals = require('mout/src/array/equals');

var _equals2 = _interopRequireDefault(_equals);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _ReactTestUtils = require('react/lib/ReactTestUtils');

var _ReactTestUtils2 = _interopRequireDefault(_ReactTestUtils);

var _index = require('tonic-arctic-sample-data/data/probe/index.json');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = document.querySelector('body'),
    dataModel = new _QueryDataModel2.default(_index2.default, 'tonic-arctic-sample-data/data/probe/'),
    lutManager = new _LookupTableManager2.default(),
    imageBuilderA = new _DataProberImageBuilder2.default(dataModel, lutManager),
    imageBuilderB = new _DataProberImageBuilder2.default(dataModel, lutManager),
    imageBuilderC = new _DataProberImageBuilder2.default(dataModel, lutManager);

describe('MultiViewRenderer', function () {

    var el;
    beforeAll(function () {
        // Taken from demo.
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

        el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(MultiViewRenderer, {
            renderers: {
                'XY': { builder: imageBuilderA, name: 'XY' },
                'ZY': { builder: imageBuilderB, name: 'ZY' },
                'XZ': { builder: imageBuilderC, name: 'XZ' }
            }
        }), container);

        dataModel.fetchData();
    });

    it('renders on a page', function () {
        (0, _expect2.default)(el).toExist();
    });

    it('can change layouts', function () {
        el.getLayouts().forEach(function (layout) {
            el.setLayout(layout);
            (0, _expect2.default)(el.getActiveLayout()).toEqual(layout);
        });
    });
});