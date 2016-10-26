'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function buildGaussian(x, h, w, bx, by) {
  return { position: x, height: h, width: w, xbias: bx, ybias: by };
}

function calculateOpacities(gaussians) {
  var count = 256;
  var opacities = [];

  while (count--) {
    opacities[count] = 0.0;
  }

  gaussians.forEach(function (gaussian) {
    var x0;
    var position = gaussian.position;
    var height = gaussian.height;
    var xbias = gaussian.xbias;
    var ybias = gaussian.ybias;

    var width = gaussian.width === 0 ? 0.00001 : gaussian.width;

    for (var i = 0; i < 256; ++i) {
      var x = i / 255.0;

      // clamp non-zero values to pos +/- width
      if (x > position + width || x < position - width) {
        if (opacities[i] < 0.0) {
          opacities[i] = 0.0;
        }
        continue;
      }

      // translate the original x to a new x based on the xbias
      if (xbias === 0 || x === position + xbias) {
        x0 = x;
      } else if (x > position + xbias) {
        if (width === xbias) {
          x0 = position;
        } else {
          x0 = position + (x - position - xbias) * (width / (width - xbias));
        }
      } else {
        // (x < pos+xbias)
        if (-width === xbias) {
          x0 = position;
        } else {
          x0 = position - (x - position - xbias) * (width / (width + xbias));
        }
      }

      // center around 0 and normalize to -1,1
      var x1 = (x0 - position) / width;

      // do a linear interpolation between:
      //    a gaussian and a parabola        if 0<ybias<1
      //    a parabola and a step function   if 1<ybias<2
      var h0 = {
        a: Math.exp(-(4 * x1 * x1)),
        b: 1.0 - x1 * x1,
        c: 1.0
      };

      var h2 = void 0;
      if (ybias < 1) {
        h2 = height * (ybias * h0.b + (1 - ybias) * h0.a);
      } else {
        h2 = height * ((2 - ybias) * h0.b + (ybias - 1) * h0.c);
      }

      // perform the MAX over different gaussians, not the sum
      if (h2 > opacities[i]) {
        opacities[i] = h2;
      }
    }
  });

  return opacities;
}

// ----------------------------------------------------------------------------
// GaussianPieceWiseEditor
// ----------------------------------------------------------------------------

var CHANGE_TOPIC = 'GaussianPieceWiseEditor.change';

var GaussianPieceWiseEditor = function () {
  function GaussianPieceWiseEditor(canvas, style) {
    _classCallCheck(this, GaussianPieceWiseEditor);

    this.resetControlPoints();
    this.setStyle(style);
    this.setContainer(canvas);
  }

  _createClass(GaussianPieceWiseEditor, [{
    key: 'resetControlPoints',
    value: function resetControlPoints() {
      this.controlPoints = [pointBuilder(0, 0), pointBuilder(1, 1)];
      sortPoints(this.controlPoints);
    }
  }, {
    key: 'setStyle',
    value: function setStyle() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$radius = _ref.radius;
      var radius = _ref$radius === undefined ? 6 : _ref$radius;
      var _ref$stroke = _ref.stroke;
      var stroke = _ref$stroke === undefined ? 2 : _ref$stroke;
      var _ref$color = _ref.color;
      var color = _ref$color === undefined ? '#000000' : _ref$color;
      var _ref$fillColor = _ref.fillColor;
      var fillColor = _ref$fillColor === undefined ? '#ccc' : _ref$fillColor;

      this.radius = radius;
      this.stroke = stroke;
      this.color = color;
      this.fillColor = fillColor;
    }
  }, {
    key: 'setContainer',
    value: function setContainer(canvas) {
      if (this.canvas) {
        this.canvas.removeEventListener('click', this.onClick);
        this.canvas.removeEventListener('dblclick', this.onDblClick);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mouseup', this.onMouseMove);
      }

      this.canvas = null;
      this.ctx = null;
      if (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('dblclick', this.onDblClick);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var _getCanvasSize = getCanvasSize(this.ctx, this.radius);

      var width = _getCanvasSize.width;
      var height = _getCanvasSize.height;
      var margin = _getCanvasSize.margin;

      this.ctx.fillStyle = this.fillColor;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillRect(margin, margin, width, height);

      var linearPath = [];
      this.controlPoints.forEach(function (point) {
        linearPath.push(getCanvasCoordinates(_this.ctx, point, _this.radius));
      });

      // Draw path
      this.ctx.beginPath();
      this.ctx.lineWidth = this.stroke;
      linearPath.forEach(function (point, idx) {
        if (idx === 0) {
          _this.ctx.moveTo(point.x, point.y);
        } else {
          _this.ctx.lineTo(point.x, point.y);
        }
      });
      this.ctx.stroke();

      // Draw control points
      linearPath.forEach(function (point) {
        drawControlPoint(_this.ctx, point, _this.radius, _this.color);
      });

      // Notify control points
      this.emit(CHANGE_TOPIC, this.controlPoints);
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      return this.on(CHANGE_TOPIC, callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      this.setContainer(null);
    }
  }]);

  return GaussianPieceWiseEditor;
}();

// Add Observer pattern using Monologue.js


exports.default = GaussianPieceWiseEditor;
_monologue2.default.mixInto(GaussianPieceWiseEditor);