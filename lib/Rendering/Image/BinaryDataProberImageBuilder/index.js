define(['exports', '../AbstractImageBuilder', '../../../Common/Misc/CanvasOffscreenBuffer'], function (exports, _AbstractImageBuilder2, _CanvasOffscreenBuffer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

  var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var PROBE_LINE_READY_TOPIC = 'ProbeImageBuilder.chart.data.ready',
      PROBE_CHANGE_TOPIC = 'ProbeImageBuilder.probe.location.change',
      CROSSHAIR_VISIBILITY_CHANGE_TOPIC = 'ProbeImageBuilder.crosshair.visibility.change',
      RENDER_METHOD_CHANGE_TOPIC = 'ProbeImageBuilder.render.change',
      dataMapping = {
    XY: {
      idx: [0, 1, 2],
      hasChange: function hasChange(probe, x, y, z) {
        return probe[2] !== z;
      }
    },
    XZ: {
      idx: [0, 2, 1],
      hasChange: function hasChange(probe, x, y, z) {
        return probe[1] !== y;
      }
    },
    ZY: {
      idx: [2, 1, 0],
      hasChange: function hasChange(probe, x, y, z) {
        return probe[0] !== x;
      }
    }
  };

  var BinaryDataProberImageBuilder = function (_AbstractImageBuilder) {
    _inherits(BinaryDataProberImageBuilder, _AbstractImageBuilder);

    function BinaryDataProberImageBuilder(queryDataModel, lookupTableManager) {
      _classCallCheck(this, BinaryDataProberImageBuilder);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BinaryDataProberImageBuilder).call(this, {
        queryDataModel: queryDataModel, lookupTableManager: lookupTableManager
      }));

      _this.metadata = queryDataModel.originalData.DataProber;
      _this.renderMethodMutable = true;
      _this.renderMethod = 'XY';
      _this.triggerProbeLines = false;
      _this.broadcastCrossHair = true;
      _this.probeValue = 0;
      _this.probeXYZ = [Math.floor(_this.metadata.dimensions[0] / 2), Math.floor(_this.metadata.dimensions[1] / 2), Math.floor(_this.metadata.dimensions[2] / 2)];
      _this.fields = Object.keys(_this.metadata.types);
      _this.field = _this.fields[0];
      _this.dataFields = null;
      _this.pushMethod = 'pushToFrontAsBuffer';

      // Update LookupTableManager with data range
      _this.lookupTableManager.updateActiveLookupTable(_this.field);
      _this.lookupTableManager.addFields(_this.metadata.ranges, _this.queryDataModel.originalData.LookupTables);

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
        _this.dataFields = {};
        Object.keys(data).forEach(function (field) {
          _this.dataFields[field] = new window[_this.metadata.types[field]](data[field].data);
        });
        _this.render();
      }));

      _this.registerSubscription(_this.lookupTableManager.onActiveLookupTableChange(function (data, envelope) {
        if (_this.field !== data) {
          _this.field = data;
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

          if (self.renderMethod === 'XZ') {
            // We flipped Y
            yRatio = 1 - yRatio;
          }

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

          if (self.renderMethod === 'XZ') {
            // We flipped Y
            yRatio = 1 - yRatio;
          }

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

    _createClass(BinaryDataProberImageBuilder, [{
      key: 'setPushMethodAsBuffer',
      value: function setPushMethodAsBuffer() {
        this.pushMethod = 'pushToFrontAsBuffer';
      }
    }, {
      key: 'setPushMethodAsImage',
      value: function setPushMethodAsImage() {
        this.pushMethod = 'pushToFrontAsImage';
      }
    }, {
      key: 'setProbeLineNotification',
      value: function setProbeLineNotification(trigger) {
        this.triggerProbeLines = trigger;
      }
    }, {
      key: 'updateProbeValue',
      value: function updateProbeValue() {
        var x = this.probeXYZ[0],
            y = this.probeXYZ[1],
            z = this.probeXYZ[2],
            xSize = this.metadata.dimensions[0],
            ySize = this.metadata.dimensions[1],
            array = this.dataFields[this.field];

        if (array) {
          this.probeValue = array[x + (ySize - y - 1) * xSize + z * xSize * ySize];
        }
      }
    }, {
      key: 'setProbe',
      value: function setProbe(i, j, k) {
        var fn = dataMapping[this.renderMethod].hasChange;
        var idx = dataMapping[this.renderMethod].idx;
        var previousValue = [].concat(this.probeXYZ);
        var x = i;
        var y = j;
        var z = k;

        // Allow i to be [i,j,k]
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

          this.updateProbeValue();

          if (this.renderMethod === 'XZ') {
            // Need to flip Y axis
            this.pushToFront(dimensions[idx[0]], dimensions[idx[1]], spacing[idx[0]], spacing[idx[1]], this.probeXYZ[idx[0]], dimensions[idx[1]] - this.probeXYZ[idx[1]] - 1);
          } else {
            this.pushToFront(dimensions[idx[0]], dimensions[idx[1]], spacing[idx[0]], spacing[idx[1]], this.probeXYZ[idx[0]], this.probeXYZ[idx[1]]);
          }
        }

        if (previousValue[0] === x && previousValue[1] === y && previousValue[2] === z) {
          return; // No change detected
        }

        // Let other know
        this.emit(PROBE_CHANGE_TOPIC, [x, y, z]);
      }
    }, {
      key: 'getProbe',
      value: function getProbe() {
        return this.probeXYZ;
      }
    }, {
      key: 'getFieldValueAtProbeLocation',
      value: function getFieldValueAtProbeLocation() {
        return this.probeValue;
      }
    }, {
      key: 'getProbeLine',
      value: function getProbeLine(axisIdx) {
        var _this2 = this;

        var probeData = {
          xRange: [0, 100],
          fields: []
        },
            fields = this.fields,
            px = this.probeXYZ[0],
            py = this.probeXYZ[1],
            pz = this.probeXYZ[2],
            xSize = this.metadata.dimensions[0],
            ySize = this.metadata.dimensions[1],
            zSize = this.metadata.dimensions[2],
            idxValues = [];

        if (axisIdx === 0) {
          var offset = (ySize - py - 1) * xSize + pz * xSize * ySize;
          for (var x = 0; x < xSize; x++) {
            idxValues.push(offset + x);
          }
        }
        if (axisIdx === 1) {
          var _offset = px + pz * xSize * ySize;
          for (var y = 0; y < ySize; y++) {
            idxValues.push(_offset + (ySize - y - 1) * xSize);
          }
          idxValues.reverse();
        }
        if (axisIdx === 2) {
          var _offset2 = px + (ySize - py - 1) * xSize,
              step = xSize * ySize;
          for (var z = 0; z < zSize; z++) {
            idxValues.push(_offset2 + z * step);
          }
        }

        // Fill all fields
        var dataSize = idxValues.length;
        fields.forEach(function (name) {
          var array = _this2.dataFields[name],
              data = [],
              range = _this2.lookupTableManager.getLookupTable(name).getScalarRange();

          for (var i = 0; i < dataSize; i++) {
            data.push(array[idxValues[i]]);
          }

          probeData.fields.push({
            name: name, data: data, range: range
          });
        });

        return probeData;
      }
    }, {
      key: 'render',
      value: function render() {
        if (!this.dataFields) {
          return;
        }

        this.updateProbeValue();
        this['render' + this.renderMethod]();
      }
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
          this.registerObjectToFree(this.fgCanvas);
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
    }, {
      key: 'renderXY',
      value: function renderXY() {
        var ctx = this.bgCanvas.get2DContext(),
            xyz = this.probeXYZ,
            dimensions = this.metadata.dimensions,
            xSize = dimensions[0],
            ySize = dimensions[1],
            spacing = this.metadata.spacing,
            imageBuffer = ctx.createImageData(dimensions[0], dimensions[1]),
            pixels = imageBuffer.data,
            imageSize = dimensions[0] * dimensions[1],
            offset = imageSize * xyz[2],
            lut = this.lookupTableManager.getLookupTable(this.field),
            array = this.dataFields[this.field];

        // Need to flip along Y
        var idx = 0;
        for (var y = 0; y < ySize; y++) {
          for (var x = 0; x < xSize; x++) {
            var color = lut.getColor(array[offset + x + xSize * (ySize - y - 1)]);
            pixels[idx * 4] = 255 * color[0];
            pixels[idx * 4 + 1] = 255 * color[1];
            pixels[idx * 4 + 2] = 255 * color[2];
            pixels[idx * 4 + 3] = 255;
            idx += 1;
          }
        }

        ctx.putImageData(imageBuffer, 0, 0);
        this.pushToFront(dimensions[0], dimensions[1], spacing[0], spacing[1], xyz[0], xyz[1]);
      }
    }, {
      key: 'renderZY',
      value: function renderZY() {
        var ctx = this.bgCanvas.get2DContext(),
            xyz = this.probeXYZ,
            dimensions = this.metadata.dimensions,
            offsetX = xyz[0],
            stepY = dimensions[0],
            stepZ = dimensions[0] * dimensions[1],
            ySize = dimensions[1],
            zSize = dimensions[2],
            spacing = this.metadata.spacing,
            imageBuffer = ctx.createImageData(dimensions[2], dimensions[1]),
            pixels = imageBuffer.data,
            lut = this.lookupTableManager.getLookupTable(this.field),
            array = this.dataFields[this.field];

        // FIXME data is flipped
        var idx = 0;
        for (var y = 0; y < ySize; y++) {
          for (var z = 0; z < zSize; z++) {
            var color = lut.getColor(array[offsetX + stepY * (ySize - y - 1) + stepZ * z]);
            pixels[idx * 4] = 255 * color[0];
            pixels[idx * 4 + 1] = 255 * color[1];
            pixels[idx * 4 + 2] = 255 * color[2];
            pixels[idx * 4 + 3] = 255;
            idx += 1;
          }
        }
        ctx.putImageData(imageBuffer, 0, 0);
        this.pushToFront(dimensions[2], dimensions[1], spacing[2], spacing[1], xyz[2], xyz[1]);
      }
    }, {
      key: 'renderXZ',
      value: function renderXZ() {
        var ctx = this.bgCanvas.get2DContext(),
            xyz = this.probeXYZ,
            dimensions = this.metadata.dimensions,
            xSize = dimensions[0],
            zSize = dimensions[2],
            zStep = xSize * dimensions[1],
            offset = xSize * (dimensions[1] - xyz[1] - 1),
            spacing = this.metadata.spacing,
            imageBuffer = ctx.createImageData(xSize, zSize),
            pixels = imageBuffer.data,
            lut = this.lookupTableManager.getLookupTable(this.field),
            array = this.dataFields[this.field];

        var idx = 0;
        for (var z = 0; z < zSize; z++) {
          for (var x = 0; x < xSize; x++) {
            var color = lut.getColor(array[offset + x + (zSize - z - 1) * zStep]);
            pixels[idx * 4] = 255 * color[0];
            pixels[idx * 4 + 1] = 255 * color[1];
            pixels[idx * 4 + 2] = 255 * color[2];
            pixels[idx * 4 + 3] = 255;
            idx += 1;
          }
        }

        ctx.putImageData(imageBuffer, 0, 0);
        this.pushToFront(dimensions[0], dimensions[2], spacing[0], spacing[2], xyz[0], zSize - xyz[2] - 1);
      }
    }, {
      key: 'isCrossHairEnabled',
      value: function isCrossHairEnabled() {
        return this.broadcastCrossHair;
      }
    }, {
      key: 'setCrossHairEnable',
      value: function setCrossHairEnable(useCrossHair) {
        if (this.broadcastCrossHair !== useCrossHair) {
          this.broadcastCrossHair = useCrossHair;
          this.emit(CROSSHAIR_VISIBILITY_CHANGE_TOPIC, useCrossHair);
          this.setProbe(this.probeXYZ[0], this.probeXYZ[1], this.probeXYZ[2]);
        }
      }
    }, {
      key: 'setField',
      value: function setField(value) {
        this.field = value;
      }
    }, {
      key: 'getField',
      value: function getField() {
        return this.field;
      }
    }, {
      key: 'getFields',
      value: function getFields() {
        return this.fields;
      }
    }, {
      key: 'setRenderMethod',
      value: function setRenderMethod(renderMethod) {
        if (this.renderMethodMutable && this.renderMethod !== renderMethod) {
          this.renderMethod = renderMethod;
          this.render();
          this.emit(RENDER_METHOD_CHANGE_TOPIC, renderMethod);
        }
      }
    }, {
      key: 'getRenderMethod',
      value: function getRenderMethod() {
        return this.renderMethod;
      }
    }, {
      key: 'getRenderMethods',
      value: function getRenderMethods() {
        return ['XY', 'ZY', 'XZ'];
      }
    }, {
      key: 'isRenderMethodMutable',
      value: function isRenderMethodMutable() {
        return this.renderMethodMutable;
      }
    }, {
      key: 'setRenderMethodImutable',
      value: function setRenderMethodImutable() {
        this.renderMethodMutable = false;
      }
    }, {
      key: 'setRenderMethodMutable',
      value: function setRenderMethodMutable() {
        this.renderMethodMutable = true;
      }
    }, {
      key: 'getListeners',
      value: function getListeners() {
        return this.mouseListener;
      }
    }, {
      key: 'onProbeLineReady',
      value: function onProbeLineReady(callback) {
        return this.on(PROBE_LINE_READY_TOPIC, callback);
      }
    }, {
      key: 'onProbeChange',
      value: function onProbeChange(callback) {
        return this.on(PROBE_CHANGE_TOPIC, callback);
      }
    }, {
      key: 'onRenderMethodChange',
      value: function onRenderMethodChange(callback) {
        return this.on(RENDER_METHOD_CHANGE_TOPIC, callback);
      }
    }, {
      key: 'onCrosshairVisibilityChange',
      value: function onCrosshairVisibilityChange(callback) {
        return this.on(CROSSHAIR_VISIBILITY_CHANGE_TOPIC, callback);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        _get(Object.getPrototypeOf(BinaryDataProberImageBuilder.prototype), 'destroy', this).call(this);

        this.off();
        this.bgCanvas = null;
        this.fgCanvas = null;
      }
    }, {
      key: 'getControlWidgets',
      value: function getControlWidgets() {
        var model = this;

        var _getControlModels = this.getControlModels();

        var lookupTableManager = _getControlModels.lookupTableManager;
        var queryDataModel = _getControlModels.queryDataModel;

        return [{
          name: 'LookupTableManagerWidget',
          lookupTableManager: lookupTableManager
        }, {
          name: 'ProbeControl',
          model: model
        }, {
          name: 'QueryDataModelWidget',
          queryDataModel: queryDataModel
        }];
      }
    }]);

    return BinaryDataProberImageBuilder;
  }(_AbstractImageBuilder3.default);

  exports.default = BinaryDataProberImageBuilder;
});