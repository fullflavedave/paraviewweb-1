define(['exports', 'react', '../../Widgets/CollapsibleWidget', '../../Widgets/LayoutsWidget'], function (exports, _react, _CollapsibleWidget, _LayoutsWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

  var _LayoutsWidget2 = _interopRequireDefault(_LayoutsWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'MultiViewControl',

    propTypes: {
      renderer: _react2.default.PropTypes.object
    },

    getInitialState: function getInitialState() {
      return {
        renderMethod: '',
        layout: ''
      };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (!this.props.renderer && nextProps.renderer) {
        var renderer = nextProps.renderer;
        this.layoutSubscription = renderer.onLayoutChange(this.onLayoutChangeCallback);
        this.renderMethodSubscription = renderer.onActiveViewportChange(this.onActiveViewportCallback);
        this.setState({
          renderMethod: renderer.getActiveRenderMethod(),
          layout: renderer.getActiveLayout()
        });
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.layoutSubscription) {
        this.layoutSubscription.unsubscribe();
        this.layoutSubscription = null;
      }
      if (this.renderMethodSubscription) {
        this.renderMethodSubscription.unsubscribe();
        this.renderMethodSubscription = null;
      }
    },
    onLayoutChange: function onLayoutChange(layout) {
      this.props.renderer.setLayout(layout);
    },
    onRenderMethodChange: function onRenderMethodChange(event) {
      var renderMethod = event.target.value;
      this.props.renderer.setRenderMethod(renderMethod);
    },
    onLayoutChangeCallback: function onLayoutChangeCallback(data, envelope) {
      this.setState({
        layout: data
      });
    },
    onActiveViewportCallback: function onActiveViewportCallback(data, envelope) {
      this.setState({
        renderMethod: data.name
      });
    },
    render: function render() {
      var renderer = this.props.renderer,
          renderMethods = [];

      if (renderer) {
        renderMethods = renderer.getRenderMethods().map(function (v) {
          return _react2.default.createElement(
            'option',
            { key: v, value: v },
            v
          );
        });
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          { title: 'Layout' },
          _react2.default.createElement(_LayoutsWidget2.default, { onChange: this.onLayoutChange })
        ),
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          { title: 'Viewport' },
          _react2.default.createElement(
            'select',
            {
              style: { width: '100%' },
              value: this.state.renderMethod,
              onChange: this.onRenderMethodChange
            },
            renderMethods
          )
        )
      );
    }
  });
});