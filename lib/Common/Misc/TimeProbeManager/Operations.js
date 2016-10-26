define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = create;

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

  var mean = function () {
    function mean() {
      _classCallCheck(this, mean);
    }

    _createClass(mean, [{
      key: "begin",
      value: function begin() {
        this.count = 0;
        this.sum = 0;
      }
    }, {
      key: "next",
      value: function next(value) {
        if (isFinite(value)) {
          this.sum += value;
          this.count++;
        }
      }
    }, {
      key: "end",
      value: function end() {
        if (this.count === 0) {
          return Number.NaN;
        }
        return this.sum / this.count;
      }
    }]);

    return mean;
  }();

  var opertations = exports.opertations = {
    mean: mean
  };

  function create(operationName) {
    return new opertations[operationName]();
  }
});