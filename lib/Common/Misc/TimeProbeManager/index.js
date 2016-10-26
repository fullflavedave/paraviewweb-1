'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeProbeManager = exports.TimeProbe = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _Operations = require('./Operations');

var _Operations2 = _interopRequireDefault(_Operations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TIME_PROBE_CHANGE = 'TimeProbe.change';
var EDGE_WIDTH_FOR_GRAB = 4;

var TimeProbe = exports.TimeProbe = function () {
  function TimeProbe(name, operation) {
    var extent = arguments.length <= 2 || arguments[2] === undefined ? [0, 2, 0, 2] : arguments[2];

    _classCallCheck(this, TimeProbe);

    this.name = name;
    this.operation = operation;
    this.extent = [].concat(extent);
    this.originalExtent = null;
    this.dragActions = [];
    this.active = true;
  }

  _createClass(TimeProbe, [{
    key: 'updateName',
    value: function updateName(newName) {
      this.name = newName;
      this.emit(TIME_PROBE_CHANGE, this);
    }
  }, {
    key: 'getExtent',
    value: function getExtent() {
      return this.extent;
    }
  }, {
    key: 'updateExtent',
    value: function updateExtent(xMin, xMax, yMin, yMax) {
      var count = 4;
      var oldExtent = [].concat(this.extent);

      this.extent[0] = xMin;
      this.extent[1] = xMax;
      this.extent[2] = yMin;
      this.extent[3] = yMax;

      // Detect changes
      while (count-- && this.extent[count] === oldExtent[count]) {}
      if (count > -1) {
        this.emit(TIME_PROBE_CHANGE, this);
      }
    }
  }, {
    key: 'drag',
    value: function drag(event, x, y, scale) {
      var _this = this;

      if (!this.originalExtent && (x < this.extent[0] - EDGE_WIDTH_FOR_GRAB || x > this.extent[1] + EDGE_WIDTH_FOR_GRAB || y < this.extent[2] - EDGE_WIDTH_FOR_GRAB || y > this.extent[3] + EDGE_WIDTH_FOR_GRAB)) {
        return false;
      }

      if (event.isFirst) {
        this.originalExtent = [].concat(this.extent);
        this.dragActions = [];
        if (x < this.extent[0] + EDGE_WIDTH_FOR_GRAB) {
          this.dragActions.push('left');
        }
        if (x > this.extent[1] - EDGE_WIDTH_FOR_GRAB) {
          this.dragActions.push('right');
        }
        if (y < this.extent[2] + EDGE_WIDTH_FOR_GRAB) {
          this.dragActions.push('top');
        }
        if (y > this.extent[3] - EDGE_WIDTH_FOR_GRAB) {
          this.dragActions.push('bottom');
        }
        if (!this.dragActions.length) {
          this.dragActions.push('drag');
        }
      }

      if (event.isFinal) {
        this.originalExtent = null;
        this.dragActions = [];

        // Sort extent if needed
        if (this.extent[0] > this.extent[1] && this.extent[2] > this.extent[3]) {
          this.extent = [this.extent[1], this.extent[0], this.extent[3], this.extent[2]];
        } else if (this.extent[0] > this.extent[1]) {
          this.extent = [this.extent[1], this.extent[0], this.extent[2], this.extent[3]];
        } else if (this.extent[2] > this.extent[3]) {
          this.extent = [this.extent[0], this.extent[1], this.extent[3], this.extent[2]];
        }

        this.emit(TIME_PROBE_CHANGE, this);
        return true;
      }

      this.dragActions.forEach(function (action) {
        if (action === 'drag') {
          _this.extent[0] = Math.round(_this.originalExtent[0] + event.deltaX * scale);
          _this.extent[1] = Math.round(_this.originalExtent[1] + event.deltaX * scale);
          _this.extent[2] = Math.round(_this.originalExtent[2] + event.deltaY * scale);
          _this.extent[3] = Math.round(_this.originalExtent[3] + event.deltaY * scale);
        } else if (action === 'left') {
          _this.extent[0] = Math.round(_this.originalExtent[0] + event.deltaX * scale);
        } else if (action === 'right') {
          _this.extent[1] = Math.round(_this.originalExtent[1] + event.deltaX * scale);
        } else if (action === 'top') {
          _this.extent[2] = Math.round(_this.originalExtent[2] + event.deltaY * scale);
        } else if (action === 'bottom') {
          _this.extent[3] = Math.round(_this.originalExtent[3] + event.deltaY * scale);
        }
      });

      this.emit(TIME_PROBE_CHANGE, this);
      return true;
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      return this.on(TIME_PROBE_CHANGE, callback);
    }
  }, {
    key: 'processData',
    value: function processData(arrays, size) {
      var _this2 = this;

      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var op = (0, _Operations2.default)(this.operation);
      var width = size[0];
      var height = size[1];
      var name = this.name;
      var data = [];
      var active = this.active;

      arrays.forEach(function (array) {
        op.begin();
        for (var x = _this2.extent[0]; x < _this2.extent[1]; x++) {
          for (var y = _this2.extent[2]; y < _this2.extent[3]; y++) {
            var idx = (height - y - 1) * width + x;
            op.next(array[idx]);
          }
        }
        var value = op.end();
        if (isFinite(value)) {
          min = min < value ? min : value;
          max = max > value ? max : value;
        }
        data.push(value);
      });

      if (min === Number.MAX_VALUE) {
        min = 0;
        max = 1;
      }

      return { name: name, data: data, range: [min, max], active: active };
    }
  }, {
    key: 'setActive',
    value: function setActive(active) {
      this.active = !!active;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      this.name = null;
      this.operation = null;
      this.extent = null;
    }
  }]);

  return TimeProbe;
}();

// ----------------------------------------------------------------------------

var TimeProbeManager = exports.TimeProbeManager = function () {
  function TimeProbeManager() {
    var _this3 = this;

    _classCallCheck(this, TimeProbeManager);

    this.probes = [];
    this.probeSubscriptions = [];
    this.activeProbe = -1;
    this.lastSize = null;

    this._probeChange = function (probe) {
      _this3.emit(TIME_PROBE_CHANGE, { probeManager: _this3, probe: probe });
    };
  }

  _createClass(TimeProbeManager, [{
    key: 'setSize',
    value: function setSize(width, height) {
      if (!this.lastSize) {
        this.lastSize = [width, height];
      }
    }
  }, {
    key: 'getActiveProbe',
    value: function getActiveProbe() {
      return this.probes[this.activeProbe];
    }
  }, {
    key: 'setActiveProbe',
    value: function setActiveProbe(name) {
      var _this4 = this;

      this.probes.forEach(function (probe, index) {
        if (probe.name === name) {
          _this4.activeProbe = index;
          _this4._probeChange(probe);
          return;
        }
      });
    }
  }, {
    key: 'addProbe',
    value: function addProbe(probe) {
      if (probe) {
        this.activeProbe = this.probes.length;
        this.probes.push(probe);
        this.probeSubscriptions.push(probe.onChange(this._probeChange));
        this._probeChange(probe);
      } else {
        var width = this.lastSize ? this.lastSize[0] : 200;
        var height = this.lastSize ? this.lastSize[1] : 200;
        var extent = [width / 4, 3 * width / 4, height / 4, 3 * height / 4];
        this.addProbe(new TimeProbe('Probe ' + (this.probes.length + 1), 'mean', extent));
      }
    }
  }, {
    key: 'removeAllProbes',
    value: function removeAllProbes() {
      this.probes = [];
      while (this.probeSubscriptions.length) {
        this.probeSubscriptions.pop().unsubscribe();
      }
      this._probeChange(null);
    }
  }, {
    key: 'removeProbe',
    value: function removeProbe(name) {
      var _this5 = this;

      var idxToRemove = [];
      this.probes = this.probes.filter(function (i, idx) {
        if (i.name === name) {
          _this5.probeSubscriptions[idx].unsubscribe();
          idxToRemove.push(idx);
          return false;
        }
        return true;
      });

      idxToRemove.forEach(function (idx) {
        return _this5.probeSubscriptions.splice(idx, 1);
      });
      this._probeChange(null);
    }
  }, {
    key: 'getProbe',
    value: function getProbe(name) {
      return this.probes.filter(function (i) {
        return i.name === name;
      })[0];
    }
  }, {
    key: 'getProbes',
    value: function getProbes() {
      return this.probes;
    }
  }, {
    key: 'sortProbesByName',
    value: function sortProbesByName() {
      this.probes.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  }, {
    key: 'getProbeNames',
    value: function getProbeNames() {
      return this.probes.map(function (i) {
        return i.name;
      });
    }
  }, {
    key: 'drag',
    value: function drag(event) {
      var activeArea = event.activeArea;
      var relative = event.relative;

      var x = Math.round((relative.x - activeArea[0]) / activeArea[2] * this.lastSize[0]);
      var y = Math.round((relative.y - activeArea[1]) / activeArea[3] * this.lastSize[1]);
      var scale = this.lastSize[0] / activeArea[2];

      if (event.isFirst) {
        this.dragProbe = null;
      }

      if (this.dragProbe) {
        var eventManaged = this.dragProbe.drag(event, x, y, scale);
        if (event.isFinal) {
          this.dragProbe = null;
        }
        return eventManaged;
      }

      var count = this.probes.length;
      while (count--) {
        var _eventManaged = this.probes[count].drag(event, x, y, scale);
        if (_eventManaged) {
          this.dragProbe = this.probes[count];
          this.activeProbe = count;
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'processTimeData',
    value: function processTimeData(arrays) {
      var _this6 = this;

      var fields = [];
      this.probes.forEach(function (probe) {
        fields.push(probe.processData(arrays, _this6.lastSize));
      });
      return fields;
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      return this.on(TIME_PROBE_CHANGE, callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      while (this.probes.length) {
        this.probes.pop().destroy();
      }
    }
  }]);

  return TimeProbeManager;
}();

_monologue2.default.mixInto(TimeProbe);
_monologue2.default.mixInto(TimeProbeManager);