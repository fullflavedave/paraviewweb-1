'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

var _Loop = require('../../../Common/Misc/Loop');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CPUCompositor = function () {
  function CPUCompositor(queryDataModel, imageBuilder, colorHelper, reverseCompositePass) {
    _classCallCheck(this, CPUCompositor);

    this.queryDataModel = queryDataModel;
    this.imageBuilder = imageBuilder;
    this.metadata = this.queryDataModel.originalData.SortedComposite;
    this.orderData = null;
    this.intensityData = null;
    this.colorHelper = colorHelper;
    this.numLayers = this.metadata.layers;
    this.reverseCompositePass = reverseCompositePass;

    this.width = this.metadata.dimensions[0];
    this.height = this.metadata.dimensions[1];
    this.bgCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.imageBuffer = this.bgCanvas.get2DContext().createImageData(this.width, this.height);
  }

  // --------------------------------------------------------------------------

  _createClass(CPUCompositor, [{
    key: 'updateData',
    value: function updateData(data) {
      this.orderData = new Uint8Array(data.order.data);
      if (data.intensity) {
        this.intensityData = new Uint8Array(data.intensity.data);
      } else {
        this.intensityData = null;
      }
    }

    // --------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      if (!this.orderData) {
        return;
      }

      var imageSize = this.width * this.height,
          pixels = this.imageBuffer.data,
          height = this.height,
          width = this.width,
          ctx = this.bgCanvas.get2DContext();

      // Reset pixels
      if (pixels.fill) {
        pixels.fill(0);
      } else {
        var count = width * height * 4;
        while (count--) {
          pixels[count] = 0;
        }
      }

      // Just iterate through all the layers in the data for now
      (0, _Loop.loop)(!!this.reverseCompositePass, this.numLayers, function (drawIdx) {
        for (var y = 0; y < _this.height; y++) {
          for (var x = 0; x < _this.width; x++) {
            var idx = _this.width * y + x,
                flipIdx = (height - y - 1) * width + x,
                layerIdx = _this.orderData[drawIdx * imageSize + idx];

            var intensity = 1.0;

            // Skip pixels (bg | not visible)
            if (layerIdx === 255 || _this.colorHelper.hasNoContent(layerIdx)) {
              continue;
            }

            if (_this.intensityData) {
              intensity = _this.intensityData[drawIdx * imageSize + idx] / 255.0;
            }

            // Blend
            var alphA = pixels[flipIdx * 4 + 3] / 255.0,
                alphANeg = 1.0 - alphA,
                rgbA = [pixels[flipIdx * 4], pixels[flipIdx * 4 + 1], pixels[flipIdx * 4 + 2]],
                pixelRGBA = _this.colorHelper.getColor(layerIdx, idx),
                alphaB = pixelRGBA[3] / 255.0,
                rgbB = [pixelRGBA[0] * intensity * alphaB * alphANeg, pixelRGBA[1] * intensity * alphaB * alphANeg, pixelRGBA[2] * intensity * alphaB * alphANeg],
                alphOut = alphA + alphaB * (1.0 - alphA);

            if (alphaB > 0) {
              pixels[flipIdx * 4] = (rgbA[0] * alphA + rgbB[0]) / alphOut;
              pixels[flipIdx * 4 + 1] = (rgbA[1] * alphA + rgbB[1]) / alphOut;
              pixels[flipIdx * 4 + 2] = (rgbA[2] * alphA + rgbB[2]) / alphOut;
              pixels[flipIdx * 4 + 3] = alphOut * 255.0;
            } else {
              console.log('no alpha while skip should have worked', pixelRGBA[3]);
            }
          }
        }
      });

      // Draw the result to the canvas
      ctx.putImageData(this.imageBuffer, 0, 0);

      var readyImage = {
        canvas: this.bgCanvas.el,
        area: [0, 0, this.width, this.height],
        outputSize: [this.width, this.height],
        builder: this.imageBuilder,
        arguments: this.queryDataModel.getQuery()
      };

      this.imageBuilder.imageReady(readyImage);
    }

    // --------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      this.bgCanvas.destroy();
      this.bgCanvas = null;

      this.queryDataModel = null;
      this.imageBuilder = null;
    }

    // --------------------------------------------------------------------------
    // Lighting Widget called methods
    // --------------------------------------------------------------------------

  }, {
    key: 'getLightProperties',
    value: function getLightProperties() {
      return {};
    }

    // --------------------------------------------------------------------------

  }, {
    key: 'setLightProperties',
    value: function setLightProperties(lightProps) {
      // this.lightProperties = merge(this.lightProperties, lightProps);
    }
  }]);

  return CPUCompositor;
}();

exports.default = CPUCompositor;