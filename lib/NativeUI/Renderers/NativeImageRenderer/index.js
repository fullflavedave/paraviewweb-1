define(['exports', '../../../Interaction/Core/MouseHandler', '../../../Common/Misc/SizeHelper'], function (exports, _MouseHandler, _SizeHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var NativeImageRenderer = function () {
    function NativeImageRenderer(domElement, imageProvider) {
      var _this = this;

      var mouseListeners = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var drawFPS = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

      _classCallCheck(this, NativeImageRenderer);

      this.size = _SizeHelper2.default.getSize(domElement);
      this.container = domElement;
      this.canvas = document.createElement('canvas');
      this.image = new Image();
      this.fps = '';
      this.drawFPS = drawFPS;
      this.subscriptions = [];
      this.imageProvider = imageProvider;

      this.image.onload = function () {
        _this.updateDrawnImage();
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
      this.subscriptions.push(_SizeHelper2.default.onSizeChange(function () {
        _this.size = _SizeHelper2.default.getSize(domElement);
        _this.canvas.setAttribute('width', _this.size.clientWidth);
        _this.canvas.setAttribute('height', _this.size.clientHeight);
        if (_this.image.src && _this.image.complete) {
          _this.updateDrawnImage();
        }
      }));
      _SizeHelper2.default.startListening();
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
    }, {
      key: 'updateDrawnImage',
      value: function updateDrawnImage() {
        this.ctx.drawImage(this.image, 0, 0);
        if (this.drawFPS) {
          this.ctx.textBaseline = 'top';
          this.ctx.textAlign = 'left';
          this.ctx.fillText(this.fps, 5, 5);
        }
      }
    }]);

    return NativeImageRenderer;
  }();

  exports.default = NativeImageRenderer;
});