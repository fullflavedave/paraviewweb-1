'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ToggleIconButtonWidget = require('PVWStyle/ReactWidgets/ToggleIconButtonWidget.mcss');

var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'ToggleIconButtonWidget',

  propTypes: {
    alwaysOn: _react2.default.PropTypes.bool,
    className: _react2.default.PropTypes.string,
    icon: _react2.default.PropTypes.string,
    name: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    toggle: _react2.default.PropTypes.bool,
    value: _react2.default.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      value: true,
      icon: 'fa-sun-o',
      toggle: true,
      name: 'toggle-button'
    };
  },
  getInitialState: function getInitialState() {
    return {
      enabled: this.props.value
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.enabled) {
      this.setState({ enabled: nextProps.value });
    }
  },
  buttonClicked: function buttonClicked() {
    var enabled = this.props.toggle ? !this.state.enabled : this.state.enabled;
    if (this.props.onChange) {
      this.props.onChange(enabled, this.props.name);
    }
    if (this.props.toggle) {
      this.setState({ enabled: enabled });
    }
  },
  render: function render() {
    var classList = [this.props.icon, this.props.className];
    classList.push(this.state.enabled || this.props.alwaysOn ? _ToggleIconButtonWidget2.default.enabledButton : _ToggleIconButtonWidget2.default.disabledButton);
    return _react2.default.createElement('i', { className: classList.join(' '), onClick: this.buttonClicked });
  }
});