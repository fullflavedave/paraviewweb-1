'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _equals = require('mout/src/array/equals');

var _equals2 = _interopRequireDefault(_equals);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DoubleSliderWidget = require('PVWStyle/ReactWidgets/DoubleSliderWidget.mcss');

var _DoubleSliderWidget2 = _interopRequireDefault(_DoubleSliderWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'DoubleSliderWidget',

  propTypes: {
    max: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
    min: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
    name: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    size: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
    value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      max: 1,
      min: 0,
      size: 100,
      name: 'DoubleValue'
    };
  },
  getInitialState: function getInitialState() {
    return {
      txtValue: null,
      value: this.props.value ? this.props.value : 0.5 * (this.props.max + this.props.min),
      max: this.props.max,
      min: this.props.min
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var previous = this.props,
        next = nextProps;

    if (!(0, _equals2.default)(previous, next)) {
      this.setState({
        value: next.value ? next.value : 0.5 * (next.max + next.min)
      });
    }
  },
  textInput: function textInput(e) {
    var value = Number(e.target.value);
    if (!Number.isNaN(value) && e.target.value.length > 0) {
      this.setState({ value: value, txtValue: e.target.value });
      if (this.props.onChange) {
        this.props.onChange(this.props.name, value);
      }
    } else {
      this.setState({
        txtValue: e.target.value
      });
    }
  },
  sliderInput: function sliderInput(e) {
    var min = Number(this.props.min),
        max = Number(this.props.max),
        delta = max - min,
        value = delta * Number(e.target.value) / Number(this.props.size) + min;

    this.setState({ value: value, txtValue: null });
    if (this.props.onChange) {
      this.props.onChange(this.props.name, value);
    }
  },
  render: function render() {
    var min = this.props.min;
    var max = this.props.max;
    var size = this.props.size;
    var value = this.state.value;


    return _react2.default.createElement(
      'div',
      { className: _DoubleSliderWidget2.default.container },
      _react2.default.createElement('input', {
        type: 'range',
        className: _DoubleSliderWidget2.default.rangeInput,
        value: Math.floor((value - min) / (max - min) * size),
        onChange: this.sliderInput,
        min: '0', max: size
      }),
      _react2.default.createElement('input', {
        type: 'text',
        className: _DoubleSliderWidget2.default.textInput,
        pattern: '-*[0-9]*.*[0-9]*',
        value: this.state.txtValue !== null ? this.state.txtValue : this.state.value,
        onChange: this.textInput
      })
    );
  }
});