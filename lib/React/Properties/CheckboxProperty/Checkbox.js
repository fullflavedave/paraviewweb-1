define(['exports', 'react', 'PVWStyle/ReactProperties/CheckboxProperty.mcss'], function (exports, _react, _CheckboxProperty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CheckboxProperty2 = _interopRequireDefault(_CheckboxProperty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'Checkbox',

    propTypes: {
      idx: _react2.default.PropTypes.number,
      label: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      value: _react2.default.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
      return {
        value: false,
        label: ''
      };
    },
    valueChange: function valueChange(e) {
      if (this.props.onChange) {
        if (this.props.idx >= 0) {
          this.props.onChange(this.props.idx, e.target.checked);
        } else {
          this.props.onChange(null, e.target.checked);
        }
      }
    },
    render: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'label',
          { className: _CheckboxProperty2.default.label },
          this.props.label
        ),
        _react2.default.createElement('input', {
          className: _CheckboxProperty2.default.input,
          type: 'checkbox',
          checked: this.props.value,
          onChange: this.valueChange
        })
      );
    }
  });
});