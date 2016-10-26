define(['exports', 'react', '../AbstractViewerMenu', '../../CollapsibleControls/MultiViewControl', '../../CollapsibleControls/CollapsibleControlFactory'], function (exports, _react, _AbstractViewerMenu, _MultiViewControl, _CollapsibleControlFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

  var _MultiViewControl2 = _interopRequireDefault(_MultiViewControl);

  var _CollapsibleControlFactory2 = _interopRequireDefault(_CollapsibleControlFactory);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'MultiLayoutViewer',

    propTypes: {
      layout: _react2.default.PropTypes.string,
      menuAddOn: _react2.default.PropTypes.array,
      queryDataModel: _react2.default.PropTypes.object.isRequired,
      renderers: _react2.default.PropTypes.object.isRequired
    },

    getInitialState: function getInitialState() {
      return {
        activeRenderer: null,
        renderer: null
      };
    },


    // FIXME need to do that properly if possible?
    /* eslint-disable react/no-did-mount-set-state */
    componentDidMount: function componentDidMount() {
      var _this = this;

      var renderer = this.catalystWidget.getRenderer();

      this.setState({ renderer: renderer });

      this.activeViewportSubscription = renderer.onActiveViewportChange(function (data, envelope) {
        _this.setState({
          activeRenderer: _this.props.renderers[data.name]
        });
      });
    },

    /* eslint-enable react/no-did-mount-set-state */

    componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
      var previousDataModel = this.state.activeRenderer && this.state.activeRenderer.builder && this.state.activeRenderer.builder.queryDataModel ? this.state.activeRenderer.builder.queryDataModel : this.props.queryDataModel,
          nextDataModel = nextState.activeRenderer && nextState.activeRenderer.builder && nextState.activeRenderer.builder.queryDataModel ? nextState.activeRenderer.builder.queryDataModel : nextProps.queryDataModel;

      if (previousDataModel !== nextDataModel) {
        this.detachListener();
        this.attachListener(nextDataModel);
      }
    },


    // Auto unmount listener
    componentWillUnmount: function componentWillUnmount() {
      this.detachListener();
      if (this.activeViewportSubscription) {
        this.activeViewportSubscription.unsubscribe();
        this.activeViewportSubscription = null;
      }
    },
    attachListener: function attachListener(dataModel) {
      var _this2 = this;

      this.detachListener();
      if (dataModel) {
        this.queryDataModelChangeSubscription = dataModel.onStateChange(function (data, envelope) {
          _this2.forceUpdate();
        });
      }
    },
    detachListener: function detachListener() {
      if (this.queryDataModelChangeSubscription) {
        this.queryDataModelChangeSubscription.unsubscribe();
        this.queryDataModelChangeSubscription = null;
      }
    },
    render: function render() {
      var _this3 = this;

      var queryDataModel = this.state.activeRenderer && this.state.activeRenderer.builder && this.state.activeRenderer.builder.queryDataModel ? this.state.activeRenderer.builder.queryDataModel : this.props.queryDataModel,
          controlWidgets = [];

      if (this.state.activeRenderer) {
        controlWidgets = _CollapsibleControlFactory2.default.getWidgets(this.state.activeRenderer.builder || this.state.activeRenderer.painter);
      }

      // Add menuAddOn if any at the top
      if (this.props.menuAddOn) {
        controlWidgets = this.props.menuAddOn.concat(controlWidgets);
      }

      return _react2.default.createElement(
        _AbstractViewerMenu2.default,
        {
          ref: function ref(c) {
            _this3.catalystWidget = c;
          },
          queryDataModel: queryDataModel,
          renderers: this.props.renderers,
          renderer: 'MultiViewRenderer',
          layout: this.props.layout
        },
        _react2.default.createElement(_MultiViewControl2.default, { renderer: this.state.renderer }),
        controlWidgets
      );
    }
  });
});