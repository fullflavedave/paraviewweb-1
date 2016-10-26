'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ScalarRangeWidget = require('PVWStyle/ReactWidgets/ScalarRangeWidget.mcss');

var _ScalarRangeWidget2 = _interopRequireDefault(_ScalarRangeWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = _react2.default.createClass({

  displayName: 'ScalarRangeWidget',

  propTypes: {
    max: _react2.default.PropTypes.number,
    min: _react2.default.PropTypes.number,
    onApply: _react2.default.PropTypes.func,
    visible: _react2.default.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    return {
      max: this.props.max || 1,
      min: this.props.min || 0
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var min = nextProps.min;
    var max = nextProps.max;

    if (this.state.min !== min || this.state.max !== max) {
      this.setState({ min: min, max: max });
    }
  },
  updateRange: function updateRange(event) {
    var name = event.target.name,
        value = event.target.value;

    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      this.setState(_defineProperty({}, name, value));
    }
  },
  apply: function apply(event) {
    var _state = this.state;
    var min = _state.min;
    var max = _state.max;

    var type = event.target.dataset.type;

    min = Number(min);
    max = Number(max);

    if (this.props.onApply) {
      this.props.onApply({ type: type, min: min, max: max });
    }
  },
  render: function render() {
    if (!this.props.visible) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: _ScalarRangeWidget2.default.container },
      _react2.default.createElement('input', {
        className: _ScalarRangeWidget2.default.rangeInput,
        type: 'text',
        pattern: '-*[0-9]*.*[0-9]*',
        name: 'min',
        value: this.state.min,
        onChange: this.updateRange
      }),
      _react2.default.createElement('input', {
        className: _ScalarRangeWidget2.default.rangeInput,
        type: 'text',
        pattern: '-*[0-9]*.*[0-9]*',
        name: 'max',
        value: this.state.max,
        onChange: this.updateRange
      }),
      _react2.default.createElement(
        'div',
        { className: _ScalarRangeWidget2.default.actionLine },
        _react2.default.createElement('i', { onClick: this.apply, 'data-type': 'data', className: _ScalarRangeWidget2.default.dataRangeIcon }),
        _react2.default.createElement('i', { onClick: this.apply, 'data-type': 'time', className: _ScalarRangeWidget2.default.timeRangeIcon }),
        _react2.default.createElement('i', { onClick: this.apply, 'data-type': 'custom', className: _ScalarRangeWidget2.default.customRangeIcon })
      )
    );
  }
});