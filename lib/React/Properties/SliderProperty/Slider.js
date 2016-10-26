define(['exports', 'react', '../../Widgets/NumberSliderWidget'], function (exports, _react, _NumberSliderWidget) {
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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  exports.default = _react2.default.createClass({

    displayName: 'Slider',

    propTypes: {
      idx: _react2.default.PropTypes.number,
      onChange: _react2.default.PropTypes.func
    },

    valueChange: function valueChange(e) {
      if (this.props.onChange) {
        if (this.props.idx >= 0) {
          this.props.onChange(this.props.idx, e.target.value);
        } else {
          this.props.onChange(null, e.target.value);
        }
      }
    },
    render: function render() {
      var propsCopy = Object.assign({}, this.props);
      delete propsCopy.onChange;
      delete propsCopy.idx;

      return _react2.default.createElement(_NumberSliderWidget2.default, _extends({}, propsCopy, { onChange: this.valueChange }));
    }
  });
});