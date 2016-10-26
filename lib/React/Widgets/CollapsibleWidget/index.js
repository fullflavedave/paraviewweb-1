'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CollapsibleWidget = require('PVWStyle/ReactWidgets/CollapsibleWidget.mcss');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'CollapsibleWidget',

  propTypes: {
    children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),
    onChange: _react2.default.PropTypes.func,
    open: _react2.default.PropTypes.bool,
    subtitle: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.string, _react2.default.PropTypes.array]),
    title: _react2.default.PropTypes.string,
    visible: _react2.default.PropTypes.bool,
    activeSubTitle: _react2.default.PropTypes.bool,
    disableCollapse: _react2.default.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      title: '',
      subtitle: '',
      open: true,
      visible: true,
      disableCollapse: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      open: this.props.open
    };
  },
  toggleOpen: function toggleOpen() {
    if (this.props.disableCollapse && this.state.open) {
      return;
    }
    var newState = !this.state.open;
    this.setState({ open: newState });

    if (this.props.onChange) {
      this.props.onChange(newState);
    }
  },
  isCollapsed: function isCollapsed() {
    return this.state.open === false;
  },
  isExpanded: function isExpanded() {
    return this.state.open === true;
  },
  render: function render() {
    var localStyle = {};
    if (!this.props.visible) {
      localStyle.display = 'none';
    }
    return _react2.default.createElement(
      'section',
      { className: _CollapsibleWidget2.default.container, style: localStyle },
      _react2.default.createElement(
        'div',
        { className: _CollapsibleWidget2.default.header },
        _react2.default.createElement(
          'div',
          { onClick: this.toggleOpen },
          _react2.default.createElement('i', { className: _CollapsibleWidget2.default[this.state.open ? 'caret' : 'caretClosed'] }),
          _react2.default.createElement(
            'strong',
            { className: _CollapsibleWidget2.default.title },
            this.props.title
          )
        ),
        _react2.default.createElement(
          'span',
          { className: this.props.activeSubTitle ? _CollapsibleWidget2.default.subtitleActive : _CollapsibleWidget2.default.subtitle },
          this.props.subtitle
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _CollapsibleWidget2.default[this.state.open ? 'visibleContent' : 'hiddenContent'] },
        this.props.children
      )
    );
  }
});