'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextInputWidget = require('PVWStyle/ReactWidgets/TextInputWidget.mcss');

var _TextInputWidget2 = _interopRequireDefault(_TextInputWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'TextInputWidget',

  propTypes: {
    className: _react2.default.PropTypes.string,
    name: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    value: _react2.default.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      value: '',
      className: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      editing: false,
      valueRep: this.props.value
    };
  },
  valueChange: function valueChange(e) {
    var newVal = e.target.value;
    this.setState({ editing: true, valueRep: newVal });
  },
  endEditing: function endEditing() {
    this.setState({ editing: false });

    if (this.props.name) {
      this.props.onChange(this.state.valueRep, this.props.name);
    } else {
      this.props.onChange(this.state.valueRep);
    }
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: [_TextInputWidget2.default.container, this.props.className].join(' ') },
      _react2.default.createElement('input', {
        className: _TextInputWidget2.default.entry,
        type: 'text',
        value: this.state.editing ? this.state.valueRep : this.props.value,
        onChange: this.valueChange,
        onBlur: this.endEditing
      }),
      _react2.default.createElement('i', { className: this.state.editing ? _TextInputWidget2.default.editingButton : _TextInputWidget2.default.button })
    );
  }
});