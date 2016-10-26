'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global Image */

var PROBE_LINE_READY_TOPIC = 'ProbeImageBuilder.chart.data.ready',
    PROBE_CHANGE_TOPIC = 'ProbeImageBuilder.probe.location.change',
    CROSSHAIR_VISIBILITY_CHANGE_TOPIC = 'ProbeImageBuilder.crosshair.visibility.change',
    RENDER_METHOD_CHANGE_TOPIC = 'ProbeImageBuilder.render.change',
    dataMapping = {
  XY: {
    idx: [0, 1, 2],
    hasChange: function hasChange(probe, x, y, z) {
      return probe[2] !== z;
    },
    updateProbeValue: function updateProbeValue(self, x, y, z) {
      var width = self.metadata.dimensions[0],
          idx = x + y * width,
          array = self.scalars[self.getField()];

      if (array) {
        self.probeValue = array[idx];
      }
    }
  },
  XZ: {
    idx: [0, 2, 1],
    hasChange: function hasChange(probe, x, y, z) {
      return probe[1] !== y;
    },
    updateProbeValue: function updateProbeValue(self, x, y, z) {
      var width = self.metadata.dimensions[0],
          idx = x + z * width,
          array = self.scalars[self.getField()];

      if (array) {
        self.probeValue = array[idx];
      }
    }
  },
  ZY: {
    idx: [2, 1, 0],
    hasChange: function hasChange(probe, x, y, z) {
      return probe[0] !== x;
    },
    updateProbeValue: function updateProbeValue(self, x, y, z) {
      var width = self.metadata.dimensions[2],
          idx = z + y * width,
          array = self.scalars[self.getField()];

      if (array) {
        self.probeValue = array[idx];
      }
    }
  }
};

var DataProberImageBuilder = function (_AbstractImageBuilder) {
  _inherits(DataProberImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function DataProberImageBuilder(queryDataModel, lookupTableManager) {
    _classCallCheck(this, DataProberImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataProberImageBuilder).call(this, {
      queryDataModel: queryDataModel, lookupTableManager: lookupTableManager
    }));

    _this.metadata = queryDataModel.originalData.InSituDataProber || queryDataModel.originalData.DataProber;
    _this.fieldIndex = 0;
    _this.renderMethodMutable = true;
    _this.renderMethod = 'XY';
    _this.lastImageStack = null;
    _this.workImage = new Image();
    _this.triggerProbeLines = false;
    _this.broadcastCrossHair = true;
    _this.scalars = {};
    _this.probeValue = 0;
    _this.probeXYZ = [Math.floor(_this.metadata.dimensions[0] / 2), Math.floor(_this.metadata.dimensions[1] / 2), Math.floor(_this.metadata.dimensions[2] / 2)];
    _this.setField(_this.metadata.fields[_this.fieldIndex]);
    _this.pushMethod = 'pushToFrontAsBuffer';

    // Update LookupTableManager with data range
    _this.lookupTableManager.addFields(_this.metadata.ranges, _this.queryDataModel.originalData.LookupTables);
    _this.registerSubscription(_this.lookupTableManager.onActiveLookupTableChange(function (data, envelope) {
      if (_this.getField() !== data) {
        _this.setField(data);
        _this.update();
      }
    }));

    var maxSize = 0;
    for (var i = 0; i < 3; ++i) {
      var currentSize = _this.metadata.dimensions[i];
      maxSize = maxSize < currentSize ? currentSize : maxSize;
    }
    _this.bgCanvas = new _CanvasOffscreenBuffer2.default(maxSize, maxSize);
    _this.registerObjectToFree(_this.bgCanvas);

    _this.fgCanvas = null;

    // Handle events
    _this.registerSubscription(queryDataModel.onDataChange(function (data, envelope) {
      _this.lastImageStack = data;

      var renderCallback = function renderCallback() {
        _this.render();
      };
      var canRenderNow = true;

      Object.keys(data).forEach(function (key) {
        var img = data[key].image;
        img.addEventListener('load', renderCallback);
        canRenderNow = canRenderNow && img.complete;
      });

      if (canRenderNow) {
        _this.render();
      }
    }));

    _this.registerSubscription(_this.lookupTableManager.onChange(function (data, envelope) {
      _this.update();
    }));

    // Event handler
    var self = _this;
    _this.mouseListener = {
      click: function click(event, envelope) {
        if (!event.activeArea) {
          return false;
        }
        var probe = [self.probeXYZ[0], self.probeXYZ[1], self.probeXYZ[2]],
            axisMap = dataMapping[self.renderMethod].idx,
            dimensions = self.metadata.dimensions,
            activeArea = event.activeArea;

        var xRatio = (event.relative.x - activeArea[0]) / activeArea[2],
            yRatio = (event.relative.y - activeArea[1]) / activeArea[3];

        if (event.modifier) {
          return false;
        }

        // Clamp bounds
        xRatio = xRatio < 0 ? 0 : xRatio > 1 ? 1 : xRatio;
        yRatio = yRatio < 0 ? 0 : yRatio > 1 ? 1 : yRatio;

        var xPos = Math.floor(xRatio * dimensions[axisMap[0]]),
            yPos = Math.floor(yRatio * dimensions[axisMap[1]]);

        probe[axisMap[0]] = xPos;
        probe[axisMap[1]] = yPos;

        self.setProbe(probe[0], probe[1], probe[2]);

        return true;
      },
      drag: function drag(event, envelope) {
        if (!event.activeArea) {
          return false;
        }
        var probe = [self.probeXYZ[0], self.probeXYZ[1], self.probeXYZ[2]],
            axisMap = dataMapping[self.renderMethod].idx,
            dimensions = self.metadata.dimensions,
            activeArea = event.activeArea;

        var xRatio = (event.relative.x - activeArea[0]) / activeArea[2],
            yRatio = (event.relative.y - activeArea[1]) / activeArea[3];

        if (event.modifier) {
          return false;
        }

        // Clamp bounds
        xRatio = xRatio < 0 ? 0 : xRatio > 1 ? 1 : xRatio;
        yRatio = yRatio < 0 ? 0 : yRatio > 1 ? 1 : yRatio;

        var xPos = Math.floor(xRatio * dimensions[axisMap[0]]),
            yPos = Math.floor(yRatio * dimensions[axisMap[1]]);

        probe[axisMap[0]] = xPos;
        probe[axisMap[1]] = yPos;

        self.setProbe(probe[0], probe[1], probe[2]);

        return true;
      },
      zoom: function zoom(event, envelope) {
        var probe = [self.probeXYZ[0], self.probeXYZ[1], self.probeXYZ[2]],
            axisMap = dataMapping[self.renderMethod].idx,
            idx = axisMap[2];

        if (event.modifier) {
          return false;
        }

        probe[idx] += event.deltaY < 0 ? -1 : 1;

        if (probe[idx] < 0) {
          probe[idx] = 0;
          return true;
        }

        if (probe[idx] >= self.metadata.dimensions[idx]) {
          probe[idx] = self.metadata.dimensions[idx] - 1;
          return true;
        }

        self.setProbe(probe[0], probe[1], probe[2]);

        return true;
      }
    };
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(DataProberImageBuilder, [{
    key: 'setProbeLineNotification',
    value: function setProbeLineNotification(trigger) {
      this.triggerProbeLines = trigger;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getYOffset',
    value: function getYOffset(slice) {
      var sliceIdx = slice;
      if (sliceIdx === undefined) {
        sliceIdx = this.probeXYZ[2];
      }
      return this.metadata.sprite_size - sliceIdx % this.metadata.sprite_size - 1;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getImage',
    value: function getImage(slice, callback) {
      var sliceIdx = slice;
      if (sliceIdx === undefined) {
        sliceIdx = this.probeXYZ[2];
      }

      // Use the pre-loaded image
      var max = this.metadata.slices.length - 1;

      var idx = Math.floor(sliceIdx / this.metadata.sprite_size);
      idx = idx < 0 ? 0 : idx > max ? max : idx;

      var data = this.lastImageStack[this.metadata.slices[idx]],
          img = data.image;

      if (img) {
        if (img.complete) {
          callback.call(img);
        } else {
          img.addEventListener('load', callback);
        }
      } else {
        this.workImage.addEventListener('load', callback);
        this.workImage.src = data.url;
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setProbe',
    value: function setProbe(i, j, k) {
      var fn = dataMapping[this.renderMethod].hasChange;
      var idx = dataMapping[this.renderMethod].idx;
      var previousValue = [].concat(this.probeXYZ);
      var x = i;
      var y = j;
      var z = k;

      // Allow i to be [x,y,z]
      if (Array.isArray(i)) {
        z = i[2];
        y = i[1];
        x = i[0];
      }

      if (fn(this.probeXYZ, x, y, z)) {
        this.probeXYZ = [x, y, z];
        this.render();
      } else {
        this.probeXYZ = [x, y, z];
        var dimensions = this.metadata.dimensions,
            spacing = this.metadata.spacing;

        dataMapping[this.renderMethod].updateProbeValue(this, x, y, z);
        this.pushToFront(dimensions[idx[0]], dimensions[idx[1]], spacing[idx[0]], spacing[idx[1]], this.probeXYZ[idx[0]], this.probeXYZ[idx[1]]);
      }

      if (previousValue[0] === x && previousValue[1] === y && previousValue[2] === z) {
        return; // No change detected
      }

      // Let other know
      this.emit(PROBE_CHANGE_TOPIC, [x, y, z]);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getProbe',
    value: function getProbe() {
      return this.probeXYZ;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getFieldValueAtProbeLocation',
    value: function getFieldValueAtProbeLocation() {
      return this.probeValue;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getProbeLine',
    value: function getProbeLine(axisIdx) {
      var fieldData = {
        name: this.getField(),
        data: []
      },
          probeData = {
        xRange: [0, 100],
        fields: [fieldData]
      },
          axisToProbe = -1,
          axisMapping = dataMapping[this.renderMethod].idx;

      for (var i = 0; i < 2; i++) {
        if (axisIdx === axisMapping[i]) {
          axisToProbe = i;
        }
      }

      if (axisToProbe !== -1) {
        var scalarPlan = this.scalars[fieldData.name],
            dimensions = this.metadata.dimensions,
            width = dimensions[axisMapping[0]],
            height = dimensions[axisMapping[1]],
            deltaStep = axisToProbe === 0 ? 1 : width,
            offset = axisToProbe === 0 ? this.probeXYZ[axisMapping[1]] * width : this.probeXYZ[axisMapping[0]],
            size = axisToProbe === 0 ? width : height;

        if (this.metadata.origin && this.metadata.spacing) {
          probeData.xRange[0] = this.metadata.origin[axisIdx];
          probeData.xRange[1] = this.metadata.origin[axisIdx] + this.metadata.spacing[axisIdx] * dimensions[axisIdx];
        }

        if (scalarPlan) {
          for (var j = 0; j < size; j++) {
            fieldData.data.push(scalarPlan[offset + j * deltaStep]);
          }
        }
      }

      return probeData;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      if (!this.lastImageStack) {
        return;
      }

      this['render' + this.renderMethod]();

      // Update probe value
      dataMapping[this.renderMethod].updateProbeValue(this, this.probeXYZ[0], this.probeXYZ[1], this.probeXYZ[2]);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'pushToFront',
    value: function pushToFront(width, height, scaleX, scaleY, lineX, lineY) {
      this[this.pushMethod](width, height, scaleX, scaleY, lineX, lineY);

      if (this.triggerProbeLines) {
        this.emit(PROBE_LINE_READY_TOPIC, {
          x: this.getProbeLine(0),
          y: this.getProbeLine(1),
          z: this.getProbeLine(2)
        });
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'pushToFrontAsImage',
    value: function pushToFrontAsImage(width, height, scaleX, scaleY, lineX, lineY) {
      var destWidth = Math.floor(width * scaleX),
          destHeight = Math.floor(height * scaleY),
          ctx = null;

      // Make sure we have a foreground buffer
      if (this.fgCanvas) {
        this.fgCanvas.size(destWidth, destHeight);
      } else {
        this.fgCanvas = new _CanvasOffscreenBuffer2.default(destWidth, destHeight);
      }

      ctx = this.fgCanvas.get2DContext();
      ctx.drawImage(this.bgCanvas.el, 0, 0, width, height, 0, 0, destWidth, destHeight);

      // Draw cross hair probe position
      ctx.beginPath();
      ctx.moveTo(lineX * scaleX, 0);
      ctx.lineTo(lineX * scaleX, destHeight);
      ctx.moveTo(0, lineY * scaleY);
      ctx.lineTo(destWidth, lineY * scaleY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      var readyImage = {
        url: this.fgCanvas.toDataURL(),
        type: this.renderMethod,
        builder: this
      };

      // Let everyone know the image is ready
      this.imageReady(readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'pushToFrontAsBuffer',
    value: function pushToFrontAsBuffer(width, height, scaleX, scaleY, lineX, lineY) {
      var destWidth = Math.floor(width * scaleX),
          destHeight = Math.floor(height * scaleY);

      var readyImage = {
        canvas: this.bgCanvas.el,
        imageData: this.bgCanvas.el.getContext('2d').getImageData(0, 0, width, height),
        area: [0, 0, width, height],
        outputSize: [destWidth, destHeight],
        type: this.renderMethod,
        builder: this
      };

      if (this.broadcastCrossHair) {
        readyImage.crosshair = [lineX, lineY];
      }

      // Let everyone know the image is ready
      this.imageReady(readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'renderXY',
    value: function renderXY() {
      var self = this,
          ctx = this.bgCanvas.get2DContext(),
          offset = this.getYOffset(),
          xyz = this.probeXYZ,
          dimensions = this.metadata.dimensions,
          spacing = this.metadata.spacing;

      function drawThisImage() {
        var image = this;
        ctx.drawImage(image, 0, dimensions[1] * offset, dimensions[0], dimensions[1], 0, 0, dimensions[0], dimensions[1]);

        self.extractNumericalValues(dimensions[0], dimensions[1]);
        self.applyLookupTable(dimensions[0], dimensions[1]);
        self.pushToFront(dimensions[0], dimensions[1], spacing[0], spacing[1], xyz[0], xyz[1]);
      }

      this.getImage(this.probeXYZ[2], drawThisImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'renderZY',
    value: function renderZY() {
      var self = this,
          ctx = this.bgCanvas.get2DContext(),
          xyz = this.probeXYZ,
          dimensions = this.metadata.dimensions,
          activeColumn = dimensions[2],
          spacing = this.metadata.spacing;

      function processLine() {
        var offset = self.getYOffset(activeColumn),
            image = this;

        ctx.drawImage(image, xyz[0], dimensions[1] * offset, 1, dimensions[1], activeColumn, 0, 1, dimensions[1]);

        if (activeColumn) {
          activeColumn -= 1;
          self.getImage(activeColumn, processLine);
        } else {
          // Rendering is done
          self.extractNumericalValues(dimensions[2], dimensions[1]);
          self.applyLookupTable(dimensions[2], dimensions[1]);
          self.pushToFront(dimensions[2], dimensions[1], spacing[2], spacing[1], xyz[2], xyz[1]);
        }
      }

      if (activeColumn) {
        activeColumn -= 1;
        self.getImage(activeColumn, processLine);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'renderXZ',
    value: function renderXZ() {
      var self = this,
          ctx = this.bgCanvas.get2DContext(),
          xyz = this.probeXYZ,
          dimensions = this.metadata.dimensions,
          spacing = this.metadata.spacing,
          activeLine = dimensions[2];

      function processLine() {
        var offset = self.getYOffset(activeLine),
            image = this;

        ctx.drawImage(image, 0, dimensions[1] * offset + xyz[1], dimensions[0], 1, 0, activeLine, dimensions[0], 1);

        if (activeLine) {
          activeLine -= 1;
          self.getImage(activeLine, processLine);
        } else {
          // Rendering is done
          self.extractNumericalValues(dimensions[0], dimensions[2]);
          self.applyLookupTable(dimensions[0], dimensions[2]);
          self.pushToFront(dimensions[0], dimensions[2], spacing[0], spacing[2], xyz[0], xyz[2]);
        }
      }

      if (activeLine) {
        activeLine -= 1;
        self.getImage(activeLine, processLine);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isCrossHairEnabled',
    value: function isCrossHairEnabled() {
      return this.broadcastCrossHair;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setCrossHairEnable',
    value: function setCrossHairEnable(useCrossHair) {
      if (this.broadcastCrossHair !== useCrossHair) {
        this.broadcastCrossHair = useCrossHair;
        this.emit(CROSSHAIR_VISIBILITY_CHANGE_TOPIC, useCrossHair);
        this.setProbe(this.probeXYZ[0], this.probeXYZ[1], this.probeXYZ[2]);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'extractNumericalValues',
    value: function extractNumericalValues(width, height) {
      var ctx = this.bgCanvas.get2DContext(),
          fieldName = this.getField(),
          pixels = ctx.getImageData(0, 0, width, height),
          pixBuffer = pixels.data,
          size = pixBuffer.length,
          idx = 0,
          fieldRange = this.metadata.ranges[fieldName],
          delta = fieldRange[1] - fieldRange[0],
          arrayIdx = 0,
          array = new Float32Array(width * height);

      while (idx < size) {
        var value = (pixBuffer[idx] + 256 * pixBuffer[idx + 1] + 65536 * pixBuffer[idx + 2]) / 16777216 * delta + fieldRange[0];
        array[arrayIdx] = value;
        arrayIdx += 1;

        // Move to next pixel
        idx += 4;
      }
      this.scalars[fieldName] = array;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'applyLookupTable',
    value: function applyLookupTable(width, height) {
      var ctx = this.bgCanvas.get2DContext(),
          fieldName = this.getField(),
          lut = this.lookupTableManager.getLookupTable(fieldName),
          pixels = ctx.getImageData(0, 0, width, height),
          pixBuffer = pixels.data,
          size = pixBuffer.length,
          idx = 0,
          arrayIdx = 0,
          array = this.scalars[fieldName];

      if (lut) {
        while (idx < size) {
          var color = lut.getColor(array[arrayIdx]);
          arrayIdx += 1;

          pixBuffer[idx] = Math.floor(255 * color[0]);
          pixBuffer[idx + 1] = Math.floor(255 * color[1]);
          pixBuffer[idx + 2] = Math.floor(255 * color[2]);

          // Move to next pixel
          idx += 4;
        }
        ctx.putImageData(pixels, 0, 0);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setField',
    value: function setField(fieldName) {
      this.queryDataModel.setValue('field', fieldName);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getField',
    value: function getField() {
      return this.queryDataModel.getValue('field');
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getFields',
    value: function getFields() {
      return this.metadata.fields;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setRenderMethod',
    value: function setRenderMethod(renderMethod) {
      if (this.renderMethodMutable && this.renderMethod !== renderMethod) {
        this.renderMethod = renderMethod;
        this.render();
        this.emit(RENDER_METHOD_CHANGE_TOPIC, renderMethod);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getRenderMethod',
    value: function getRenderMethod() {
      return this.renderMethod;
    }

    // ------------------------------------------------------------------------

    /* eslint-disable class-methods-use-this */

  }, {
    key: 'getRenderMethods',
    value: function getRenderMethods() {
      return ['XY', 'ZY', 'XZ'];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'isRenderMethodMutable',
    value: function isRenderMethodMutable() {
      return this.renderMethodMutable;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setRenderMethodImutable',
    value: function setRenderMethodImutable() {
      this.renderMethodMutable = false;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setRenderMethodMutable',
    value: function setRenderMethodMutable() {
      this.renderMethodMutable = true;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getListeners',
    value: function getListeners() {
      return this.mouseListener;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onProbeLineReady',
    value: function onProbeLineReady(callback) {
      return this.on(PROBE_LINE_READY_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onProbeChange',
    value: function onProbeChange(callback) {
      return this.on(PROBE_CHANGE_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onRenderMethodChange',
    value: function onRenderMethodChange(callback) {
      return this.on(RENDER_METHOD_CHANGE_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'onCrosshairVisibilityChange',
    value: function onCrosshairVisibilityChange(callback) {
      return this.on(CROSSHAIR_VISIBILITY_CHANGE_TOPIC, callback);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(DataProberImageBuilder.prototype), 'destroy', this).call(this);

      this.off();

      this.bgCanvas = null;
      this.workImage = null;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      var _getControlModels = this.getControlModels();

      var lookupTable = _getControlModels.lookupTable;
      var originalRange = _getControlModels.originalRange;
      var lookupTableManager = _getControlModels.lookupTableManager;
      var queryDataModel = _getControlModels.queryDataModel;
      var model = this;
      return [{
        name: 'LookupTableManagerWidget',
        lookupTable: lookupTable,
        originalRange: originalRange,
        lookupTableManager: lookupTableManager
      }, {
        name: 'ProbeControl',
        model: model
      }, {
        name: 'QueryDataModelWidget',
        queryDataModel: queryDataModel
      }];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlModels',
    value: function getControlModels() {
      return {
        queryDataModel: this.queryDataModel,
        lookupTable: this.lookupTableManager.getLookupTable(this.getField()),
        originalRange: this.metadata.ranges[this.getField()],
        lookupTableManager: this.lookupTableManager
      };
    }
  }]);

  return DataProberImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = DataProberImageBuilder;