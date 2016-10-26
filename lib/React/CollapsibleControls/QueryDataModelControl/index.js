'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QueryDataModelControl = require('PVWStyle/ReactCollapsibleControls/QueryDataModelControl.mcss');

var _QueryDataModelControl2 = _interopRequireDefault(_QueryDataModelControl);

var _CollapsibleWidget = require('../../Widgets/CollapsibleWidget');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

var _DataListenerMixin = require('../../Widgets/QueryDataModelWidget/DataListenerMixin');

var _DataListenerMixin2 = _interopRequireDefault(_DataListenerMixin);

var _DataListenerUpdateMixin = require('../../Widgets/QueryDataModelWidget/DataListenerUpdateMixin');

var _DataListenerUpdateMixin2 = _interopRequireDefault(_DataListenerUpdateMixin);

var _ToggleIconButtonWidget = require('../../Widgets/ToggleIconButtonWidget');

var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

var _QueryDataModelWidget = require('../../Widgets/QueryDataModelWidget');

var _QueryDataModelWidget2 = _interopRequireDefault(_QueryDataModelWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'QueryDataModelControl',

  propTypes: {
    handleExploration: _react2.default.PropTypes.bool,
    model: _react2.default.PropTypes.object
  },

  mixins: [_DataListenerMixin2.default, _DataListenerUpdateMixin2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      handleExploration: false
    };
  },
  toggleExploration: function toggleExploration(enabled) {
    this.props.model.exploreQuery(enabled, true, !this.props.handleExploration);
  },
  render: function render() {
    var exploreButton = _react2.default.createElement(_ToggleIconButtonWidget2.default, {
      key: 'explore-button',
      icon: _QueryDataModelControl2.default.exploreIcon,
      onChange: this.toggleExploration,
      value: this.props.model.exploreState.animate
    });

    return _react2.default.createElement(
      _CollapsibleWidget2.default,
      {
        title: 'Parameters',
        key: 'QueryDataModelWidget_parent',
        visible: this.props.model.originalData.arguments_order.length > 0,
        activeSubTitle: true,
        subtitle: exploreButton
      },
      _react2.default.createElement(_QueryDataModelWidget2.default, {
        key: 'QueryDataModelWidget',
        model: this.props.model
      })
    );
  }
});