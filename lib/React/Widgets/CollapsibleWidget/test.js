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

describe('CollapsibleElement', function () {

    afterEach(function (done) {
        _reactDom2.default.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('can be hidden completely', function () {
        var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(_index2.default, {
            visible: false })),
            container = _ReactTestUtils2.default.findRenderedDOMComponentWithClass(el, 'CollapsibleElement');
        (0, _expect2.default)(container.style.display).toEqual('none');
    });

    it('can be collapsed and expanded by clicking the header', function () {
        var el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(
            _index2.default,
            null,
            _react2.default.createElement(
                'strong',
                null,
                'Some Content'
            )
        )),
            header = _ReactTestUtils2.default.findRenderedDOMComponentWithClass(el, 'clickable-area');

        //close
        _ReactTestUtils2.default.Simulate.click(header);
        (0, _expect2.default)(el.state.open).toEqual(false);
        (0, _expect2.default)(el.isCollapsed()).toEqual(true);

        //open
        _ReactTestUtils2.default.Simulate.click(header);
        (0, _expect2.default)(el.state.open).toEqual(true);
        (0, _expect2.default)(el.isExpanded()).toEqual(true);
    });

    it('can take an onChange listener', function () {
        var Mock = _react2.default.createClass({
            displayName: 'Mock',
            getInitialState: function getInitialState() {
                return { open: false };
            },
            updateVal: function updateVal(newOpenVal) {
                this.setState({ open: newOpenVal });
            },
            render: function render() {
                return _react2.default.createElement(_index2.default, { open: this.state.open, onChange: this.updateVal });
            }
        }),
            el = _ReactTestUtils2.default.renderIntoDocument(_react2.default.createElement(Mock, null)),
            header = _ReactTestUtils2.default.findRenderedDOMComponentWithClass(el, 'clickable-area');

        _ReactTestUtils2.default.Simulate.click(header);
        (0, _expect2.default)(el.state.open).toEqual(true);
    });
});