'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'NumberInputWidget',

  propTypes: {
    className: _react2.default.PropTypes.string,
    max: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
    min: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
    name: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    step: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
    value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      step: 1,
      value: 0,
      classes: []
    };
  },
  getInitialState: function getInitialState() {
    return {
      editing: false,
      valueRep: this.props.value
    };
  },
  getValue: function getValue() {
    var propVal = parseFloat(this.newVal);
    if (!isNaN(propVal)) {
      return propVal;
    }
    return undefined;
  },
  valueChange: function valueChange(e) {
    this.newVal = e.target.value;
    this.setState({ editing: true, valueRep: this.newVal });

    var propVal = parseFloat(this.newVal);
    if (!isNaN(propVal) && this.props.onChange) {
      if (this.props.name) {
        this.props.onChange(propVal, this.props.name);
      } else {
        this.props.onChange(propVal);
      }
    }
  },
  endEditing: function endEditing() {
    this.setState({ editing: false });
  },
  render: function render() {
    return _react2.default.createElement('input', {
      className: this.props.className,
      type: 'number',
      min: this.props.min,
      max: this.props.max,
      step: this.props.step,
      value: this.state.editing ? this.state.valueRep : this.props.value,
      onChange: this.valueChange,
      onBlur: this.endEditing
    });
  }
});