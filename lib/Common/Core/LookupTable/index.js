define(['exports', 'monologue.js', './Presets'], function (exports, _monologue, _Presets) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _monologue2 = _interopRequireDefault(_monologue);

  var _Presets2 = _interopRequireDefault(_Presets);

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

  var CHANGE_TOPIC = 'LookupTable.change';

  // Global helper methods ------------------------------------------------------

  function applyRatio(a, b, ratio) {
    return (b - a) * ratio + a;
  }

  function interpolateColor(pointA, pointB, scalar) {
    var ratio = (scalar - pointA[0]) / (pointB[0] - pointA[0]);
    return [applyRatio(pointA[1], pointB[1], ratio), applyRatio(pointA[2], pointB[2], ratio), applyRatio(pointA[3], pointB[3], ratio), 255];
  }

  function extractPoint(controlPoints, idx) {
    return [controlPoints[idx].x, controlPoints[idx].r, controlPoints[idx].g, controlPoints[idx].b];
  }

  function xrgbCompare(a, b) {
    return a.x - b.x;
  }

  // ----------------------------------------------------------------------------

  var LookupTable = function () {
    function LookupTable(name) {
      var discrete = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      _classCallCheck(this, LookupTable);

      this.name = name;
      this.scalarRange = [0, 1];
      this.delta = 1;
      this.controlPoints = null;
      this.colorTableSize = 256;
      this.colorTable = null;
      this.colorNaN = [0, 0, 0, 0];
      this.setPreset('spectralflip');
      this.discrete = discrete;
      this.scale = 1;

      // Auto rebuild
      this.build();
    }

    _createClass(LookupTable, [{
      key: 'getName',
      value: function getName() {
        return this.name;
      }
    }, {
      key: 'getPresets',
      value: function getPresets() {
        return Object.keys(_Presets2.default.lookuptables);
      }
    }, {
      key: 'setPreset',
      value: function setPreset(name) {
        this.colorTable = null;
        this.controlPoints = [];

        var colors = _Presets2.default.lookuptables[name].controlpoints;
        var count = colors.length;

        for (var i = 0; i < count; i++) {
          this.controlPoints.push({
            x: colors[i].x,
            r: colors[i].r,
            g: colors[i].g,
            b: colors[i].b
          });
        }

        // Auto rebuild
        this.build();

        this.emit(CHANGE_TOPIC, { change: 'preset', lut: this });
      }
    }, {
      key: 'updateControlPoints',
      value: function updateControlPoints(controlPoints) {
        this.colorTable = null;
        this.controlPoints = [];

        var count = controlPoints.length;

        for (var i = 0; i < count; i++) {
          this.controlPoints.push({
            x: controlPoints[i].x,
            r: controlPoints[i].r,
            g: controlPoints[i].g,
            b: controlPoints[i].b
          });
        }

        // Auto rebuild
        this.build();

        this.emit(CHANGE_TOPIC, { change: 'controlPoints', lut: this });
      }
    }, {
      key: 'setColorForNaN',
      value: function setColorForNaN() {
        var r = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var g = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var b = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
        var a = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        this.colorNaN = [r, g, b, a];
      }
    }, {
      key: 'getColorForNaN',
      value: function getColorForNaN() {
        return this.colorNaN;
      }
    }, {
      key: 'getScalarRange',
      value: function getScalarRange() {
        return [Number(this.scalarRange[0]), Number(this.scalarRange[1])];
      }
    }, {
      key: 'setScalarRange',
      value: function setScalarRange(min, max) {
        this.scalarRange = [min, max];
        this.delta = max - min;

        this.emit(CHANGE_TOPIC, { change: 'scalarRange', lut: this });
      }
    }, {
      key: 'build',
      value: function build(trigger) {
        var currentControlIdx = 0;

        if (this.colorTable) {
          return;
        }

        this.colorTable = [];
        if (this.discrete) {
          this.colorTableSize = this.controlPoints.length;
          this.scale = 50;
          for (var idx = 0; idx < this.colorTableSize; idx++) {
            var color = this.controlPoints[idx];
            this.colorTable.push([color.r, color.g, color.b, 255]);
          }
        } else {
          this.scale = 1;
          for (var _idx = 0; _idx < this.colorTableSize; _idx++) {
            var value = _idx / (this.colorTableSize - 1);
            var pointA = extractPoint(this.controlPoints, currentControlIdx);
            var pointB = extractPoint(this.controlPoints, currentControlIdx + 1);

            if (value > pointB[0]) {
              currentControlIdx += 1;
              pointA = extractPoint(this.controlPoints, currentControlIdx);
              pointB = extractPoint(this.controlPoints, currentControlIdx + 1);
            }

            this.colorTable.push(interpolateColor(pointA, pointB, value));
          }
        }

        if (trigger) {
          this.emit(CHANGE_TOPIC, { change: 'controlPoints', lut: this });
        }
      }
    }, {
      key: 'setNumberOfColors',
      value: function setNumberOfColors(nbColors) {
        this.colorTableSize = nbColors;
        this.colorTable = null;

        // Auto rebuild
        this.build();

        this.emit(CHANGE_TOPIC, { change: 'numberOfColors', lut: this });
      }
    }, {
      key: 'getNumberOfControlPoints',
      value: function getNumberOfControlPoints() {
        return this.controlPoints ? this.controlPoints.length : 0;
      }
    }, {
      key: 'removeControlPoint',
      value: function removeControlPoint(idx) {
        if (idx > 0 && idx < this.controlPoints.length - 1) {
          this.controlPoints.splice(idx, 1);

          // Auto rebuild and trigger change
          this.colorTable = null;
          this.build(true);

          return true;
        }
        return false;
      }
    }, {
      key: 'getControlPoint',
      value: function getControlPoint(idx) {
        return this.controlPoints[idx];
      }
    }, {
      key: 'updateControlPoint',
      value: function updateControlPoint(idx, xrgb) {
        this.controlPoints[idx] = xrgb;
        var xValue = xrgb.x;

        // Ensure order
        this.controlPoints.sort(xrgbCompare);

        // Auto rebuild and trigger change
        this.colorTable = null;
        this.build(true);

        // Return the modified index of current control point
        for (var i = 0; i < this.controlPoints.length; i++) {
          if (this.controlPoints[i].x === xValue) {
            return i;
          }
        }
        return 0;
      }
    }, {
      key: 'addControlPoint',
      value: function addControlPoint(xrgb) {
        this.controlPoints.push(xrgb);
        var xValue = xrgb.x;

        // Ensure order
        this.controlPoints.sort(xrgbCompare);

        // Auto rebuild and trigger change
        this.colorTable = null;
        this.build(true);

        // Return the modified index of current control point
        for (var i = 0; i < this.controlPoints.length; i++) {
          if (this.controlPoints[i].x === xValue) {
            return i;
          }
        }
        return -1;
      }
    }, {
      key: 'drawToCanvas',
      value: function drawToCanvas(canvas) {
        var colors = this.colorTable;
        var length = this.scale * colors.length;
        var ctx = canvas.getContext('2d');
        var canvasData = ctx.getImageData(0, 0, length, 1);

        for (var i = 0; i < length; i++) {
          var colorIdx = Math.floor(i / this.scale);
          canvasData.data[i * 4 + 0] = Math.floor(255 * colors[colorIdx][0]);
          canvasData.data[i * 4 + 1] = Math.floor(255 * colors[colorIdx][1]);
          canvasData.data[i * 4 + 2] = Math.floor(255 * colors[colorIdx][2]);
          canvasData.data[i * 4 + 3] = 255;
        }
        ctx.putImageData(canvasData, 0, 0);
      }
    }, {
      key: 'getColor',
      value: function getColor(scalar) {
        if (isNaN(scalar)) {
          return this.colorNaN;
        }
        var idxValue = Math.floor(this.colorTableSize * (scalar - this.scalarRange[0]) / this.delta);
        if (idxValue < 0) {
          return this.colorTable[0];
        }
        if (idxValue >= this.colorTableSize) {
          return this.colorTable[this.colorTable.length - 1];
        }
        return this.colorTable[idxValue];
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.off();
      }
    }, {
      key: 'onChange',
      value: function onChange(callback) {
        return this.on(CHANGE_TOPIC, callback);
      }
    }]);

    return LookupTable;
  }();

  exports.default = LookupTable;


  // Add Observer pattern using Monologue.js
  _monologue2.default.mixInto(LookupTable);
});