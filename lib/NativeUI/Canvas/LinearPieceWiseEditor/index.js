'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getCanvasSize = getCanvasSize;

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ----------------------------------------------------------------------------
// Helper / Private functions
// ----------------------------------------------------------------------------

function pointBuilder(x, y) {
  return { x: x, y: y };
}

function clamp(value) {
  var min = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var max = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  return value < min ? min : value > max ? max : value;
}

function sortPoints(pointsArray) {
  pointsArray.sort(function (a, b) {
    return a.x - b.x;
  });
  pointsArray.forEach(function (point, index) {
    point.index = index;
    point.fixedX = index === 0 || index + 1 === pointsArray.length;
  });
  return pointsArray;
}

function getCanvasSize(ctx) {
  var margin = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var _ctx$canvas = ctx.canvas;
  var width = _ctx$canvas.width;
  var height = _ctx$canvas.height;

  width -= 2 * margin;
  height -= 2 * margin;

  return { width: width, height: height, margin: margin };
}

function getCanvasCoordinates(ctx, point, margin) {
  var _getCanvasSize = getCanvasSize(ctx, margin);

  var width = _getCanvasSize.width;
  var height = _getCanvasSize.height;
  var x = point.x;
  var y = point.y;

  x = Math.floor(x * width + margin + 0.5);
  y = Math.floor((1 - y) * height + margin + 0.5);
  return { x: x, y: y };
}

function drawControlPoint(ctx, point, radius, color) {
  var x = point.x;
  var y = point.y;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

function getNormalizePosition(event, ctx, margin) {
  var _getCanvasSize2 = getCanvasSize(ctx, margin);

  var width = _getCanvasSize2.width;
  var height = _getCanvasSize2.height;

  var rect = event.target.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left - margin) / width,
    y: 1 - (event.clientY - rect.top - margin) / height,
    epsilon: {
      x: 2 * margin / width,
      y: 2 * margin / height
    }
  };
}

function findPoint(position, pointList) {
  var pointsFound = pointList.filter(function (point) {
    return point.x + position.epsilon.x > position.x && point.x - position.epsilon.x < position.x && point.y + position.epsilon.y > position.y && point.y - position.epsilon.y < position.y;
  });
  return pointsFound[0];
}

// ----------------------------------------------------------------------------
// LinearPieceWiseEditor
// ----------------------------------------------------------------------------

var CHANGE_TOPIC = 'LinearPieceWiseEditor.change';

var LinearPieceWiseEditor = function () {
  function LinearPieceWiseEditor(canvas, style) {
    var _this = this;

    _classCallCheck(this, LinearPieceWiseEditor);

    this.onMouseDown = function (event) {
      var click = getNormalizePosition(event, _this.ctx, _this.radius);
      var controlPoint = findPoint(click, _this.controlPoints);
      _this.activeControlPoint = controlPoint;
      if (_this.activeControlPoint) {
        _this.activeIndex = controlPoint.index;
        _this.render();
      } else {
        _this.activeIndex = -1;
        _this.render();
      }
      _this.canvas.addEventListener('mousemove', _this.onMouseMove);
    };

    this.onMouseMove = function (event) {
      if (_this.activeControlPoint) {
        var newPosition = getNormalizePosition(event, _this.ctx, _this.radius);
        if (!_this.activeControlPoint.fixedX) {
          _this.activeControlPoint.x = clamp(newPosition.x);
        }
        _this.activeControlPoint.y = clamp(newPosition.y);
        sortPoints(_this.controlPoints);
        _this.activeIndex = _this.activeControlPoint.index;
        _this.render();
      }
    };

    this.onMouseUp = function (event) {
      _this.activeControlPoint = null;
      if (_this.canvas) {
        _this.canvas.removeEventListener('mousemove', _this.onMouseMove);
      }
    };

    this.onMouseLeave = this.onMouseUp;

    this.onClick = function (event) {
      // Remove point
      if (event.metaKey || event.ctrlKey) {
        var click = getNormalizePosition(event, _this.ctx, _this.radius);
        var controlPoint = findPoint(click, _this.controlPoints);
        if (controlPoint && !controlPoint.fixedX) {
          _this.controlPoints.splice(controlPoint.index, 1);
          // fix indexes after deletion
          for (var i = 0; i < _this.controlPoints.length; ++i) {
            _this.controlPoints[i].index = i;
          }
          _this.activeIndex = -1;
        }
        _this.render();
      }
    };

    this.onDblClick = function (event) {
      var point = getNormalizePosition(event, _this.ctx, _this.radius);
      var sanitizedPoint = { x: clamp(point.x), y: clamp(point.y) };
      _this.controlPoints.push(sanitizedPoint);
      sortPoints(_this.controlPoints);
      _this.activeIndex = sanitizedPoint.index;
      _this.render();
    };

    this.resetControlPoints();
    this.setStyle(style);
    this.setContainer(canvas);
    this.activeIndex = -1;
  }

  _createClass(LinearPieceWiseEditor, [{
    key: 'resetControlPoints',
    value: function resetControlPoints() {
      this.controlPoints = [pointBuilder(0, 0), pointBuilder(1, 1)];
      sortPoints(this.controlPoints);
    }

    // Sets the control points to the new list of points.  The input should be a list
    // of objects with members x and y (i.e. { x: 0.0, y: 1.0 }).  The valid range for
    // x and y is [0,1] with 0 being the left/bottom edge of the canvas and 1 being
    // the top/right edge.
    // The second parameter specifies (in the list passed in) which point should be
    // active after setting the control points.  Pass -1 for no point should be active

  }, {
    key: 'setControlPoints',
    value: function setControlPoints(points) {
      var activeIndex = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

      this.controlPoints = points.map(function (pt) {
        return pointBuilder(pt.x, pt.y);
      });
      var activePoint = null;
      if (activeIndex !== -1) {
        activePoint = this.controlPoints[activeIndex];
      }
      sortPoints(this.controlPoints);
      if (activeIndex !== -1) {
        for (var i = 0; i < this.controlPoints.length; ++i) {
          if (activePoint === this.controlPoints[i]) {
            this.activeIndex = i;
          }
        }
      } else {
        this.activeIndex = -1;
      }
      this.render();
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
      var _ref$activePointColor = _ref.activePointColor;
      var activePointColor = _ref$activePointColor === undefined ? '#EE3333' : _ref$activePointColor;
      var _ref$fillColor = _ref.fillColor;
      var fillColor = _ref$fillColor === undefined ? '#ccc' : _ref$fillColor;

      this.radius = radius;
      this.stroke = stroke;
      this.color = color;
      this.activePointColor = activePointColor;
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
    key: 'setActivePoint',
    value: function setActivePoint(index) {
      this.activeIndex = index;
      this.render();
    }
  }, {
    key: 'clearActivePoint',
    value: function clearActivePoint() {
      this.setActivePoint(-1);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _getCanvasSize3 = getCanvasSize(this.ctx, this.radius);

      var width = _getCanvasSize3.width;
      var height = _getCanvasSize3.height;
      var margin = _getCanvasSize3.margin;

      this.ctx.fillStyle = this.fillColor;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillRect(margin, margin, width, height);

      var linearPath = [];
      this.controlPoints.forEach(function (point) {
        linearPath.push(getCanvasCoordinates(_this2.ctx, point, _this2.radius));
      });

      // Draw path
      this.ctx.beginPath();
      this.ctx.lineWidth = this.stroke;
      linearPath.forEach(function (point, idx) {
        if (idx === 0) {
          _this2.ctx.moveTo(point.x, point.y);
        } else {
          _this2.ctx.lineTo(point.x, point.y);
        }
      });
      this.ctx.stroke();

      // Draw control points
      linearPath.forEach(function (point, index) {
        drawControlPoint(_this2.ctx, point, _this2.radius, _this2.activeIndex === index ? _this2.activePointColor : _this2.color);
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

  return LinearPieceWiseEditor;
}();

// Add Observer pattern using Monologue.js


exports.default = LinearPieceWiseEditor;
_monologue2.default.mixInto(LinearPieceWiseEditor);