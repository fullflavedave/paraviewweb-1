'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CellProperty = require('PVWStyle/ReactProperties/CellProperty.mcss');

var _CellProperty2 = _interopRequireDefault(_CellProperty);

var _EnumProperty = require('PVWStyle/ReactProperties/EnumProperty.mcss');

var _EnumProperty2 = _interopRequireDefault(_EnumProperty);

var _Convert = require('../../../Common/Misc/Convert');

var _Convert2 = _interopRequireDefault(_Convert);

var _BlockMixin = require('../PropertyFactory/BlockMixin');

var _BlockMixin2 = _interopRequireDefault(_BlockMixin);

var _ToggleIconButtonWidget = require('../../Widgets/ToggleIconButtonWidget');

var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function valueToString(obj) {
  if (typeof obj === 'string') {
    return 'S' + obj;
  }
  return 'J' + JSON.stringify(obj);
}

function stringToValue(str) {
  if (!str || str.length === 0) {
    return str;
  }
  return str[0] === 'S' ? str.substring(1) : JSON.parse(str.substring(1));
}

/* eslint-disable react/no-danger */
/* eslint-disable react/no-unused-prop-types */

exports.default = _react2.default.createClass({

  displayName: 'EnumProperty',

  propTypes: {
    data: _react2.default.PropTypes.object.isRequired,
    help: _react2.default.PropTypes.string,
    name: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    show: _react2.default.PropTypes.func,
    ui: _react2.default.PropTypes.object.isRequired,
    viewData: _react2.default.PropTypes.object
  },

  mixins: [_BlockMixin2.default],

  valueChange: function valueChange(e) {
    var _this = this;

    var newData = this.state.data;
    if (Array.isArray(this.state.data.value)) {
      (function () {
        var newVals = [];
        for (var i = 0; i < e.target.options.length; i++) {
          var el = e.target.options.item(i);
          if (el.selected) {
            [].concat(stringToValue(el.value)).forEach(function (v) {
              return newVals.push(v);
            });
          }
        }
        newData.value = newVals.map(_Convert2.default[_this.props.ui.type]);
      })();
    } else if (e.target.value === null) {
      newData.value = null;
    } else {
      newData.value = [_Convert2.default[this.props.ui.type](stringToValue(e.target.value))];
    }

    this.setState({
      data: newData
    });
    if (this.props.onChange) {
      this.props.onChange(newData);
    }
  },
  render: function render() {
    var _this2 = this;

    var selectedValue = null;
    var multiple = this.props.ui.size === -1,
        mapper = function mapper() {
      var ret = [];
      if (!multiple && !_this2.props.ui.noEmpty) {
        ret.push(_react2.default.createElement('option', { key: 'empty-value', value: null }));
      }

      Object.keys(_this2.props.ui.domain).forEach(function (key) {
        ret.push(_react2.default.createElement(
          'option',
          {
            value: valueToString(_this2.props.ui.domain[key]),
            key: _this2.props.data.id + '_' + key
          },
          key
        ));
      });

      return ret;
    };

    if (multiple) {
      selectedValue = this.props.data.value.map(valueToString);
    } else if (this.props.ui.size === 1) {
      selectedValue = valueToString(this.props.data.value[0]);
    } else {
      selectedValue = valueToString(this.props.data.value);
    }

    return _react2.default.createElement(
      'div',
      { className: this.props.show(this.props.viewData) ? _CellProperty2.default.container : _CellProperty2.default.hidden },
      _react2.default.createElement(
        'div',
        { className: _CellProperty2.default.header },
        _react2.default.createElement(
          'strong',
          null,
          this.props.ui.label
        ),
        _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(_ToggleIconButtonWidget2.default, {
            icon: _CellProperty2.default.helpIcon,
            value: this.state.helpOpen,
            toggle: !!this.props.ui.help,
            onChange: this.helpToggled
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _CellProperty2.default.inputBlock },
        _react2.default.createElement(
          'select',
          {
            className: multiple ? _EnumProperty2.default.inputMultiSelect : _EnumProperty2.default.input,
            value: selectedValue,
            onChange: this.valueChange,
            multiple: multiple
          },
          mapper()
        )
      ),
      _react2.default.createElement('div', {
        className: this.state.helpOpen ? _CellProperty2.default.helpBox : _CellProperty2.default.hidden,
        dangerouslySetInnerHTML: { __html: this.props.ui.help }
      })
    );
  }
});