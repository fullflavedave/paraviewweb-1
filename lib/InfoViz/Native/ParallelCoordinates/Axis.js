'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Axis = function () {
  function Axis(name) {
    var range = arguments.length <= 1 || arguments[1] === undefined ? [0, 1] : arguments[1];

    _classCallCheck(this, Axis);

    this.name = name;
    this.range = [].concat(range);
    this.upsideDown = false;
    this.selections = [];
  }

  _createClass(Axis, [{
    key: 'toggleOrientation',
    value: function toggleOrientation() {
      this.upsideDown = !this.upsideDown;
    }
  }, {
    key: 'isUpsideDown',
    value: function isUpsideDown() {
      return this.upsideDown;
    }
  }, {
    key: 'hasSelection',
    value: function hasSelection() {
      return this.selections.length > 0;
    }
  }, {
    key: 'updateRange',
    value: function updateRange(newRange) {
      if (this.range[0] !== newRange[0] || this.range[1] !== newRange[1] || this.range[1] === this.range[0]) {
        this.range[0] = newRange[0];
        this.range[1] = newRange[1];
        if (this.range[0] === this.range[1]) {
          this.range[1] += 1;
        }
      }
    }
  }, {
    key: 'updateSelection',
    value: function updateSelection(selectionIndex, start, end) {
      var entry = this.selections[selectionIndex].interval = [start, end];

      // Clamp to axis range
      if (start < this.range[0]) {
        entry[0] = this.range[0];
      }

      if (end > this.range[1]) {
        entry[1] = this.range[1];
      }

      // FIXME trigger notification
    }
  }, {
    key: 'addSelection',
    value: function addSelection(start, end) {
      var endpoints = arguments.length <= 2 || arguments[2] === undefined ? '**' : arguments[2];
      var uncertainty = arguments[3];

      var interval = [start < this.range[0] ? this.range[0] : start, end < this.range[1] ? end : this.range[1]];
      this.selections.push({ interval: interval, endpoints: endpoints, uncertainty: uncertainty });
    }
  }, {
    key: 'clearSelection',
    value: function clearSelection() {
      this.selections = [];
    }
  }]);

  return Axis;
}();

exports.default = Axis;