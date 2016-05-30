'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DataListenerMixin = require('./DataListenerMixin');

var _DataListenerMixin2 = _interopRequireDefault(_DataListenerMixin);

var _DataListenerUpdateMixin = require('./DataListenerUpdateMixin');

var _DataListenerUpdateMixin2 = _interopRequireDefault(_DataListenerUpdateMixin);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _QueryDataModelWidget = require('PVWStyle/ReactWidgets/QueryDataModelWidget.mcss');

var _QueryDataModelWidget2 = _interopRequireDefault(_QueryDataModelWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This React component expect the following input properties:
 *   - model:
 *       Expect a QueryDataModel instance.
 *   - listener:
 *       Expect a Boolean based on the automatic data model registration for listening.
 *       Default value is true but that should be false is nested.
 *   - arg:
 *       Expect the name of the argument this Number UI element control within the model.
 */
exports.default = _react2.default.createClass({

  displayName: 'Number',

  propTypes: {
    arg: _react2.default.PropTypes.string,
    model: _react2.default.PropTypes.object.isRequired
  },

  mixins: [_DataListenerMixin2.default, _DataListenerUpdateMixin2.default],

  getInitialState: function getInitialState() {
    return {
      advanced: false,
      button: false,
      slider: false
    };
  },
  onIndexChange: function onIndexChange(event) {
    if (this.props.model.setIndex(this.props.arg, Number(event.target.value))) {
      this.props.model.lazyFetchData();
    }
  },
  previous: function previous() {
    if (this.props.model.previous(this.props.arg)) {
      this.props.model.lazyFetchData();
      _reactDom2.default.findDOMNode(this.refs.slider).focus();
    }
  },
  next: function next() {
    if (this.props.model.next(this.props.arg)) {
      this.props.model.lazyFetchData();
      _reactDom2.default.findDOMNode(this.refs.slider).focus();
    }
  },
  first: function first() {
    if (this.props.model.first(this.props.arg)) {
      this.props.model.lazyFetchData();
      _reactDom2.default.findDOMNode(this.refs.slider).focus();
    }
  },
  last: function last() {
    if (this.props.model.last(this.props.arg)) {
      this.props.model.lazyFetchData();
      _reactDom2.default.findDOMNode(this.refs.slider).focus();
    }
  },
  updateMode: function updateMode(event) {
    if (this.state.advanced !== event.altKey) {
      this.setState({ advanced: event.altKey });
    }
  },
  resetState: function resetState(event) {
    this.setState({ advanced: false });
  },
  enableButtons: function enableButtons(event) {
    this.setState({ button: true });
    _reactDom2.default.findDOMNode(this.refs.slider).focus();
  },
  disableButtons: function disableButtons() {
    this.setState({ button: false, advanced: false });
  },
  grabFocus: function grabFocus() {
    _reactDom2.default.findDOMNode(this.refs.slider).focus();
  },
  toggleAnimation: function toggleAnimation() {
    this.props.model.toggleAnimationFlag(this.props.arg);
    this.setState({});
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      {
        className: this.props.model.getAnimationFlag(this.props.arg) ? _QueryDataModelWidget2.default.itemActive : _QueryDataModelWidget2.default.item,
        onKeyDown: this.updateMode,
        onKeyUp: this.resetState,
        onMouseLeave: this.disableButtons
      },
      _react2.default.createElement(
        'div',
        { className: _QueryDataModelWidget2.default.row },
        _react2.default.createElement(
          'div',
          { className: _QueryDataModelWidget2.default.label, onClick: this.toggleAnimation },
          this.props.model.label(this.props.arg)
        ),
        _react2.default.createElement(
          'div',
          { className: _QueryDataModelWidget2.default.mobileOnly },
          this.props.model.getValue(this.props.arg)
        ),
        _react2.default.createElement(
          'div',
          {
            className: [_QueryDataModelWidget2.default.itemControl, _QueryDataModelWidget2.default.noMobile].join(' '),
            onMouseEnter: this.enableButtons,
            onMouseLeave: this.disableButtons
          },
          _react2.default.createElement(
            'div',
            { className: this.state.button ? _QueryDataModelWidget2.default.hidden : _QueryDataModelWidget2.default.itemControlValue },
            this.props.model.getValue(this.props.arg)
          ),
          _react2.default.createElement('i', {
            className: this.state.button ? this.state.advanced ? _QueryDataModelWidget2.default.firstButton : _QueryDataModelWidget2.default.previousButton : _QueryDataModelWidget2.default.hidden,
            onClick: this.state.advanced ? this.first : this.previous
          }),
          _react2.default.createElement('i', {
            className: this.state.button ? this.state.advanced ? _QueryDataModelWidget2.default.lastButton : _QueryDataModelWidget2.default.nextButton : _QueryDataModelWidget2.default.hidden,
            onClick: this.state.advanced ? this.last : this.next
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: [_QueryDataModelWidget2.default.row, _QueryDataModelWidget2.default.mobileOnly].join(' ') },
        _react2.default.createElement(
          'div',
          { className: _QueryDataModelWidget2.default.itemControl },
          _react2.default.createElement('br', null),
          _react2.default.createElement('i', {
            className: _QueryDataModelWidget2.default.firstButton,
            onClick: this.first
          }),
          _react2.default.createElement('i', {
            className: _QueryDataModelWidget2.default.lastButton,
            onClick: this.last
          }),
          _react2.default.createElement('i', {
            className: _QueryDataModelWidget2.default.previousButton,
            onClick: this.previous
          }),
          _react2.default.createElement('i', {
            className: _QueryDataModelWidget2.default.nextButton,
            onClick: this.next
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _QueryDataModelWidget2.default.row },
        _react2.default.createElement(
          'div',
          { className: _QueryDataModelWidget2.default.slider, onMouseEnter: this.grabFocus },
          _react2.default.createElement('input', {
            className: _QueryDataModelWidget2.default.input,
            ref: 'slider',
            type: 'range',
            min: '0',
            max: this.props.model.getSize(this.props.arg) - 1,
            value: this.props.model.getIndex(this.props.arg),
            onChange: this.onIndexChange
          })
        )
      )
    );
  }
});