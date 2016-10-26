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

  var CHANGE_TOPIC = 'toggle.change';

  var ToggleState = function () {

    // ------------------------------------------------------------------------

    function ToggleState() {
      var _this = this;

      var initialState = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      _classCallCheck(this, ToggleState);

      this.state = initialState;

      // Make a closure so that function can be passed around
      this.toggleState = function () {
        _this.state = !_this.state;
        _this.emit(CHANGE_TOPIC, _this.state);
      };
    }

    // ------------------------------------------------------------------------

    _createClass(ToggleState, [{
      key: 'setState',
      value: function setState(value) {
        if (!!value !== this.state) {
          this.state = !!value;
          this.emit(CHANGE_TOPIC, this.state);
        }
      }
    }, {
      key: 'getState',
      value: function getState() {
        return this.state;
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
      }
    }]);

    return ToggleState;
  }();

  exports.default = ToggleState;


  // Add Observer pattern using Monologue.js
  _monologue2.default.mixInto(ToggleState);
});