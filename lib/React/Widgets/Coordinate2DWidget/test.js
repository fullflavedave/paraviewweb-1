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

    describe('CoordinateControl', function () {
        afterEach(function (done) {
            _reactDom2.default.unmountComponentAtNode(document.body);
            document.body.innerHTML = '';
            setTimeout(done);
        });

        function convertToCoord(val, size) {
            return (val * 2 / (size * 2) - 0.5) * 2;
        }

        it('has two inputs and a canvas', function () {
            var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { hideXY: false })),
                canvas = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'canvas'),
                inputs = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'input');
            (0, _expect2.default)(canvas.length).toBe(1);
            (0, _expect2.default)(inputs.length).toBe(2);
            (0, _expect2.default)(inputs[0].value).toBe(inputs[1].value);
        });
        it('can hide XY inputs', function () {
            var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { hideXY: true })),
                inputsContainer = _ReactTestUtils2.default.findRenderedDOMComponentWithClass(el, 'inputs');
            (0, _expect2.default)(inputsContainer.classList.contains('is-hidden')).toBe(true);
        });
        it('keeps coordinate state and XY inputs in sync', function () {
            var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, null)),
                inputs = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'input'),
                newXVal = 0.60,
                newYVal = -0.45;
            _ReactTestUtils2.default.Simulate.change(inputs[0], { target: { value: newXVal } });
            _ReactTestUtils2.default.Simulate.change(inputs[1], { target: { value: newYVal } });

            (0, _expect2.default)(el.coordinates()).toEqual({ x: newXVal, y: newYVal });
        });
        it('can update coordinates externally', function () {
            var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { x: 0.25, y: 0.45 })),
                newXVal = -0.25,
                newYVal = -0.45;

            el.updateCoordinates({ x: newXVal, y: newYVal });
            (0, _expect2.default)(el.coordinates()).toEqual({ x: newXVal, y: newYVal });
        });
        it('updates values when dragged', function () {
            var size = 400,
                el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { x: 0.25, y: 0.45, width: size, height: size })),
                canvas = _ReactTestUtils2.default.findRenderedDOMComponentWithTag(el, 'canvas'),
                newXVal = 100,
                newYVal = 200;

            el.mouseHandler.emit('drag', { pointers: [{ clientX: newXVal, clientY: newYVal }] });
            (0, _expect2.default)(el.coordinates()).toEqual({ x: convertToCoord(newXVal, size), y: -convertToCoord(newYVal, size) });
        });
        it('triggers a given onChange function', function () {
            var Mock = _react2.default.createClass({
                displayName: 'Mock',
                getInitialState: function getInitialState() {
                    return { x: 0, y: 0 };
                },
                updateCoords: function updateCoords(newVals) {
                    this.setState({ x: newVals.x, y: newVals.y });
                },
                render: function render() {
                    return _react2.default.createElement(_index2.default, { onChange: this.updateCoords });
                }
            });
            var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(Mock, null)),
                input = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'input')[0],
                newXVal = 0.88;

            _ReactTestUtils2.default.Simulate.change(input, { target: { value: newXVal } });
            (0, _expect2.default)(el.state.x).toEqual(newXVal);
        });
        it('takes a click on the canvas and updates it to state', function () {
            var size = 400,
                el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { width: size, height: size })),
                canvas = _ReactTestUtils2.default.findRenderedDOMComponentWithTag(el, 'canvas'),
                newXVal = 100,
                newYVal = 200;
            (0, _expect2.default)(canvas.width).toBe(size);
            (0, _expect2.default)(canvas.height).toBe(size);

            el.mouseHandler.emit('click', { pointers: [{ clientX: newXVal, clientY: newYVal }] });
            (0, _expect2.default)(el.state.x).toBe(convertToCoord(newXVal, size));
            (0, _expect2.default)(el.state.y).toBe(-convertToCoord(newYVal, size));

            newXVal = 350;
            newYVal = 120;
            el.mouseHandler.emit('click', { pointers: [{ clientX: newXVal, clientY: newYVal }] });
            (0, _expect2.default)(el.state.x).toBe(convertToCoord(newXVal, size));
            (0, _expect2.default)(el.state.y).toBe(-convertToCoord(newYVal, size));
        });
        it('destroys listeners when removed', function () {
            var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, null));
            _reactDom2.default.unmountComponentAtNode(_reactDom2.default.findDOMNode(el).parentNode);
            (0, _expect2.default)(el.mouseHandler.hammer.element).toNotExist();
        });
    });
});