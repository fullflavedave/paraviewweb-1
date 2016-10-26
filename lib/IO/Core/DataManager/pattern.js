define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var PatternMap = function () {
    function PatternMap() {
      _classCallCheck(this, PatternMap);

      this.keyPatternMap = {};
    }

    // Register a pattern to a given key


    _createClass(PatternMap, [{
      key: 'registerPattern',
      value: function registerPattern(key, pattern) {
        this.keyPatternMap[key] = pattern;
      }
    }, {
      key: 'unregisterPattern',
      value: function unregisterPattern(key) {
        delete this.keyPatternMap[key];
      }
    }, {
      key: 'getValue',
      value: function getValue(key, options) {
        var result = this.keyPatternMap[key],
            keyPattern = ['{', '}'];

        Object.keys(options).forEach(function (opt) {
          result = result.replace(new RegExp(keyPattern.join(opt), 'g'), options[opt]);
        });

        return result;
      }
    }]);

    return PatternMap;
  }();

  exports.default = PatternMap;
});