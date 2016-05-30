'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _now = require('mout/src/time/now');

var _now2 = _interopRequireDefault(_now);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMAGE_READY_TOPIC = 'image-ready',
    MODEL_CHANGE_TOPIC = 'model-change';

// MagicLensImageBuilder Object ----------------------------------------------

var MagicLensImageBuilder = function () {
  function MagicLensImageBuilder(frontImageBuilder, backImageBuilder) {
    var lensColor = arguments.length <= 2 || arguments[2] === undefined ? '#ff0000' : arguments[2];
    var minZoom = arguments.length <= 3 || arguments[3] === undefined ? 20 : arguments[3];

    var _this = this;

    var maxZoom = arguments.length <= 4 || arguments[4] === undefined ? 0.5 : arguments[4];
    var lineWidth = arguments.length <= 5 || arguments[5] === undefined ? 2 : arguments[5];

    _classCallCheck(this, MagicLensImageBuilder);

    // Keep track of internal image builders
    this.frontImageBuilder = frontImageBuilder;
    this.backImageBuilder = backImageBuilder;
    this.frontEvent = null;
    this.backEvent = null;
    this.queryDataModel = this.frontImageBuilder.queryDataModel;

    // Internal render
    this.frontSubscription = this.frontImageBuilder.onImageReady(function (data, envelope) {
      _this.frontEvent = data;
      _this.draw();
    });

    this.backSubscription = this.backImageBuilder.onImageReady(function (data, envelope) {
      _this.backEvent = data;
      _this.draw();
    });

    // Lens informations

    var _frontImageBuilder$ge = frontImageBuilder.getControlModels();

    var dimensions = _frontImageBuilder$ge.dimensions;

    this.width = dimensions[0];
    this.height = dimensions[1];

    this.frontActive = true;

    this.minZoom = minZoom;
    this.maxZoom = Math.min(this.width, this.height) * maxZoom;
    this.lineWidth = lineWidth;

    this.lensColor = lensColor;
    this.lensCenterX = this.width / 2;
    this.lensCenterY = this.height / 2;
    this.lensOriginalCenterX = this.lensCenterX;
    this.lensOriginalCenterY = this.lensCenterY;
    this.lensDragDX = 0;
    this.lensDragDY = 0;
    this.lensRadius = Math.floor(Math.min(this.width, this.height) / 5);
    this.lensOriginalRadius = this.lensRadius;

    this.lastDragTime = (0, _now2.default)();
    this.lastZoomTime = (0, _now2.default)();
    this.newMouseTimeout = 250;

    this.lensDrag = false;
    this.listenerDrag = false;
    this.lensZoom = false;
    this.listenerZoom = false;

    // Rendering buffer
    this.bgCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);

    // Create custom listener for lens drag + zoom
    this.listener = {
      drag: function drag(event, envelope) {
        var time = (0, _now2.default)(),
            newDrag = _this.lastDragTime + _this.newMouseTimeout < time,
            eventManaged = false,
            activeArea = event.activeArea,
            xRatio = (event.relative.x - activeArea[0]) / activeArea[2],
            yRatio = (event.relative.y - activeArea[1]) / activeArea[3];

        // Clamp bounds
        xRatio = xRatio < 0 ? 0 : xRatio > 1 ? 1 : xRatio;
        yRatio = yRatio < 0 ? 0 : yRatio > 1 ? 1 : yRatio;

        var xPos = Math.floor(xRatio * _this.width),
            yPos = Math.floor(yRatio * _this.height),
            distFromLensCenter = Math.pow(xPos - _this.lensCenterX, 2) + Math.pow(yPos - _this.lensCenterY, 2);

        if (newDrag) {
          _this.lensZoom = false;
          _this.listenerZoom = false;
          _this.lensDrag = false;
          _this.listenerDrag = false;

          _this.lensOriginalCenterX = _this.lensCenterX;
          _this.lensOriginalCenterY = _this.lensCenterY;

          _this.lensDragDX = xPos - _this.lensCenterX;
          _this.lensDragDY = yPos - _this.lensCenterY;
        }

        if ((_this.lensDrag || distFromLensCenter < Math.pow(_this.lensRadius, 2)) && event.modifier === 0 && !_this.listenerDrag) {
          eventManaged = true;
          _this.lensDrag = true;

          _this.lensCenterX = xPos - _this.lensDragDX;
          _this.lensCenterY = yPos - _this.lensDragDY;

          // Make sure the lens can't go out of image
          _this.lensCenterX = Math.max(_this.lensCenterX, _this.lensRadius);
          _this.lensCenterY = Math.max(_this.lensCenterY, _this.lensRadius);
          _this.lensCenterX = Math.min(_this.lensCenterX, _this.width - _this.lensRadius);
          _this.lensCenterY = Math.min(_this.lensCenterY, _this.height - _this.lensRadius);

          _this.draw();
        }

        // Handle mouse listener if any
        var ibListener = _this.frontImageBuilder.getListeners();
        if (!eventManaged && ibListener && ibListener.drag) {
          _this.listenerDrag = true;
          eventManaged = ibListener.drag(event, envelope);
        }

        // Update dragTime
        _this.lastDragTime = time;

        return eventManaged;
      },
      /* eslint-disable complexity */
      zoom: function zoom(event, envelope) {
        var time = (0, _now2.default)(),
            newZoom = _this.lastZoomTime + _this.newMouseTimeout < time,
            eventManaged = false,
            activeArea = event.activeArea,
            xRatio = (event.relative.x - activeArea[0]) / activeArea[2],
            yRatio = (event.relative.y - activeArea[1]) / activeArea[3];

        // Reset  flags
        if (newZoom) {
          _this.lensZoom = false;
          _this.listenerZoom = false;
          _this.lensDrag = false;
          _this.listenerDrag = false;
        }

        // Clamp bounds
        xRatio = xRatio < 0 ? 0 : xRatio > 1 ? 1 : xRatio;
        yRatio = yRatio < 0 ? 0 : yRatio > 1 ? 1 : yRatio;

        var xPos = Math.floor(xRatio * _this.width),
            yPos = Math.floor(yRatio * _this.height),
            distFromLensCenter = Math.pow(xPos - _this.lensCenterX, 2) + Math.pow(yPos - _this.lensCenterY, 2);

        if ((_this.lensZoom || distFromLensCenter < Math.pow(_this.lensRadius, 2)) && event.modifier === 0 && !_this.listenerZoom) {
          eventManaged = true;
          _this.lensZoom = true;

          if (event.isFirst) {
            _this.lensOriginalRadius = _this.lensRadius;
          }
          var zoom = _this.lensOriginalRadius * event.scale;

          if (zoom < _this.minZoom) {
            zoom = _this.minZoom;
          }
          if (zoom > _this.maxZoom) {
            zoom = _this.maxZoom;
          }

          if (_this.lensRadius !== zoom) {
            _this.lensRadius = zoom;
            _this.draw();
          }

          if (event.isFinal) {
            _this.lensOriginalRadius = _this.lensRadius;
          }
        }

        // Handle mouse listener if any
        var ibListener = _this.frontImageBuilder.getListeners();
        if (!eventManaged && ibListener && ibListener.zoom) {
          _this.listenerZoom = true;
          eventManaged = ibListener.zoom(event, envelope);
        }

        // Update zoomTime
        _this.lastZoomTime = time;

        return eventManaged;
      },
      /* eslint-enable complexity */
      click: function click(event, envelope) {
        // Reset flags
        _this.lensDrag = false;
        _this.listenerDrag = false;
        _this.lensZoom = false;
        _this.listenerZoom = false;

        return false;
      }
    };
  }

  // ------------------------------------------------------------------------

  _createClass(MagicLensImageBuilder, [{
    key: 'draw',
    value: function draw() {
      if (!this.frontEvent || !this.backEvent) {
        return;
      }

      // Draw
      var ctx = this.bgCanvas.get2DContext();
      ctx.clearRect(0, 0, this.width, this.height);

      // Draw the outside
      ctx.drawImage(this.backEvent.canvas, this.backEvent.area[0], this.backEvent.area[1], this.backEvent.area[2], this.backEvent.area[3], 0, 0, this.width, this.height);

      // Record state for undo clip
      ctx.save();

      // Create lens mask
      ctx.beginPath();
      ctx.arc(this.lensCenterX, this.lensCenterY, this.lensRadius, 0, 2 * Math.PI);
      ctx.clip();

      // Empty lens content
      ctx.clearRect(0, 0, this.width, this.height);

      // Draw only in the lens
      ctx.drawImage(this.frontEvent.canvas, this.frontEvent.area[0], this.frontEvent.area[1], this.frontEvent.area[2], this.frontEvent.area[3], 0, 0, this.width, this.height);

      // Restore clip
      ctx.restore();

      // Draw lens edge
      ctx.beginPath();
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.lensColor;
      ctx.arc(this.lensCenterX, this.lensCenterY, this.lensRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();

      // Trigger image ready event
      var readyImage = {
        canvas: this.bgCanvas.el,
        area: [0, 0, this.width, this.height],
        outputSize: [this.width, this.height],
        builder: this,
        arguments: this.frontEvent.arguments
      };

      // Let everyone know the image is ready
      this.emit(IMAGE_READY_TOPIC, readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'update',
    value: function update() {
      this.frontImageBuilder.update();
      this.backImageBuilder.update();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      this.frontImageBuilder.render();
      this.backImageBuilder.render();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onImageReady',
    value: function onImageReady(callback) {
      return this.on(IMAGE_READY_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onModelChange',
    value: function onModelChange(callback) {
      return this.on(MODEL_CHANGE_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getListeners',
    value: function getListeners() {
      return this.listener;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      this.listener = null;

      this.frontSubscription.unsubscribe();
      this.frontSubscription = null;

      this.backSubscription.unsubscribe();
      this.backSubscription = null;

      this.frontImageBuilder.destroy();
      this.backImageBuilder.destroy();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getActiveImageBuilder',
    value: function getActiveImageBuilder() {
      return this.frontActive ? this.frontImageBuilder : this.backImageBuilder;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isFront',
    value: function isFront() {
      return this.frontActive;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'toggleLens',
    value: function toggleLens() {
      this.frontActive = !this.frontActive;
      this.emit(MODEL_CHANGE_TOPIC);
    }
  }]);

  return MagicLensImageBuilder;
}();

// Add Observer pattern using Monologue.js


exports.default = MagicLensImageBuilder;
_monologue2.default.mixInto(MagicLensImageBuilder);