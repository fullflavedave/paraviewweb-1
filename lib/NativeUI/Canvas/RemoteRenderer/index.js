'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _MouseHandler = require('../../../Interaction/Core/MouseHandler');

var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

var _VtkWebMouseListener = require('../../../Interaction/Core/VtkWebMouseListener');

var _VtkWebMouseListener2 = _interopRequireDefault(_VtkWebMouseListener);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMAGE_READY_TOPIC = 'image-ready';

var RemoteRenderer = function () {
  function RemoteRenderer(pvwClient) {
    var _this = this;

    var container = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var id = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

    _classCallCheck(this, RemoteRenderer);

    this.client = pvwClient;
    this.setQuality();
    this.stats = { deltaT: [] };
    this.lastError = null;
    this.quality = 100;
    this.renderPending = false;

    this.canvas = document.createElement('canvas');

    this.imageDecoder = new Image();
    this.imageDecoder.addEventListener('load', function () {
      // Render image to canvas
      _this.canvas.setAttribute('width', _this.imageDecoder.width);
      _this.canvas.setAttribute('height', _this.imageDecoder.height);
      var ctx = _this.canvas.getContext('2d');
      ctx.drawImage(_this.imageDecoder, 0, 0);
    });

    this.container = null;
    this.options = {
      view: id,
      size: [400, 400],
      mtime: 0,
      quality: 100,
      localTime: 0
    };

    this.renderOnIdle = function () {
      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (_this.__timeout === null) {
        _this.__timeout = setTimeout(function () {
          if (!_this.render(force)) {
            _this.renderOnIdle(force);
          }
        }, 250);
      }
    };

    this.mouseListener = new _VtkWebMouseListener2.default(pvwClient);
    this.mouseListener.setInteractionDoneCallback(function (interact) {
      _this.quality = interact ? _this.interactiveQuality : _this.stillQuality;
      if (!_this.render(!interact)) {
        _this.renderOnIdle(!interact);
      }
    });

    this.setContainer(container);
  }

  _createClass(RemoteRenderer, [{
    key: 'setQuality',
    value: function setQuality() {
      var interactive = arguments.length <= 0 || arguments[0] === undefined ? 50 : arguments[0];
      var still = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

      this.stillQuality = still;
      this.interactiveQuality = interactive;
    }
  }, {
    key: 'setView',
    value: function setView(id) {
      this.options.view = id;
    }
  }, {
    key: 'setContainer',
    value: function setContainer() {
      var container = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.container && this.container !== container) {
        // Clean previous container
        this.container.removeChild(this.canvas);
        this.mouseHandler.destroy();

        this.container = null;
        this.mouseHandler = null;
        this.size = null;
      }

      if (container && this.container !== container) {
        this.container = container;
        this.mouseHandler = new _MouseHandler2.default(container);
        this.mouseHandler.attach(this.mouseListener.getListeners());
        this.container.appendChild(this.canvas);
        this.size = (0, _SizeHelper.getSize)(container);
        this.render(true);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (this.renderPending) {
        this.renderOnIdle(force);
        return false;
      }

      if (this.__timeout !== null) {
        // clear any renderOnIdle requests that are pending since we
        // are sending a render request.
        clearTimeout(this.__timeout);
        this.__timeout = null;
      }

      if (this.client && this.size && this.container) {
        this.renderPending = true;

        // Update local options
        this.options.size[0] = this.size.clientWidth;
        this.options.size[1] = this.size.clientHeight;
        this.options.quality = this.quality;
        this.options.localTime = +new Date();
        this.options.clearCache = !!force;
        if (force) {
          this.options.mtime = 0;
        }
        this.mouseListener.updateSize(this.options.size[0], this.options.size[1]);

        // Trigger remote call
        this.client.ViewPortImageDelivery.stillRender(this.options).then(function (resp) {
          _this2.renderPending = false;

          // stats
          var localTime = +new Date();
          _this2.stats.workTime = resp.workTime;
          _this2.stats.roundTrip = localTime - resp.localTime - resp.workTime;
          _this2.stats.deltaT.push(localTime - resp.localTime);
          while (_this2.stats.deltaT.length > 100) {
            _this2.stats.deltaT.shift();
          }

          // update local options
          _this2.options.mtime = resp.mtime;
          _this2.view = resp.global_id;

          // process image
          if (resp.image) {
            _this2.imageDecoder.src = 'data:image/' + resp.format + ',' + resp.image;
          }

          // final image
          if (resp.stale) {
            _this2.renderOnIdle(force);
          } else {
            _this2.emit(IMAGE_READY_TOPIC, _this2);
          }
        }, function (err) {
          _this2.renderPending = false;
          _this2.lastError = err;
        });
        return true;
      }
      return false;
    }
  }, {
    key: 'resize',
    value: function resize() {
      if (this.container) {
        this.size = (0, _SizeHelper.getSize)(this.container);
        this.render(true);
      }
    }
  }, {
    key: 'onImageReady',
    value: function onImageReady(callback) {
      return this.on(IMAGE_READY_TOPIC, callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      this.setContainer(null);
      if (this.mouseListener) {
        this.mouseListener.destroy();
        this.mouseListener = null;
      }
      this.client = null;
      this.imageDecoder = null;
      this.canvas = null;
    }
  }]);

  return RemoteRenderer;
}();

exports.default = RemoteRenderer;


_monologue2.default.mixInto(RemoteRenderer);