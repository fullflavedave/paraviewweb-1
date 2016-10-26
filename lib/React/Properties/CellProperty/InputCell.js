'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CellProperty = require('PVWStyle/ReactProperties/CellProperty.mcss');

var _CellProperty2 = _interopRequireDefault(_CellProperty);

var _Convert = require('../../../Common/Misc/Convert');

var _Convert2 = _interopRequireDefault(_Convert);

var _Validate = require('../../../Common/Misc/Validate');

var _Validate2 = _interopRequireDefault(_Validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'InputCell',

  propTypes: {
    domain: _react2.default.PropTypes.object,
    idx: _react2.default.PropTypes.number.isRequired,
    label: _react2.default.PropTypes.string,
    noEmpty: _react2.default.PropTypes.bool,
    onChange: _react2.default.PropTypes.func,
    type: _react2.default.PropTypes.string,
    value: _react2.default.PropTypes.any
  },

  getDefaultProps: function getDefaultProps() {
    return {
      label: '',
      idx: 0,
      value: '',
      type: 'string'
    };
  },
  getInitialState: function getInitialState() {
    return {
      editing: false,
      valueRep: this.props.value
    };
  },
  getTooltip: function getTooltip() {
    var tooltip = '';
    var idx = this.props.idx;

    if (!this.props.domain) {
      return tooltip;
    }

    // Handle range
    if ({}.hasOwnProperty.call(this.props.domain, 'range') && this.props.domain.range.length) {
      var size = this.props.domain.range.length;

      var _ref = this.props.domain.range[idx % size] || {};

      var min = _ref.min;
      var max = _ref.max;


      tooltip += min !== undefined ? 'min(' + min + ') ' : '';
      tooltip += max !== undefined ? 'max(' + max + ') ' : '';
    }

    return tooltip;
  },
  applyDomains: function applyDomains(idx, val) {
    if (!this.props.domain) {
      return val;
    }

    // Handle range
    var newValue = val;
    if ({}.hasOwnProperty.call(this.props.domain, 'range') && this.props.domain.range.length) {
      var size = this.props.domain.range.length;
      var _props$domain$range = this.props.domain.range[idx % size];
      var min = _props$domain$range.min;
      var max = _props$domain$range.max;
      var force = _props$domain$range.force;

      if (force) {
        newValue = min !== undefined ? Math.max(min, newValue) : newValue;
        newValue = max !== undefined ? Math.min(max, newValue) : newValue;
      }
    }
    return newValue;
  },
  valueChange: function valueChange(e) {
    var newVal = e.target.value;
    var isValid = _Validate2.default[this.props.type](newVal);
    this.setState({
      editing: true,
      valueRep: newVal
    });

    if (!this.props.noEmpty && newVal.length === 0 && !isValid) {
      this.props.onChange(this.props.idx, undefined);
    } else if (isValid) {
      var propVal = _Convert2.default[this.props.type](newVal);
      propVal = this.applyDomains(this.props.idx, propVal);
      this.props.onChange(this.props.idx, propVal);
    }
  },
  endEditing: function endEditing() {
    this.setState({
      editing: false
    });
  },
  render: function render() {
    return _react2.default.createElement(
      'td',
      { className: _CellProperty2.default.inputCell },
      _react2.default.createElement(
        'label',
        { className: _CellProperty2.default.inputCellLabel },
        this.props.label
      ),
      _react2.default.createElement('input', {
        className: _CellProperty2.default.inputCellInput,
        value: this.state.editing ? this.state.valueRep : this.props.value,
        onChange: this.valueChange,
        title: this.getTooltip(),
        onBlur: this.endEditing
      })
    );
  }
});