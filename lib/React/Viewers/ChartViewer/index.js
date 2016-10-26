define(['exports', 'react', '../AbstractViewerMenu', '../../CollapsibleControls/CollapsibleControlFactory'], function (exports, _react, _AbstractViewerMenu, _CollapsibleControlFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

  var _CollapsibleControlFactory2 = _interopRequireDefault(_CollapsibleControlFactory);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'ChartViewer',

    propTypes: {
      config: _react2.default.PropTypes.object,
      chartBuilder: _react2.default.PropTypes.object.isRequired,
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
          chartBuilder = this.props.chartBuilder,
          controlWidgets = _CollapsibleControlFactory2.default.getWidgets(chartBuilder);

      // Add menuAddOn if any at the top
      if (this.props.menuAddOn) {
        controlWidgets = this.props.menuAddOn.concat(controlWidgets);
      }

      return _react2.default.createElement(
        _AbstractViewerMenu2.default,
        {
          queryDataModel: queryDataModel,
          chartBuilder: chartBuilder,
          renderer: 'PlotlyRenderer',
          config: this.props.config || {}
        },
        controlWidgets
      );
    }
  });
});