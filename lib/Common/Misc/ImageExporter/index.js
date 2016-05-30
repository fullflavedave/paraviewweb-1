'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasOffscreenBuffer = require('../CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageExporter = function () {
  function ImageExporter() {
    var format = arguments.length <= 0 || arguments[0] === undefined ? 'image/jpeg' : arguments[0];
    var padding = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    _classCallCheck(this, ImageExporter);

    this.format = format;
    this.padding = padding;
    this.counter = 0;
    this.bgCanvas = null;
    this.imageToDecode = null;
  }

  _createClass(ImageExporter, [{
    key: 'exportImage',
    value: function exportImage(data) {
      var xhr = new XMLHttpRequest();
      var dataToSend = {};
      var ts = Number(this.counter++).toString();

      if (!data.canvas || !data.arguments) {
        return;
      }

      while (ts.length < this.padding) {
        ts = '0' + ts;
      }
      dataToSend.arguments = data.arguments;
      dataToSend.image = data.canvas.toDataURL(this.format);
      /* eslint-disable no-underscore-dangle */
      dataToSend.arguments.__ = ts;

      xhr.open('POST', '/export', true);
      xhr.responseType = 'text';
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function (e) {
        if (xhr.status === 200) {
          return;
        }
      };

      xhr.onerror = function (e) {
        console.log('error export', data.arguments);
      };

      xhr.send(JSON.stringify(dataToSend));
    }
  }, {
    key: 'updateMetadata',
    value: function updateMetadata(dataToSend) {
      // Validate image data and use a canvas to convert it if need be
      if (dataToSend.image.indexOf('blob:') !== -1) {
        if (!this.bgCanvas) {
          this.bgCanvas = new _CanvasOffscreenBuffer2.default(100, 100);
        }
        if (!this.imageToDecode) {
          this.imageToDecode = new Image();
        }

        // Decode image
        this.imageToDecode.src = dataToSend.image;

        // Resize canvas and draw image into it
        this.bgCanvas.size(this.imageToDecode.width, this.imageToDecode.height);
        this.bgCanvas.get2DContext().drawImage(this.imageToDecode, 0, 0);
        dataToSend.image = this.bgCanvas.toDataURL('image/png');
      }

      var xhr = new XMLHttpRequest();

      xhr.open('POST', '/update', true);
      xhr.responseType = 'text';
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function (e) {
        if (xhr.status === 200) {
          return;
        }
      };

      xhr.onerror = function (e) {
        console.log('error export', e);
      };

      xhr.send(JSON.stringify(dataToSend));
    }
  }, {
    key: 'extractCanvasRegion',
    value: function extractCanvasRegion(canvas, region, outputSize) {
      var format = arguments.length <= 3 || arguments[3] === undefined ? 'image/png' : arguments[3];

      if (!this.bgCanvas) {
        this.bgCanvas = new _CanvasOffscreenBuffer2.default(100, 100);
      }

      this.bgCanvas.size(outputSize[0], outputSize[1]);
      this.bgCanvas.get2DContext().drawImage(canvas, region[0], region[1], region[2], region[3], 0, 0, outputSize[0], outputSize[1]);
      return this.bgCanvas.toDataURL(format);
    }
  }]);

  return ImageExporter;
}();

exports.default = ImageExporter;