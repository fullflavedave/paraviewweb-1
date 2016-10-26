'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var offscreenCanvasCount = 0;

// Create <canvas/> within the DOM
/* global document */

var CanvasOffscreenBuffer = function () {
  function CanvasOffscreenBuffer(width, height) {
    _classCallCheck(this, CanvasOffscreenBuffer);

    offscreenCanvasCount += 1;
    this.id = 'CanvasOffscreenBuffer_' + offscreenCanvasCount;
    this.el = document.createElement('canvas');
    this.width = width;
    this.height = height;

    this.el.style.display = 'none';
    this.el.setAttribute('width', this.width);
    this.el.setAttribute('height', this.height);

    document.body.appendChild(this.el);
  }

  _createClass(CanvasOffscreenBuffer, [{
    key: 'size',
    value: function size(width, height) {
      if (width) {
        this.el.setAttribute('width', this.width = width);
      }
      if (height) {
        this.el.setAttribute('height', this.height = height);
      }
      return [Number(this.width), Number(this.height)];
    }
  }, {
    key: 'get2DContext',
    value: function get2DContext() {
      return this.el.getContext('2d');
    }
  }, {
    key: 'get3DContext',
    value: function get3DContext() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? { preserveDrawingBuffer: true, premultipliedAlpha: false } : arguments[0];

      return this.el.getContext('webgl', options) || this.el.getContext('experimental-webgl', options);
    }

    // Remove canvas from DOM

  }, {
    key: 'destroy',
    value: function destroy() {
      this.el.parentNode.removeChild(this.el);
      this.el = null;
      this.width = null;
      this.height = null;
    }
  }, {
    key: 'toDataURL',
    value: function toDataURL(type, encoderOptions) {
      return this.el.toDataURL(type, encoderOptions);
    }
  }]);

  return CanvasOffscreenBuffer;
}();

exports.default = CanvasOffscreenBuffer;