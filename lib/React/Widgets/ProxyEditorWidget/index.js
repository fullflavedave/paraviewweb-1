'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ProxyEditorWidget = require('PVWStyle/ReactWidgets/ProxyEditorWidget.mcss');

var _ProxyEditorWidget2 = _interopRequireDefault(_ProxyEditorWidget);

var _ProxyPropertyGroupWidget = require('../ProxyPropertyGroupWidget');

var _ProxyPropertyGroupWidget2 = _interopRequireDefault(_ProxyPropertyGroupWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'ProxyEditorWidget',

  propTypes: {
    advanced: _react2.default.PropTypes.bool,
    children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),
    onApply: _react2.default.PropTypes.func,
    sections: _react2.default.PropTypes.array.isRequired,
    onCollapseChange: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      advanced: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      advanced: this.props.advanced,
      changeSet: {},
      filter: null
    };
  },
  toggleAdvanced: function toggleAdvanced() {
    var advanced = !this.state.advanced;
    this.setState({ advanced: advanced });
  },
  updateFilter: function updateFilter(event) {
    var filter = event.target.value;
    this.setState({ filter: filter });
  },
  updateChangeSet: function updateChangeSet(change) {
    var changeSet = Object.assign({}, this.state.changeSet, change);
    this.setState({ changeSet: changeSet });
  },
  applyChanges: function applyChanges() {
    if (this.props.onApply) {
      this.props.onApply(this.state.changeSet);
    }
    // Reset changeSet
    this.setState({ changeSet: {} });
  },
  render: function render() {
    var _this = this;

    var changeCount = Object.keys(this.state.changeSet).length;
    return _react2.default.createElement(
      'div',
      { className: _ProxyEditorWidget2.default.container },
      _react2.default.createElement(
        'div',
        { className: _ProxyEditorWidget2.default.toolbar },
        _react2.default.createElement('i', {
          className: this.state.advanced ? _ProxyEditorWidget2.default.activeAdvancedButton : _ProxyEditorWidget2.default.advancedButton,
          onClick: this.toggleAdvanced
        }),
        _react2.default.createElement('input', {
          type: 'text',
          placeholder: 'filter properties...',
          onChange: this.updateFilter,
          className: _ProxyEditorWidget2.default.filter
        }),
        _react2.default.createElement('i', {
          className: changeCount ? _ProxyEditorWidget2.default.validateButtonOn : _ProxyEditorWidget2.default.validateButton,
          onClick: this.applyChanges
        })
      ),
      _react2.default.createElement(
        'div',
        { className: _ProxyEditorWidget2.default.contentContainer },
        this.props.children,
        this.props.sections.map(function (section) {
          return _react2.default.createElement(_ProxyPropertyGroupWidget2.default, {
            key: section.name,
            proxy: section,
            filter: _this.state.filter,
            collapsed: section.collapsed,
            advanced: _this.state.advanced,
            onChange: _this.updateChangeSet,
            onCollapseChange: _this.props.onCollapseChange
          });
        })
      )
    );
  }
});