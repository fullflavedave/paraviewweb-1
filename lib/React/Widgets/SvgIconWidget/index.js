define(['exports', 'react', '../../../../svg/kitware.svg'], function (exports, _react, _kitware) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _kitware2 = _interopRequireDefault(_kitware);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'SvgIconWidget',

    propTypes: {
      className: _react2.default.PropTypes.string,
      height: _react2.default.PropTypes.string,
      icon: _react2.default.PropTypes.string,
      width: _react2.default.PropTypes.string,
      style: _react2.default.PropTypes.object,
      onClick: _react2.default.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
      return {
        className: '',
        icon: _kitware2.default,
        style: {}
      };
    },
    render: function render() {
      var style = Object.assign({}, this.props.style, {
        width: this.props.width,
        height: this.props.height
      });
      return _react2.default.createElement(
        'svg',
        {
          style: style,
          className: this.props.className,
          onClick: this.props.onClick
        },
        _react2.default.createElement('use', { xlinkHref: this.props.icon })
      );
    }
  });
});