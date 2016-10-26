define(['exports', 'react', 'PVWStyle/ReactWidgets/NumberSliderWidget.mcss'], function (exports, _react, _NumberSliderWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _NumberSliderWidget2 = _interopRequireDefault(_NumberSliderWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'NumberSliderWidget',

    propTypes: {
      max: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
      min: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
      name: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      step: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string]),
      value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string])
    },

    getDefaultProps: function getDefaultProps() {
      return {
        max: 100,
        min: 0,
        step: 1,
        value: 50
      };
    },
    getInitialState: function getInitialState() {
      return {
        max: this.props.max,
        min: this.props.min,
        step: this.props.step,
        value: this.props.value
      };
    },
    valInput: function valInput(e) {
      this.setState({ value: e.target.value });
      if (this.props.onChange) {
        if (this.props.name) {
          e.target.name = this.props.name;
        }
        this.props.onChange(e);
      }
    },
    value: function value(newVal) {
      if (newVal === null || newVal === undefined) {
        return this.state.value;
      }

      var value = Math.max(this.state.min, Math.min(newVal, this.state.max));
      this.setState({ value: value });
      return value;
    },
    render: function render() {
      var min = this.props.min;
      var max = this.props.max;


      return _react2.default.createElement(
        'div',
        { className: _NumberSliderWidget2.default.container },
        _react2.default.createElement('input', {
          type: 'range',
          className: _NumberSliderWidget2.default.range,
          value: this.props.value,
          onChange: this.valInput,
          max: max, min: min
        }),
        _react2.default.createElement('input', {
          type: 'number',
          className: _NumberSliderWidget2.default.text,
          value: this.props.value,
          onChange: this.valInput,
          max: max, min: min
        })
      );
    }
  });
});