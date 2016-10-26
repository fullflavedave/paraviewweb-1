define(['exports', 'monologue.js'], function (exports, _monologue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _monologue2 = _interopRequireDefault(_monologue);

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

  var IMAGE_READY = 'image.ready';

  var BinaryImageStream = function () {
    function BinaryImageStream(endpointURL) {
      var stillQuality = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
      var interactiveQuality = arguments.length <= 2 || arguments[2] === undefined ? 50 : arguments[2];
      var mimeType = arguments.length <= 3 || arguments[3] === undefined ? 'image/jpeg' : arguments[3];

      _classCallCheck(this, BinaryImageStream);

      this.endpoint = endpointURL;
      this.ws = null;
      this.textMode = true;
      this.metadata = null;
      this.activeURL = null;
      this.fps = 0;
      this.mimeType = mimeType;
      this.lastTime = +new Date();
      this.view_id = -1;
      this.stillQuality = stillQuality;
      this.interactiveQuality = interactiveQuality;

      this.lastImageReadyEvent = null;
    }

    _createClass(BinaryImageStream, [{
      key: 'enableView',
      value: function enableView(enabled) {
        this.ws.send(JSON.stringify({
          view_id: this.view_id,
          enabled: enabled
        }));
      }
    }, {
      key: 'startInteractiveQuality',
      value: function startInteractiveQuality() {
        this.ws.send(JSON.stringify({
          view_id: this.view_id,
          quality: this.interactiveQuality
        }));
      }
    }, {
      key: 'stopInteractiveQuality',
      value: function stopInteractiveQuality() {
        this.ws.send(JSON.stringify({
          view_id: this.view_id,
          quality: this.stillQuality
        }));
      }
    }, {
      key: 'invalidateCache',
      value: function invalidateCache() {
        this.ws.send(JSON.stringify({
          view_id: this.view_id,
          invalidate_cache: true
        }));
      }
    }, {
      key: 'updateQuality',
      value: function updateQuality() {
        var stillQuality = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
        var interactiveQuality = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];

        this.stillQuality = stillQuality;
        this.interactiveQuality = interactiveQuality;
      }
    }, {
      key: 'connect',
      value: function connect(_ref) {
        var _this = this;

        var _ref$view_id = _ref.view_id;
        var view_id = _ref$view_id === undefined ? -1 : _ref$view_id;
        var _ref$size = _ref.size;
        var size = _ref$size === undefined ? [500, 500] : _ref$size;

        return new Promise(function (resolve, reject) {
          if (!_this.ws) {
            _this.ws = new WebSocket(_this.endpoint);
            _this.textMode = true;

            _this.view_id = view_id;
            _this.width = size[0];
            _this.height = size[1];

            _this.ws.onopen = function () {
              _this.ws.send(JSON.stringify({
                view_id: view_id
              }));
              resolve();
            };

            _this.ws.onmessage = function (msg) {
              if (_this.textMode) {
                _this.metadata = JSON.parse(msg.data);
              } else {
                var imgBlob = new Blob([msg.data], {
                  type: _this.mimeType
                });
                if (_this.activeURL) {
                  window.URL.revokeObjectURL(_this.activeURL);
                  _this.activeURL = null;
                }
                _this.activeURL = URL.createObjectURL(imgBlob);
                var time = +new Date();
                _this.fps = Math.floor(10000 / (time - _this.lastTime)) / 10;
                _this.lastTime = time;

                _this.lastImageReadyEvent = {
                  url: _this.activeURL,
                  fps: _this.fps,
                  metadata: _this.metadata
                };

                _this.emit(IMAGE_READY, _this.lastImageReadyEvent);
              }
              _this.textMode = !_this.textMode;
            };
          }
        });
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.off();
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
      }
    }, {
      key: 'onImageReady',
      value: function onImageReady(callback) {
        return this.on(IMAGE_READY, callback);
      }
    }, {
      key: 'getLastImageReadyEvent',
      value: function getLastImageReadyEvent() {
        return this.lastImageReadyEvent;
      }
    }]);

    return BinaryImageStream;
  }();

  exports.default = BinaryImageStream;


  _monologue2.default.mixInto(BinaryImageStream);
});