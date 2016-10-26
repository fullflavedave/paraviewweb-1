define(['./index', 'expect', 'react', 'react-dom', 'react/lib/ReactTestUtils'], function (_index, _expect, _react, _reactDom, _ReactTestUtils) {
    'use strict';

    var _index2 = _interopRequireDefault(_index);

    var _expect2 = _interopRequireDefault(_expect);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _ReactTestUtils2 = _interopRequireDefault(_ReactTestUtils);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    describe('ColorPicker', function () {

        afterEach(function (done) {
            _reactDom2.default.unmountComponentAtNode(document.body);
            document.body.innerHTML = '';
            setTimeout(done);
        });

        it('has an initial start color', function () {
            var startColor = [20, 40, 80],
                el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { color: startColor }));

            (0, _expect2.default)(el.state.color).toEqual(startColor);
        });

        it('changes color state when an input changes', function () {
            var startColor = [20, 40, 80],
                el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { color: startColor })),
                inputs = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'input'),
                newVal = 255;

            _ReactTestUtils2.default.Simulate.change(inputs[0], { target: { value: newVal, dataset: { colorIdx: 0 } } });
            (0, _expect2.default)(el.state.color).toEqual([255, 40, 80]);
        });

        it('can change color with a function', function () {
            var startColor = [20, 40, 80],
                newColor = [255, 255, 255],
                el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { color: startColor }));

            el.updateColor(newColor);
            (0, _expect2.default)(el.state.originalColor).toEqual(newColor);
        });

        // detatched dom, img has no height and cannot be clicked on.
        // it('changes color when you click on the image', function() {
        //     var startColor = [0,0,0],
        //         el = TestUtils.renderIntoDocument(<ColorPicker color={startColor}/>);

        //     TestUtils.Simulate.click(el.refs.swatch, {pageX: 100, pageY: 100});
        //     expect(el.state.color).toEqual([54,63,251]);
        // });
    });
});