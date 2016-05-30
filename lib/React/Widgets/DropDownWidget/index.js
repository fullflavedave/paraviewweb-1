'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DropDownWidget = require('PVWStyle/ReactWidgets/DropDownWidget.mcss');

var _DropDownWidget2 = _interopRequireDefault(_DropDownWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'DropDownWidget',

  propTypes: {
    field: _react2.default.PropTypes.string,
    fields: _react2.default.PropTypes.array,
    onChange: _react2.default.PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      open: false,
      field: this.props.field || this.props.fields[0]
    };
  },
  getField: function getField(e) {
    return this.state.field;
  },
  setField: function setField(e) {
    this.setState({ field: e.target.innerHTML });
    this.props.onChange(e.target.innerHTML);
  },
  toggleDropdown: function toggleDropdown() {
    this.setState({ open: !this.state.open });
  },
  render: function render() {
    var _this = this;

    return _react2.default.createElement(
      'div',
      { className: _DropDownWidget2.default.container, onClick: this.toggleDropdown },
      this.state.field,
      _react2.default.createElement(
        'ul',
        { className: this.state.open ? _DropDownWidget2.default.list : _DropDownWidget2.default.hidden },
        this.props.fields.map(function (v) {
          // this pops up in there for some reason.
          if (v === '__internal') {
            return null;
          }

          if (v === _this.state.field) {
            return _react2.default.createElement(
              'li',
              { className: _DropDownWidget2.default.selectedItem, key: v, onClick: _this.setField },
              v
            );
          }

          return _react2.default.createElement(
            'li',
            { className: _DropDownWidget2.default.item, key: v, onClick: _this.setField },
            v
          );
        })
      )
    );
  }
});