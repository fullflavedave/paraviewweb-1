'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ButtonSelectorWidget = require('PVWStyle/ReactWidgets/ButtonSelectorWidget.mcss');

var _ButtonSelectorWidget2 = _interopRequireDefault(_ButtonSelectorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'ButtonSelectorWidget',

  propTypes: {
    list: _react2.default.PropTypes.array.isRequired,
    onChange: _react2.default.PropTypes.func
  },

  processItem: function processItem(event) {
    var name = event.target.name,
        array = this.props.list,
        count = array.length;

    if (this.props.onChange) {
      while (count) {
        count -= 1;
        if (array[count].name === name) {
          this.props.onChange(count, array);
        }
      }
    }
  },
  render: function render() {
    var _this = this;

    var list = [];

    this.props.list.forEach(function (item) {
      list.push(_react2.default.createElement(
        'button',
        { className: _ButtonSelectorWidget2.default.button, key: item.name, name: item.name, onClick: _this.processItem },
        item.name
      ));
    });

    return _react2.default.createElement(
      'section',
      { className: _ButtonSelectorWidget2.default.container },
      list
    );
  }
});