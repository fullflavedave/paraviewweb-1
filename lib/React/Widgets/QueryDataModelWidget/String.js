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
 *       Expect the name of the argument this String UI element control within the model.
 */
exports.default = _react2.default.createClass({

  displayName: 'ParameterSet.String',

  propTypes: {
    arg: _react2.default.PropTypes.string,
    model: _react2.default.PropTypes.object.isRequired
  },

  mixins: [_DataListenerMixin2.default, _DataListenerUpdateMixin2.default],

  handleChange: function handleChange(event) {
    if (this.props.model.setValue(this.props.arg, event.target.value)) {
      this.props.model.lazyFetchData();
    }
  },
  grabFocus: function grabFocus() {
    _reactDom2.default.findDOMNode(this.refs.select).focus();
  },
  toggleAnimation: function toggleAnimation() {
    this.props.model.toggleAnimationFlag(this.props.arg);
    this.setState({});
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: this.props.model.getAnimationFlag(this.props.arg) ? _QueryDataModelWidget2.default.itemActive : _QueryDataModelWidget2.default.item },
      _react2.default.createElement(
        'div',
        { className: [_QueryDataModelWidget2.default.row, _QueryDataModelWidget2.default.label].join(' '), onClick: this.toggleAnimation },
        this.props.model.label(this.props.arg)
      ),
      _react2.default.createElement(
        'div',
        { className: _QueryDataModelWidget2.default.row, onMouseEnter: this.grabFocus },
        _react2.default.createElement(
          'select',
          {
            className: _QueryDataModelWidget2.default.input,
            ref: 'select',
            value: this.props.model.getValue(this.props.arg),
            onChange: this.handleChange
          },
          this.props.model.getValues(this.props.arg).map(function (v) {
            return _react2.default.createElement(
              'option',
              { key: v, value: v },
              v
            );
          })
        )
      )
    );
  }
});