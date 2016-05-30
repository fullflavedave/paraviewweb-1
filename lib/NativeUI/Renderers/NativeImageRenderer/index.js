'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MouseHandler = require('../../../Interaction/Core/MouseHandler');

var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NativeImageRenderer = function () {
  function NativeImageRenderer(domElement, imageProvider) {
    var _this = this;

    var mouseListeners = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var drawFPS = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    _classCallCheck(this, NativeImageRenderer);

    this.size = (0, _SizeHelper.getSize)(domElement);
    this.container = domElement;
    this.canvas = document.createElement('canvas');
    this.image = new Image();
    this.fps = '';
    this.drawFPS = drawFPS;
    this.subscriptions = [];
    this.imageProvider = imageProvider;

    this.image.onload = function () {
      _this.ctx.drawImage(_this.image, 0, 0);
      if (_this.drawFPS) {
        _this.ctx.textBaseline = 'top';
        _this.ctx.textAlign = 'left';
        _this.ctx.fillText(_this.fps, 5, 5);
      }
    };

    // Update DOM
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '30px Arial';

    // Attach mouse listener if needed
    if (mouseListeners) {
      this.mouseHandler = new _MouseHandler2.default(this.canvas);
      this.mouseHandler.attach(mouseListeners);
    }

    // Add image listener
    this.subscriptions.push(imageProvider.onImageReady(function (data, envelope) {
      _this.image.src = data.url;
      _this.fps = data.fps + ' fps';
    }));

    // Add size listener
    this.subscriptions.push((0, _SizeHelper.onSizeChange)(function () {
      _this.size = (0, _SizeHelper.getSize)(domElement);
      _this.canvas.setAttribute('width', _this.size.clientWidth);
      _this.canvas.setAttribute('height', _this.size.clientHeight);
    }));
    (0, _SizeHelper.startListening)();
  }

  _createClass(NativeImageRenderer, [{
    key: 'destroy',
    value: function destroy() {
      while (this.subscriptions.length) {
        this.subscriptions.pop().unsubscribe();
      }

      if (this.mouseHandler) {
        this.mouseHandler.destroy();
        this.mouseHandler = null;
      }

      this.container = null;
      this.imageProvider = null;
    }
  }]);

  return NativeImageRenderer;
}();

exports.default = NativeImageRenderer;