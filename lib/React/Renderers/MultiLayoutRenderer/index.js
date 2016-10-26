'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _Layouts = require('./Layouts');

var _Layouts2 = _interopRequireDefault(_Layouts);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _MouseHandler = require('../../../Interaction/Core/MouseHandler');

var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var layoutNames = Object.keys(_Layouts2.default);
var ACTIVE_VIEWPORT_CHANGE = 'multiview-viewport-active-change';
var LAYOUT_CHANGE = 'multiview-layout-change';

/**
 * This React component expect the following input properties:
 */
var MultiViewRenderer = _react2.default.createClass({

  displayName: 'MultiViewRenderer',

  propTypes: {
    activeColor: _react2.default.PropTypes.string,
    borderColor: _react2.default.PropTypes.string,
    crosshairColor: _react2.default.PropTypes.string,
    layout: _react2.default.PropTypes.string,
    renderers: _react2.default.PropTypes.object,
    spacing: _react2.default.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      spacing: 10,
      borderColor: '#000000',
      activeColor: '#0000FF',
      crosshairColor: '#000000',
      renderers: {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      width: 200,
      height: 200
    };
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    var drawViewportByName = this.drawViewportByName;

    this.dragCenter = false;
    this.dragInViewport = null;
    this.center = [0.5, 0.5];
    this.layout = this.props.layout || '3xT';
    this.viewports = [];

    function drawCallback(data, envelope) {
      this.dataToDraw = data;
      drawViewportByName(this.name);
    }

    // Init viewports from props
    Object.keys(this.props.renderers).forEach(function (name) {
      var item = _this.props.renderers[name],
          imageBuilder = item.builder,
          painter = item.painter;

      // Renderer is an ImageBuilder
      if (imageBuilder) {
        imageBuilder.onImageReady(drawCallback).context(item);
      }
      // Renderer is a Painter
      if (painter) {
        painter.onPainterReady(drawCallback).context(item);
      }

      _this.viewports.push({
        name: name,
        active: false
      });
    });

    // Listen to window resize
    this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);

    // Make sure we monitor window size if it is not already the case
    _SizeHelper2.default.startListening();
  },
  componentDidMount: function componentDidMount() {
    this.updateDimensions();

    // Attach mouse listener
    this.mouseHandler = new _MouseHandler2.default(this.canvasRenderer);

    this.mouseHandler.attach({
      drag: this.dragCallback,
      click: this.clickCallback,
      zoom: this.zoomCallback
    });
  },
  componentDidUpdate: function componentDidUpdate(nextProps, nextState) {
    this.drawLayout();
  },
  componentWillUnmount: function componentWillUnmount() {
    this.off();

    // Free mouseHandler
    if (this.mouseHandler) {
      this.mouseHandler.destroy();
      this.mouseHandler = null;
    }

    // Remove window listener
    if (this.sizeSubscription) {
      this.sizeSubscription.unsubscribe();
      this.sizeSubscription = null;
    }
  },
  onActiveViewportChange: function onActiveViewportChange(callback) {
    return this.on(ACTIVE_VIEWPORT_CHANGE, callback);
  },
  onLayoutChange: function onLayoutChange(callback) {
    return this.on(LAYOUT_CHANGE, callback);
  },
  getActiveLayout: function getActiveLayout() {
    return this.layout;
  },
  getLayouts: function getLayouts() {
    return layoutNames;
  },
  setLayout: function setLayout(name) {
    this.layout = name;
    this.drawLayout();
    this.emit(LAYOUT_CHANGE, name);
  },
  setRenderMethod: function setRenderMethod(name) {
    var _this2 = this;

    this.viewports.forEach(function (viewport) {
      if (viewport.active) {
        viewport.name = name;
        _this2.emit(ACTIVE_VIEWPORT_CHANGE, viewport);
      }
    });
    this.drawViewportByName(null);
  },
  getRenderMethods: function getRenderMethods() {
    return Object.keys(this.props.renderers);
  },
  getActiveRenderMethod: function getActiveRenderMethod() {
    var name = 'No render method';
    this.viewports.forEach(function (viewport) {
      if (viewport.active) {
        name = viewport.name;
      }
    });
    return name;
  },
  getViewPort: function getViewPort(event) {
    var count = this.viewports.length,
        x = event.relative.x,
        y = event.relative.y;

    while (count) {
      count -= 1;
      var area = this.viewports[count].activeArea || this.viewports[count].region;
      if (x >= area[0] && y >= area[1] && x <= area[0] + area[2] && y <= area[1] + area[3]) {
        return this.viewports[count];
      }
    }

    return null;
  },
  updateDimensions: function updateDimensions() {
    var el = this.canvasRenderer.parentNode,
        elSize = _SizeHelper2.default.getSize(el);

    if (el && (this.state.width !== elSize.clientWidth || this.state.height !== elSize.clientHeight)) {
      this.setState({
        width: elSize.clientWidth,
        height: elSize.clientHeight
      });
      return true;
    }
    return false;
  },
  dragCallback: function dragCallback(event, envelope) {
    var viewport = this.getViewPort(event);

    if ((viewport || this.dragInViewport) && !this.dragCenter) {
      this.dragInViewport = this.dragInViewport || viewport;

      // Forward event to viewport event handler
      var renderer = this.props.renderers[this.dragInViewport.name],
          imageBuilder = renderer.builder,
          listeners = imageBuilder ? imageBuilder.getListeners() : null; // FIXME ?

      if (listeners && listeners.drag) {
        // Update relative information
        event.activeArea = this.dragInViewport.activeArea;

        // Forward event
        listeners.drag(event, envelope);
      }
    } else {
      this.dragCenter = true;

      // Update center and redraw
      this.center[0] = event.relative.x / this.state.width;
      this.center[1] = event.relative.y / this.state.height;
      this.drawLayout();
    }

    if (event.isFinal) {
      this.dragCenter = false;
      this.dragInViewport = null;
    }
  },
  clickCallback: function clickCallback(event, envelope) {
    // Reset any previous drag state
    this.dragCenter = false;
    this.dragInViewport = null;

    var viewport = this.getViewPort(event);

    if (viewport) {
      this.viewports.forEach(function (item) {
        item.active = false;
      });
      viewport.active = true;

      // Forward event to viewport event handler
      var renderer = this.props.renderers[viewport.name],
          imageBuilder = renderer.builder,
          listeners = imageBuilder ? imageBuilder.getListeners() : null; // FIXME ?

      if (listeners && listeners.click) {
        // Update relative information
        event.activeArea = viewport.activeArea;

        // Forward event
        listeners.click(event, envelope);
      }

      // Let's other know that the active viewport has changed
      this.emit(ACTIVE_VIEWPORT_CHANGE, viewport);
    }

    // Redraw the outline with the appropriate color for active
    this.drawLayout();
  },
  zoomCallback: function zoomCallback(event, envelope) {
    var viewport = this.getViewPort(event);

    if (viewport) {
      // Forward event to viewport event handler
      var renderer = this.props.renderers[viewport.name],
          imageBuilder = renderer.builder,
          listeners = imageBuilder ? imageBuilder.getListeners() : null;

      if (listeners && listeners.zoom) {
        // Update relative information
        event.activeArea = viewport.activeArea;

        // Forward event
        listeners.zoom(event, envelope);
      }
    }
  },
  drawViewport: function drawViewport(viewport) {
    var renderer = this.props.renderers[viewport.name],
        region = viewport.region,
        ctx = this.canvasRenderer.getContext('2d');

    if (!renderer || renderer.builder && !renderer.dataToDraw || renderer.painter && !renderer.painter.isReady()) {
      return;
    }

    if (renderer.painter) {
      var location = {
        x: region[0] + 2,
        y: region[1] + 2,
        width: region[2] - 4,
        height: region[3] - 4
      };
      viewport.activeArea = [].concat(viewport.region);
      renderer.painter.paint(ctx, location);
    } else {
      // Assume Image builder
      var dataToDraw = this.props.renderers[viewport.name].dataToDraw,
          w = region[2] - 2,
          h = region[3] - 2,
          iw = dataToDraw.outputSize[0],
          ih = dataToDraw.outputSize[1],
          zoomLevel = Math.min(w / iw, h / ih);

      ctx.clearRect(region[0] + 1, region[1] + 1, region[2] - 2, region[3] - 2);

      var tw = Math.floor(iw * zoomLevel) - 2,
          th = Math.floor(ih * zoomLevel) - 2,
          tx = 1 + region[0] + (w * 0.5 - tw / 2),
          ty = 1 + region[1] + (h * 0.5 - th / 2);

      try {
        ctx.drawImage(dataToDraw.canvas, dataToDraw.area[0], dataToDraw.area[1], dataToDraw.area[2], dataToDraw.area[3], // Source image   [Location,Size]
        tx, ty, tw, th); // Target drawing [Location,Size]

        // Draw cross hair if any
        if (dataToDraw.crosshair) {
          var scale = [tw / dataToDraw.area[2], th / dataToDraw.area[3]],
              translate = [tx, ty];

          ctx.beginPath();

          ctx.moveTo(translate[0] + scale[0] * dataToDraw.crosshair[0], ty);
          ctx.lineTo(translate[0] + scale[0] * dataToDraw.crosshair[0], ty + th);

          ctx.moveTo(tx, translate[1] + scale[1] * dataToDraw.crosshair[1]);
          ctx.lineTo(tx + tw, translate[1] + scale[1] * dataToDraw.crosshair[1]);

          ctx.strokeStyle = this.props.crosshairColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        viewport.activeArea = [tx, ty, tw, th];
      } catch (err) {
        console.log('Error in MultiLayoutRenderer::drawViewport', err);
      }
    }
  },
  drawViewportByName: function drawViewportByName(name) {
    var _this3 = this;

    var renderer = name ? this.props.renderers[name] : null;

    // Update image builder if any
    if (renderer && renderer.builder && !renderer.dataToDraw) {
      renderer.builder.update();
      return;
    }

    this.viewports.forEach(function (viewport) {
      if (viewport.name === name || name === null) {
        _this3.drawViewport(viewport);
      }
    });
  },
  drawLayout: function drawLayout() {
    var ctx = this.canvasRenderer.getContext('2d'),
        width = ctx.canvas.width = this.state.width,
        height = ctx.canvas.height = this.state.height,
        centerPx = [this.center[0] * width, this.center[1] * height],
        spacing = this.props.spacing,
        regions = _Layouts2.default[this.layout](centerPx, spacing, width, height),
        viewports = this.viewports,
        numberOfRegions = regions.length;

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < numberOfRegions; ++i) {
      var region = regions.shift();
      if (i < viewports.length) {
        viewports[i].region = region;
      } else {
        viewports.push({
          name: this.getRenderMethods()[0],
          region: region,
          active: false
        });
      }
      ctx.beginPath();
      ctx.strokeStyle = viewports[i].active ? this.props.activeColor : this.props.borderColor;
      ctx.rect.apply(ctx, _toConsumableArray(region));
      ctx.stroke();
    }

    // Remove the unused viewports
    while (viewports.length > numberOfRegions) {
      viewports.pop();
    }

    this.drawViewportByName(null);
  },
  render: function render() {
    var _this4 = this;

    return _react2.default.createElement('canvas', {
      className: 'CanvasMultiImageRenderer',
      ref: function ref(c) {
        _this4.canvasRenderer = c;
      },
      width: this.state.width,
      height: this.state.height
    });
  }
});

// Add Observer pattern to the class using Monologue.js
_monologue2.default.mixInto(MultiViewRenderer);

// Export the class definition
exports.default = MultiViewRenderer;