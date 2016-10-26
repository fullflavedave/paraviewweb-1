'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PAINTER_READY = 'painter-ready';

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function paintField(ctx, location, field, range) {
  var count,
      min = Number.MAX_VALUE,
      max = Number.MIN_VALUE;

  var xOffset = location.x,
      yOffset = location.y,
      width = location.width,
      height = location.height,
      values = field.data,
      size = values.length,
      xValues = new Uint16Array(size);

  // Compute xValues and min/max
  count = size;
  while (count) {
    count -= 1;
    var value = values[count];
    min = Math.min(min, value);
    max = Math.max(max, value);
    xValues[count] = xOffset + Math.floor(width * (count / (size - 1)));
  }

  // Update range if any provided
  if (range) {
    min = range[0];
    max = range[1];
  }

  var scaleY = height / (max - min);

  function getY(idx) {
    var value = values[idx];
    value = value > min ? value < max ? value : max : min;
    return yOffset + height - Math.floor((value - min) * scaleY);
  }

  // Draw line
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = field.color;
  ctx.moveTo(xValues[0], getY(0));
  for (var idx = 1; idx < size; idx++) {
    if (isNaN(values[idx])) {
      if (idx + 1 < size && !isNaN(values[idx + 1])) {
        ctx.moveTo(xValues[idx + 1], getY(idx + 1));
      }
    } else {
      ctx.lineTo(xValues[idx], getY(idx));
    }
  }
  ctx.stroke();
}

// ----------------------------------------------------------------------------

function paintMarker(ctx, location, xRatio, color) {
  if (xRatio < 0 || xRatio > 1) {
    return;
  }

  var y1 = location.y,
      y2 = y1 + location.height,
      x = location.x + Math.floor(xRatio * location.width);

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2);
  ctx.stroke();
}

// ----------------------------------------------------------------------------

function paintText(ctx, location, xOffset, yOffset, text) {
  var color = arguments.length <= 5 || arguments[5] === undefined ? '#000000' : arguments[5];

  ctx.fillStyle = color;
  ctx.font = '20px serif';
  ctx.textBaseline = 'top';
  ctx.fillText(text, location.x + xOffset, location.y + yOffset);
}

// ----------------------------------------------------------------------------

// function interpolate(values, xRatio) {
//     var size = values.length,
//         idx = size * xRatio,
//         a = values[Math.floor(idx)],
//         b = values[Math.ceil(idx)],
//         ratio = idx - Math.floor(idx);
//     return ((b-a)*ratio + a).toFixed(5);
// }

// ----------------------------------------------------------------------------

var LineChartPainter = function () {
  function LineChartPainter(title) {
    var markerColor = arguments.length <= 1 || arguments[1] === undefined ? '#0000FF' : arguments[1];
    var colors = arguments.length <= 2 || arguments[2] === undefined ? ['#e1002a', '#417dc0', '#1d9a57', '#e9bc2f', '#9b3880'] : arguments[2];

    _classCallCheck(this, LineChartPainter);

    this.data = null;
    this.colors = colors;
    this.markerColor = markerColor;
    this.markerLocation = -1;
    this.showMarker = true;
    this.title = title;
    this.fillBackground = null;
    this.controlWidgets = [];
  }

  // ----------------------------------------------------------------------------
  // Expected data structure
  // {
  //      xRange: [ 0 , 100],
  //      fields: [
  //          { name: 'Temperature', data: [y0, y1, ..., yn], range: [0, 1]},
  //          ...
  //      ]
  // }

  _createClass(LineChartPainter, [{
    key: 'updateData',
    value: function updateData(data) {
      var _this = this;

      var colorIdx = 0;

      // Keep data
      this.data = data;

      // Assign color if no color
      data.fields.forEach(function (field) {
        if (!field.color) {
          field.color = _this.colors[colorIdx % _this.colors.length];
          colorIdx += 1;
        }
      });

      this.emit(PAINTER_READY, this);
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'setBackgroundColor',
    value: function setBackgroundColor(color) {
      this.fillBackground = color;
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'setTitle',
    value: function setTitle(title) {
      this.title = title;
      this.emit(PAINTER_READY, this);
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'setMarkerLocation',
    value: function setMarkerLocation(xRatio) {
      this.markerLocation = xRatio;

      this.emit(PAINTER_READY, this);
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'enableMarker',
    value: function enableMarker(show) {
      if (this.showMarker !== show) {
        this.showMarker = show;
        this.emit(PAINTER_READY, this);
      }
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'isReady',
    value: function isReady() {
      return this.data !== null;
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'paint',
    value: function paint(ctx, location) {
      var xValue = '?';

      if (!this.data) {
        return;
      }

      // Empty content
      ctx.clearRect(location.x - 1, location.y - 1, location.width + 2, location.height + 2);

      if (this.fillBackground) {
        ctx.fillStyle = this.fillBackground;
        ctx.fillRect(location.x, location.y, location.width, location.height);
      }

      // Paint each field
      this.data.fields.forEach(function (field) {
        if (field.active === undefined || field.active) {
          paintField(ctx, location, field, field.range);
        }
      });

      // Paint marker if any
      if (this.showMarker) {
        paintMarker(ctx, location, this.markerLocation, this.markerColor);
      }

      // Paint tile if any
      if (this.title) {
        if (this.data.xRange && this.data.xRange.length === 2 && !isNaN(this.markerLocation)) {
          xValue = (this.data.xRange[1] - this.data.xRange[0]) * this.markerLocation + this.data.xRange[0];
          if (xValue.toFixed) {
            xValue = xValue.toFixed(5);
          }
        }
        paintText(ctx, location, 10, 10, this.title.replace(/{x}/g, '' + xValue));
      }
    }

    // ----------------------------------------------------------------------------

  }, {
    key: 'onPainterReady',
    value: function onPainterReady(callback) {
      return this.on(PAINTER_READY, callback);
    }

    // ----------------------------------------------------------------------------
    // Method meant to be used with the WidgetFactory

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      return this.controlWidgets;
    }
  }]);

  return LineChartPainter;
}();

exports.default = LineChartPainter;


_monologue2.default.mixInto(LineChartPainter);