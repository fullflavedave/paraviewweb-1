define(['exports', 'react', '../../../Common/Misc/SizeHelper'], function (exports, _react, _SizeHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'GeometryRenderer',

    propTypes: {
      geometryBuilder: _react2.default.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
      return {};
    },
    getInitialState: function getInitialState() {
      return {
        width: 200,
        height: 200
      };
    },
    componentWillMount: function componentWillMount() {
      // Listen to window resize
      this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);

      // Make sure we monitor window size if it is not already the case
      _SizeHelper2.default.startListening();
    },
    componentDidMount: function componentDidMount() {
      if (this.props.geometryBuilder) {
        this.props.geometryBuilder.configureRenderer(this.canvasRenderer);
        this.props.geometryBuilder.render();
      }
      this.updateDimensions();
    },
    componentDidUpdate: function componentDidUpdate(nextProps, nextState) {
      this.updateDimensions();
    },
    componentWillUnmount: function componentWillUnmount() {
      // Remove window listener
      if (this.sizeSubscription) {
        this.sizeSubscription.unsubscribe();
        this.sizeSubscription = null;
      }
    },
    updateDimensions: function updateDimensions() {
      var el = this.canvasRenderer.parentNode,
          elSize = _SizeHelper2.default.getSize(el);

      if (el && (this.state.width !== elSize.clientWidth || this.state.height !== elSize.clientHeight)) {
        this.setState({
          width: elSize.clientWidth,
          height: elSize.clientHeight
        });

        if (this.props.geometryBuilder) {
          this.props.geometryBuilder.updateSize(window.innerWidth, window.innerHeight);
        }
        return true;
      }
      return false;
    },
    resetCamera: function resetCamera() {
      if (this.props.geometryBuilder) {
        this.props.geometryBuilder.resetCamera();
      }
    },
    render: function render() {
      var _this = this;

      return _react2.default.createElement('canvas', {
        className: 'CanvasImageRenderer',
        ref: function ref(c) {
          _this.canvasRenderer = c;
        },
        width: this.state.width,
        height: this.state.height
      });
    }
  });
});