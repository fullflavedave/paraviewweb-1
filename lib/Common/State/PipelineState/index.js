'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CHANGE_TOPIC = 'pipeline.change';
var OPACITY_CHANGE_TOPIC = 'opacity.change';
var LAYER_CODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

var PipelineState = function () {
  function PipelineState(jsonData) {
    var _this = this;

    var hasOpacity = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, PipelineState);

    this.originalData = jsonData;
    this.visibilityState = {};
    this.activeState = {};
    this.editMode = {};
    this.activeColors = {};
    this.noTrigger = true;
    this.handleOpacity = hasOpacity;
    this.opacityMap = {};
    this.nbLayers = 0;

    // Handle default pipeline if any
    var pipelineQuery = jsonData.CompositePipeline.default_pipeline;
    var layerFields = jsonData.CompositePipeline.layer_fields;
    function isLayerVisible(layers) {
      if (!pipelineQuery || layers.length > 1) {
        return true;
      }

      var layerIdx = LAYER_CODE.indexOf(layers[0]);

      return pipelineQuery[layerIdx * 2 + 1] !== '_';
    }
    function getColorCode(layers) {
      if (!pipelineQuery || layers.length > 1) {
        return layerFields[layers][0];
      }

      var layerIdx = LAYER_CODE.indexOf(layers[0]);
      var colorCode = pipelineQuery[layerIdx * 2 + 1];

      return colorCode === '_' ? layerFields[layers][0] : colorCode;
    }

    // Fill visibility and activate all layers
    var isRoot = {};
    jsonData.CompositePipeline.pipeline.forEach(function (item) {
      isRoot[item.ids.join('')] = true;
      _this.setLayerVisible(item.ids.join(''), isLayerVisible(item.ids.join('')));
    });
    jsonData.CompositePipeline.layers.forEach(function (item) {
      _this.activeState[item] = isRoot[item] ? true : isLayerVisible(item);
      _this.activeColors[item] = getColorCode(item);

      // Initialize opacity
      _this.opacityMap[item] = 100.0;
      _this.nbLayers++;
    });

    this.noTrigger = false;
    this.triggerChange();
  }

  // ------------------------------------------------------------------------

  _createClass(PipelineState, [{
    key: 'onChange',
    value: function onChange(listener) {
      return this.on(CHANGE_TOPIC, listener);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onOpacityChange',
    value: function onOpacityChange(listener) {
      return this.on(OPACITY_CHANGE_TOPIC, listener);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'TopicChange',
    value: function TopicChange() {
      return CHANGE_TOPIC;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'triggerChange',
    value: function triggerChange() {
      if (this.noTrigger) {
        return;
      }

      var pipelineQuery = this.getPipelineQuery();
      this.emit(CHANGE_TOPIC, pipelineQuery);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isLayerActive',
    value: function isLayerActive(layerId) {
      return this.activeState[layerId];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLayerActive',
    value: function setLayerActive(layerId, active) {
      if (this.activeState[layerId] !== active) {
        this.activeState[layerId] = active;
        this.triggerChange();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'toggleLayerActive',
    value: function toggleLayerActive(layerId) {
      this.activeState[layerId] = !this.activeState[layerId];
      this.triggerChange();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isLayerVisible',
    value: function isLayerVisible(layerId) {
      return this.visibilityState[layerId];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLayerVisible',
    value: function setLayerVisible(layerId, visible) {
      if (this.visibilityState[layerId] !== visible) {
        this.visibilityState[layerId] = visible;
        var count = layerId.length;
        while (count--) {
          this.visibilityState[layerId[count]] = visible;
        }
        this.triggerChange();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'toggleLayerVisible',
    value: function toggleLayerVisible(layerId) {
      this.setLayerVisible(layerId, !this.visibilityState[layerId]);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'toggleEditMode',
    value: function toggleEditMode(layerId) {
      this.editMode[layerId] = !this.editMode[layerId];
      this.triggerChange();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isLayerInEditMode',
    value: function isLayerInEditMode(layerId) {
      var _this2 = this;

      var found = false;
      Object.keys(this.editMode).forEach(function (key) {
        if (_this2.editMode[key] && key.indexOf(layerId) !== -1) {
          found = true;
        }
      });
      return found;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getColor',
    value: function getColor(layerId) {
      return this.originalData.CompositePipeline.layer_fields[layerId[0]];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getColorToLabel',
    value: function getColorToLabel(colorCode) {
      return this.originalData.CompositePipeline.fields[colorCode];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isActiveColor',
    value: function isActiveColor(layerId, colorCode) {
      return this.activeColors[layerId[0]] === colorCode;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setActiveColor',
    value: function setActiveColor(layerId, colorCode) {
      var count = layerId.length;
      while (count--) {
        this.activeColors[layerId[count]] = colorCode;
      }
      this.triggerChange();
    }

    // ------------------------------------------------------------------------
    // Return the encoding of the pipeline configuration

  }, {
    key: 'getPipelineQuery',
    value: function getPipelineQuery() {
      var _this3 = this;

      var query = '';
      this.originalData.CompositePipeline.layers.forEach(function (item) {
        var color = _this3.isLayerActive(item) && _this3.isLayerVisible(item) ? _this3.activeColors[item] : '_';
        query += item;
        query += color;
      });
      return query;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getPipelineDescription',
    value: function getPipelineDescription() {
      return this.originalData.CompositePipeline.pipeline;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getOpacity',
    value: function getOpacity(layerCode) {
      return this.opacityMap[layerCode];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'hasOpacity',
    value: function hasOpacity() {
      return this.handleOpacity;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setOpacity',
    value: function setOpacity(layerCode, alpha) {
      if (this.opacityMap[layerCode] !== alpha) {
        this.opacityMap[layerCode] = alpha;

        var opacityArray = [];
        for (var i = 0; i < this.nbLayers; ++i) {
          opacityArray.push(this.opacityMap[LAYER_CODE[i]] / 100.0);
        }

        this.emit(OPACITY_CHANGE_TOPIC, opacityArray);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'resetOpacity',
    value: function resetOpacity(alpha) {
      var _this4 = this;

      Object.keys(this.opacityMap).forEach(function (key) {
        _this4.opacityMap[key] = alpha;
      });

      var opacityArray = [];
      for (var i = 0; i < this.nbLayers; ++i) {
        opacityArray.push(this.opacityMap[LAYER_CODE[i]] / 100.0);
      }

      this.emit(OPACITY_CHANGE_TOPIC, opacityArray);
    }
  }]);

  return PipelineState;
}();

// Add Observer pattern using Monologue.js


exports.default = PipelineState;
_monologue2.default.mixInto(PipelineState);