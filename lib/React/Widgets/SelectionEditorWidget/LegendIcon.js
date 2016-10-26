define(['exports', 'react', '../SvgIconWidget'], function (exports, _react, _SvgIconWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = legendIcon;

  var _react2 = _interopRequireDefault(_react);

  var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function legendIcon(props) {
    if (!props.getLegend) {
      return _react2.default.createElement(
        'span',
        null,
        props.name
      );
    }
    var style = { fill: props.getLegend(props.name).color };
    var newStyle = Object.assign({ stroke: 'black', strokeWidth: 1 }, style, props.style);

    return _react2.default.createElement(_SvgIconWidget2.default, {
      icon: props.getLegend(props.name).shape,

      width: props.width,
      height: props.height,
      style: newStyle,

      onClick: props.onClick
    });
  }

  legendIcon.propTypes = {
    name: _react2.default.PropTypes.string,
    getLegend: _react2.default.PropTypes.func,

    width: _react2.default.PropTypes.string,
    height: _react2.default.PropTypes.string,
    style: _react2.default.PropTypes.object,

    onClick: _react2.default.PropTypes.func
  };
});