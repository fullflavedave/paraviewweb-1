'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AbstractViewerMenu = require('../AbstractViewerMenu');

var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'GeometryViewer',

  propTypes: {
    config: _react2.default.PropTypes.object,
    geometryBuilder: _react2.default.PropTypes.object.isRequired,
    menuAddOn: _react2.default.PropTypes.array,
    queryDataModel: _react2.default.PropTypes.object.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      config: {}
    };
  },
  render: function render() {
    var queryDataModel = this.props.queryDataModel,
        geometryBuilder = this.props.geometryBuilder,
        controlWidgets = [];

    // Add menuAddOn if any at the top
    if (this.props.menuAddOn) {
      controlWidgets = this.props.menuAddOn.concat(controlWidgets);
    }

    return _react2.default.createElement(
      _AbstractViewerMenu2.default,
      {
        queryDataModel: queryDataModel,
        geometryBuilder: geometryBuilder,
        renderer: 'GeometryRenderer',
        config: this.props.config || {}
      },
      controlWidgets
    );
  }
});