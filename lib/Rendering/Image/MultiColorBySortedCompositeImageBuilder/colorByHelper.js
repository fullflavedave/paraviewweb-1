'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var encoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function createColorLookupConst(lut, value) {
  return function (idx) {
    return lut.getColor(value);
  };
}

function createColorLookup(lut, floatMap, layer, color) {
  return function (idx) {
    return lut.getColor(floatMap[layer][color][idx]);
  };
}

var ColorByHelper = function () {
  function ColorByHelper(layers, fieldCodes, lookupTableManager) {
    _classCallCheck(this, ColorByHelper);

    this.nbLayers = layers.length;
    this.fieldCodes = fieldCodes;
    this.lookupTableManager = lookupTableManager;
    this.layerFloatData = {};
    this.layerVisible = {};
    this.layerAlpha = {};
    this.layerColorBy = {};
    this.layerGetColor = {};
    this.categories = [];

    // Fill function map to get color
    for (var layerIdx = 0; layerIdx < this.nbLayers; layerIdx++) {
      this.layerFloatData[encoding[layerIdx]] = {};
      this.layerVisible[encoding[layerIdx]] = 1.0;
      this.layerAlpha[encoding[layerIdx]] = 1.0;
      this.layerGetColor[encoding[layerIdx]] = {};

      var array = layers[layerIdx].colorBy;
      var count = array.length;
      while (count--) {
        var colorBy = array[count],
            layerCode = encoding[layerIdx],
            colorName = colorBy.name,
            lut = this.lookupTableManager.getLookupTable(colorBy.name);

        if (colorBy.type === 'const') {
          this.layerGetColor[layerCode][colorName] = createColorLookupConst(lut, colorBy.value);
        } else if (colorBy.type === 'field') {
          this.layerGetColor[layerCode][colorName] = createColorLookup(lut, this.layerFloatData, layerCode, colorName);
        }
      }
    }
  }

  _createClass(ColorByHelper, [{
    key: 'updateData',
    value: function updateData(data) {
      var _this = this;

      Object.keys(data).forEach(function (name) {
        if (name.indexOf('_') !== -1) {
          var splitName = name.split('_'),
              layerName = encoding[Number(splitName.shift())],
              colorBy = splitName.join('_');

          _this.layerFloatData[layerName][colorBy] = new Float32Array(data[name].data);
        }
      });
    }
  }, {
    key: 'updatePipeline',
    value: function updatePipeline(query) {
      this.categories = [];
      for (var layerIdx = 0; layerIdx < this.nbLayers; layerIdx++) {
        var layerCode = encoding[layerIdx],
            colorCode = query[layerIdx * 2 + 1];

        if (colorCode === '_') {
          this.layerVisible[layerCode] = 0.0;
        } else {
          this.layerVisible[layerCode] = 1.0;
          this.layerColorBy[layerCode] = this.fieldCodes[colorCode];
          this.categories.push([layerIdx, this.fieldCodes[colorCode]].join('_'));
        }
      }
    }
  }, {
    key: 'updateAlphas',
    value: function updateAlphas(alphas) {
      for (var i = 0; i < this.nbLayers; i++) {
        this.layerAlpha[encoding[i]] = alphas[i];
      }
    }
  }, {
    key: 'hasNoContent',
    value: function hasNoContent(layerIdx) {
      var layerCode = encoding[layerIdx],
          alpha = this.layerAlpha[layerCode] * this.layerVisible[layerCode];
      return alpha === 0;
    }
  }, {
    key: 'getColor',
    value: function getColor(layerIdx, pixelIdx) {
      var layerCode = encoding[layerIdx],
          color = this.layerGetColor[layerCode][this.layerColorBy[layerCode]](pixelIdx),
          alpha = this.layerAlpha[layerCode] * this.layerVisible[layerCode];

      return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * alpha];
    }
  }, {
    key: 'getCategories',
    value: function getCategories() {
      return this.categories;
    }
  }, {
    key: 'getLayerColorByName',
    value: function getLayerColorByName(layerIdx) {
      return this.layerColorBy[encoding[layerIdx]];
    }
  }, {
    key: 'getLayerVisible',
    value: function getLayerVisible(layerIdx) {
      return this.layerVisible[encoding[layerIdx]];
    }
  }, {
    key: 'getLayerLut',
    value: function getLayerLut(layerIdx) {
      return this.lookupTableManager.getLookupTable(this.layerColorBy[encoding[layerIdx]]);
    }
  }, {
    key: 'getLayerFloatData',
    value: function getLayerFloatData(layerIdx) {
      var layerName = encoding[layerIdx];
      return this.layerFloatData[layerName][this.layerColorBy[layerName]];
    }
  }, {
    key: 'getLayerAlpha',
    value: function getLayerAlpha(layerIdx) {
      return this.layerAlpha[encoding[layerIdx]];
    }
  }]);

  return ColorByHelper;
}();

exports.default = ColorByHelper;