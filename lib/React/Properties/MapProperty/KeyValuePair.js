define(['exports', 'react', 'PVWStyle/ReactProperties/MapProperty.mcss'], function (exports, _react, _MapProperty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _MapProperty2 = _interopRequireDefault(_MapProperty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'KeyValuePair',

    propTypes: {
      idx: _react2.default.PropTypes.number,
      label: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      value: _react2.default.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
      return {
        label: ''
      };
    },
    removeItem: function removeItem(e) {
      if (this.props.onChange) {
        if (this.props.idx >= 0) {
          this.props.onChange(this.props.idx);
        }
      }
    },
    valueChange: function valueChange(e) {
      var value = e.target.value;
      var name = e.target.name;

      if (this.props.onChange) {
        if (this.props.idx >= 0) {
          this.props.onChange(this.props.idx, name, value);
        } else {
          this.props.onChange(null, name, value);
        }
      }
    },
    render: function render() {
      return _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement(
          'td',
          { className: _MapProperty2.default.inputColumn },
          _react2.default.createElement('input', {
            className: _MapProperty2.default.input,
            name: 'name',
            type: 'text',
            value: this.props.value.name,
            onChange: this.valueChange
          })
        ),
        _react2.default.createElement(
          'td',
          { className: _MapProperty2.default.inputColumn },
          _react2.default.createElement('input', {
            className: _MapProperty2.default.input,
            name: 'value',
            type: 'text',
            value: this.props.value.value,
            onChange: this.valueChange
          })
        ),
        _react2.default.createElement(
          'td',
          { className: _MapProperty2.default.actionColumn },
          _react2.default.createElement('i', { className: _MapProperty2.default.deleteButton, onClick: this.removeItem })
        )
      );
    }
  });
});