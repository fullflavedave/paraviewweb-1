'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _kitware = require('../../../../svg/kitware.svg');

var _kitware2 = _interopRequireDefault(_kitware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


  /* eslint-disable react/no-danger */
  render: function render() {
    var style = Object.assign({}, this.props.style, {
      width: this.props.width,
      height: this.props.height
    });
    return _react2.default.createElement('svg', {
      style: style,
      className: this.props.className,
      dangerouslySetInnerHTML: {
        __html: '<use xlink:href="' + this.props.icon + '"></use>'
      },
      onClick: this.props.onClick
    });
  }
});