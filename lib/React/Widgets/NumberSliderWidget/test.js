'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactTestUtils = require('react/lib/ReactTestUtils');

var _ReactTestUtils2 = _interopRequireDefault(_ReactTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('NumberSliderControl', function () {
    afterEach(function (done) {
        _reactDom2.default.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('has two inputs whose values are equal', function () {
        var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { min: 20, value: 25, max: 30 })),
            inputs = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'input');
        (0, _expect2.default)(inputs.length).toBe(2);
        (0, _expect2.default)(inputs[0].value).toBe(inputs[1].value);
    });
    it('takes an external value and a value can be read with the same function', function () {
        var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, null)),
            newVal = 75;

        el.value(newVal);
        (0, _expect2.default)(el.value()).toEqual(newVal);
    });
    it('clamps a value if a given value is too big', function () {
        var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, null)),
            newVal = 250,
            expectedVal = 100;

        el.value(newVal);
        (0, _expect2.default)(el.value()).toEqual(expectedVal);
    });
    it('keeps the values of two inputs the same', function () {

        var oldName = 'razzmatazz',
            newName = 'pogo',
            Mock = _react2.default.createClass({
            displayName: 'Mock',
            getInitialState: function getInitialState() {
                return { val: 25, name: 'razzmatazz' };
            },
            updateVal: function updateVal(e) {
                this.setState({ val: e.target.value, name: e.target.name });
            },
            render: function render() {
                return _react2.default.createElement(_index2.default, { name: newName,
                    min: 20, max: 30,
                    value: this.state.val,
                    onChange: this.updateVal });
            }
        });

        var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(Mock, null)),
            newVal = '28',
            inputSlider = _reactDom2.default.findDOMNode(el).querySelector('input[type=range]'),
            inputField = _reactDom2.default.findDOMNode(el).querySelector('input[type=number]');

        (0, _expect2.default)(el.state.val).toEqual(25); //sanity
        (0, _expect2.default)(el.state.name).toEqual(oldName); //sanity

        _ReactTestUtils2.default.Simulate.change(inputSlider, { target: { value: newVal } });
        (0, _expect2.default)(el.state.val).toEqual(newVal);
        (0, _expect2.default)(el.state.name).toEqual(newName);
        (0, _expect2.default)(inputField.value).toEqual(newVal);
    });
});