'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _BinaryImageStream = require('../../../IO/WebSocket/BinaryImageStream');

var _BinaryImageStream2 = _interopRequireDefault(_BinaryImageStream);

var _NativeImageRenderer = require('../../../NativeUI/Renderers/NativeImageRenderer');

var _NativeImageRenderer2 = _interopRequireDefault(_NativeImageRenderer);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _VtkWebMouseListener = require('../../../Interaction/Core/VtkWebMouseListener');

var _VtkWebMouseListener2 = _interopRequireDefault(_VtkWebMouseListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'VtkRenderer',

  propTypes: {
    className: _react2.default.PropTypes.string,
    client: _react2.default.PropTypes.object,
    connection: _react2.default.PropTypes.object,
    showFPS: _react2.default.PropTypes.bool,
    style: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      showFPS: false,
      style: {}
    };
  },
  componentWillMount: function componentWillMount() {
    // Make sure we monitor window size if it is not already the case
    _SizeHelper2.default.startListening();
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var container = _reactDom2.default.findDOMNode(this);

    var wsbUrl = this.props.connection.urls + 'b';
    this.binaryImageStream = new _BinaryImageStream2.default(wsbUrl);
    this.mouseListener = new _VtkWebMouseListener2.default(this.props.client);

    // Attach interaction listener for image quality
    this.mouseListener.onInteraction(function (interact) {
      if (interact) {
        _this.binaryImageStream.startInteractiveQuality();
      } else {
        _this.binaryImageStream.stopInteractiveQuality();
      }
    });

    // Attach size listener
    this.subscription = _SizeHelper2.default.onSizeChange(function () {
      /* eslint-disable no-shadow */

      var _sizeHelper$getSize = _SizeHelper2.default.getSize(container);

      var clientWidth = _sizeHelper$getSize.clientWidth;
      var clientHeight = _sizeHelper$getSize.clientHeight;
      /* eslint-enable no-shadow */

      _this.mouseListener.updateSize(clientWidth, clientHeight);
      _this.props.client.session.call('viewport.size.update', [-1, clientWidth, clientHeight]);
    });

    // Create render
    this.imageRenderer = new _NativeImageRenderer2.default(container, this.binaryImageStream, this.mouseListener.getListeners(), this.props.showFPS);

    // Establish image stream connection
    this.binaryImageStream.connect({
      view_id: -1
    });

    // Update size
    _SizeHelper2.default.triggerChange();
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.binaryImageStream) {
      this.binaryImageStream.destroy();
      this.binaryImageStream = null;
    }

    if (this.mouseListener) {
      this.mouseListener.destroy();
      this.mouseListener = null;
    }

    if (this.imageRenderer) {
      this.imageRenderer.destroy();
      this.imageRenderer = null;
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  },
  render: function render() {
    return _react2.default.createElement('div', { className: this.props.className, style: this.props.style });
  }
});