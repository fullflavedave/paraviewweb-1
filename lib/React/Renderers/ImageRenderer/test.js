define(['react', '../../../react/renderer/Image', 'expect', 'react/lib/ReactTestUtils'], function (_react, _Image, _expect, _ReactTestUtils) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _Image2 = _interopRequireDefault(_Image);

    var _expect2 = _interopRequireDefault(_expect);

    var _ReactTestUtils2 = _interopRequireDefault(_ReactTestUtils);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var container = document.createElement('body');

    describe('ImageRenderer', function () {

        var el;
        beforeAll(function () {

            el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_Image2.default, {}), container);

            el.renderImage({ url: 'http://www.paraview.org/wp-content/uploads/2015/03/LANL_ClimateExample.jpg' });
        });

        it('renders on a page', function () {
            (0, _expect2.default)(el).toExist();
        });

        it('has a dialog', function () {
            var dialog = _ReactTestUtils2.default.findRenderedDOMComponentWithClass(el, 'UpdateDialog');
            (0, _expect2.default)(dialog).toExist();

            var contents = _ReactTestUtils2.default.scryRenderedDOMComponentsWithClass(el, 'ContentEditable');
            (0, _expect2.default)(contents.length).toEqual(2);
            (0, _expect2.default)(contents[0].innerHTML).toBe('No title');
            (0, _expect2.default)(contents[1].innerHTML).toBe('No description');
        });

        it('can zoom on an image', function () {
            (0, _expect2.default)(el.zoom).toEqual(1); //sanity

            el.mouseHandler.emit('zoom', {
                scale: 2,
                relative: { x: 100, y: 100 }
            });
            (0, _expect2.default)(el.zoom).toEqual(2);

            // var evt = new KeyboardEvent('keydown', {keyCode: 82});
            // document.dispatchEvent(evt);
            // expect(el.zoom).toEqual(1);
        });
    });
});