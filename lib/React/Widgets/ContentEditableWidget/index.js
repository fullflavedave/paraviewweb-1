'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noOp = function noOp() {}; /* global window document */

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
    return nextProps.html !== this.rootContainer.innerHTML;
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.props.html !== this.rootContainer.innerHTML) {
      this.rootContainer.innerHTML = this.props.html;
    }
  },
  setFocus: function setFocus() {
    var range = document.createRange();
    range.selectNodeContents(this.rootContainer);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  },
  blurEditable: function blurEditable(event) {
    if (event.charCode === 13) {
      this.rootContainer.blur();
      window.getSelection().removeAllRanges();
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  },
  emitChange: function emitChange(evt) {
    var html = this.rootContainer.innerHTML;
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
    var _this = this;

    return _react2.default.createElement('div', {
      ref: function ref(c) {
        return _this.rootContainer = c;
      },
      className: this.props.className,
      onInput: this.emitChange,
      onBlur: this.emitChange,
      onKeyPress: this.props.blurOnEnter ? this.blurEditable : noOp,
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: this.props.html }
    });
  }
});