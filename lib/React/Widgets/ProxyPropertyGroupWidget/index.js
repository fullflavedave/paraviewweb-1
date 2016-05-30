'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _equals = require('mout/src/array/equals');

var _equals2 = _interopRequireDefault(_equals);

var _PropertyFactory = require('../../Properties/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _ConvertProxyProperty = require('../../../Common/Misc/ConvertProxyProperty');

var _ProxyPropertyGroup = require('PVWStyle/ReactWidgets/ProxyPropertyGroup.mcss');

var _ProxyPropertyGroup2 = _interopRequireDefault(_ProxyPropertyGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'ProxyPropertyGroup',

  propTypes: {
    advanced: _react2.default.PropTypes.bool,
    collapsed: _react2.default.PropTypes.bool,
    filter: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    proxy: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      advanced: false,
      collapsed: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      collapsed: this.props.collapsed,
      changeSet: {},
      properties: (0, _ConvertProxyProperty.proxyToProps)(this.props.proxy)
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var previous = this.props.proxy,
        next = nextProps.proxy;

    if (!(0, _equals2.default)(previous, next)) {
      this.setState({
        properties: (0, _ConvertProxyProperty.proxyToProps)(next),
        changeSet: {}
      });
    }
  },
  toggleCollapsedMode: function toggleCollapsedMode() {
    var collapsed = !this.state.collapsed;
    this.setState({ collapsed: collapsed });
  },
  valueChange: function valueChange(change) {
    var changeSet = this.state.changeSet;
    changeSet[change.id] = change.size === 1 && Array.isArray(change.value) ? change.value[0] : change.value;
    this.setState({ changeSet: changeSet });
    if (this.props.onChange) {
      this.props.onChange(changeSet);
    }
  },
  render: function render() {
    var _this = this;

    var properties = {};
    var ctx = { advanced: this.props.advanced, filter: this.props.filter, properties: properties };
    var changeSetCount = Object.keys(this.state.changeSet).length;
    this.state.properties.forEach(function (p) {
      properties[p.data.id] = p.data.value;
    });

    return _react2.default.createElement(
      'div',
      { className: _ProxyPropertyGroup2.default.container },
      _react2.default.createElement(
        'div',
        { className: _ProxyPropertyGroup2.default.toolbar, onClick: this.toggleCollapsedMode },
        _react2.default.createElement('i', { className: this.state.collapsed ? _ProxyPropertyGroup2.default.collapedIcon : _ProxyPropertyGroup2.default.expandedIcon }),
        _react2.default.createElement(
          'span',
          { className: _ProxyPropertyGroup2.default.title },
          this.props.proxy.name
        ),
        _react2.default.createElement(
          'span',
          { className: changeSetCount ? _ProxyPropertyGroup2.default.tag : _ProxyPropertyGroup2.default.emptyTag },
          _react2.default.createElement('i', { className: _ProxyPropertyGroup2.default.tagBackground }),
          _react2.default.createElement(
            'strong',
            { className: _ProxyPropertyGroup2.default.tagCount },
            changeSetCount
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: this.state.collapsed ? _ProxyPropertyGroup2.default.hidden : _ProxyPropertyGroup2.default.content },
        this.state.properties.map(function (p) {
          return (0, _PropertyFactory2.default)(p, ctx, _this.valueChange);
        })
      )
    );
  }
});