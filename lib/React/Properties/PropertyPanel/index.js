'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PropertyPanel = require('PVWStyle/ReactProperties/PropertyPanel.mcss');

var _PropertyPanel2 = _interopRequireDefault(_PropertyPanel);

var _PropertyFactory = require('../PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'PropertyPanel',

  propTypes: {
    className: _react2.default.PropTypes.string,
    input: _react2.default.PropTypes.array,
    labels: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func,
    viewData: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      input: [],
      viewData: {}
    };
  },
  valueChange: function valueChange(newVal) {
    if (this.props.onChange) {
      this.props.onChange(newVal);
    }
  },
  render: function render() {
    var _this = this;

    var viewData = this.props.viewData,
        uiContents = function uiContents(content) {
      return (0, _PropertyFactory2.default)(content, viewData, _this.valueChange);
    },
        uiContainer = function uiContainer(property) {
      return _react2.default.createElement(
        'div',
        { key: property.title },
        _react2.default.createElement(
          'div',
          { className: _PropertyPanel2.default.propertyHeader },
          _react2.default.createElement(
            'strong',
            null,
            property.title
          )
        ),
        property.contents.map(uiContents)
      );
    };

    return _react2.default.createElement(
      'section',
      { className: [this.props.className, _PropertyPanel2.default.propertyPanel].join(' ') },
      this.props.input.map(uiContainer)
    );
  }
});