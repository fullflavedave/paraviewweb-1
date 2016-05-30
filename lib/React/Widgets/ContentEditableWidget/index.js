'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noOp = function noOp() {};

exports.default = _react2.default.createClass({

  displayName: 'ContentEditableWidget',

  propTypes: {
    blurOnEnter: _react2.default.PropTypes.bool,
    className: _react2.default.PropTypes.string,
    html: _react2.default.PropTypes.string,
    onBlur: _react2.default.PropTypes.func,
    onChange: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      blurOnEnter: false,
      className: ''
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.html !== _reactDom2.default.findDOMNode(this).innerHTML;
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.props.html !== _reactDom2.default.findDOMNode(this).innerHTML) {
      _reactDom2.default.findDOMNode(this).innerHTML = this.props.html;
    }
  },
  setFocus: function setFocus() {
    var range = document.createRange();
    range.selectNodeContents(_reactDom2.default.findDOMNode(this));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  },
  blurEditable: function blurEditable(event) {
    if (event.charCode === 13) {
      _reactDom2.default.findDOMNode(this).blur();
      window.getSelection().removeAllRanges();
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  },
  emitChange: function emitChange(evt) {
    var html = _reactDom2.default.findDOMNode(this).innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      evt.target = {
        value: html
      };
      this.props.onChange(evt);
    }
    this.lastHtml = html;
    if (evt.type === 'blur' && this.props.onBlur) {
      this.props.onBlur();
    }
  },


  /* eslint-disable react/no-danger */
  render: function render() {
    return _react2.default.createElement('div', {
      className: this.props.className,
      onInput: this.emitChange,
      onBlur: this.emitChange,
      onKeyPress: this.props.blurOnEnter ? this.blurEditable : noOp,
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: this.props.html }
    });
  }
});