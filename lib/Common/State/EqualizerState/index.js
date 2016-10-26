define(['exports', 'monologue.js'], function (exports, _monologue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _monologue2 = _interopRequireDefault(_monologue);

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

  var CHANGE_TOPIC = 'model.change';

  var EqualizerState = function () {
    function EqualizerState(_ref) {
      var _this = this;

      var _ref$size = _ref.size;
      var size = _ref$size === undefined ? 1 : _ref$size;
      var _ref$colors = _ref.colors;
      var colors = _ref$colors === undefined ? ['#cccccc'] : _ref$colors;
      var _ref$lookupTable = _ref.lookupTable;
      var lookupTable = _ref$lookupTable === undefined ? null : _ref$lookupTable;
      var _ref$scalars = _ref.scalars;
      var scalars = _ref$scalars === undefined ? [] : _ref$scalars;

      _classCallCheck(this, EqualizerState);

      this.size = size;
      this.scalars = scalars;
      this.lookupTable = lookupTable;
      this.colors = colors;

      // Handle colors
      if (lookupTable) {
        (function () {
          var convertColor = function convertColor(color) {
            var R = Math.floor(color[0] * 255);
            var G = Math.floor(color[1] * 255);
            var B = Math.floor(color[2] * 255);
            return 'rgb(' + R + ',' + G + ',' + B + ')';
          };
          var callback = function callback(data, envelope) {
            for (var idx = 0; idx < _this.size; idx++) {
              var color = _this.lookupTable.getColor(_this.scalars[idx]);
              _this.colors[idx] = convertColor(color);
            }
            if (envelope) {
              _this.emit(CHANGE_TOPIC, _this);
            }
          };

          _this.lutChangeSubscription = _this.lookupTable.onChange(callback);
          callback();
        })();
      }

      // Fill opacity
      this.opacities = [];
      while (this.opacities.length < this.size) {
        this.opacities.push(-1);
      }

      // Make the updateOpacities a closure to prevent any this issue
      // when using it as a callback
      this.updateOpacities = function (values) {
        var changeDetected = false;
        for (var i = 0; i < _this.size; i++) {
          changeDetected = changeDetected || _this.opacities[i] !== values[i];
          _this.opacities[i] = values[i];
        }
        if (changeDetected) {
          _this.emit(CHANGE_TOPIC, _this);
        }
      };

      // Make the resetOpacities a closure to prevent any this issue
      // when using it as a callback
      this.resetOpacities = function () {
        var opacityStep = 1.0 / _this.size;
        var opacity = 0.0;
        var changeDetected = false;

        for (var i = 0; i < _this.size; i++) {
          opacity += opacityStep;
          changeDetected = changeDetected || _this.opacities[i] !== opacity;
          _this.opacities[i] = opacity;
        }
        if (changeDetected) {
          _this.emit(CHANGE_TOPIC, _this);
        }
      };
      this.resetOpacities();
    }

    // ------------------------------------------------------------------------

    _createClass(EqualizerState, [{
      key: 'getOpacities',
      value: function getOpacities() {
        return this.opacities;
      }
    }, {
      key: 'getColors',
      value: function getColors() {
        return this.colors;
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

        this.lutChangeSubscription.unsubscribe();
        this.lutChangeSubscription = null;
      }
    }]);

    return EqualizerState;
  }();

  exports.default = EqualizerState;


  // Add Observer pattern using Monologue.js
  _monologue2.default.mixInto(EqualizerState);
});