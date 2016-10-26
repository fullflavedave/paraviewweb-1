'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactTestUtils = require('react/lib/ReactTestUtils');

var _ReactTestUtils2 = _interopRequireDefault(_ReactTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ButtonSelector', function () {

    afterEach(function (done) {
        _reactDom2.default.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('lists buttons given an array of objects', function () {
        var options = [{ name: "Choice A" }, { name: "Choice B" }, { name: "Choice C" }],
            el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { list: options })),
            buttons = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'button');

        (0, _expect2.default)(buttons.length).toBe(options.length);
        (0, _expect2.default)(buttons[0].name).toBe(options[0].name);
    });

    it('lists buttons given an array of objects', function () {
        var changling = 0,
            countOut = -1,
            arrayOut = [],
            options = [{ name: "Choice A" }, { name: "Choice B" }, { name: "Choice C" }],
            el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, { list: options, onChange: function onChange(count, array) {
                changling += 1;
                countOut = count;
                arrayOut = array;
            } })),
            buttons = _ReactTestUtils2.default.scryRenderedDOMComponentsWithTag(el, 'button');

        _ReactTestUtils2.default.Simulate.click(buttons[0]);
        (0, _expect2.default)(changling).toEqual(1);
        (0, _expect2.default)(countOut).toEqual(0);
        (0, _expect2.default)(arrayOut).toEqual(options);
    });
});