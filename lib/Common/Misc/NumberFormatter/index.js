define(['exports', 'd3'], function (exports, _d) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sciNotationRegExp = undefined;

  var _d2 = _interopRequireDefault(_d);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
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

  var NumberFormatter = function () {
    function NumberFormatter(prec, src) {
      _classCallCheck(this, NumberFormatter);

      this.fixedPrecision = prec;
      if (!this.fixedPrecision || this.fixedPrecision < 1) {
        this.fixedPrecision = 3;
      }
      this.numbers = null;
      if (src) {
        this.set(src);
      }
    }

    _createClass(NumberFormatter, [{
      key: 'set',
      value: function set(src) {
        this.numbers = [].concat(_toConsumableArray(src)).sort(function (a, b) {
          return a - b;
        });
      }
    }, {
      key: 'add',
      value: function add(num) {
        if (!isFinite(num)) {
          return -1;
        }
        if (!this.numbers) {
          this.numbers = [num];
          return 0;
        }
        if (this.numbers.length > 0) {
          var i0 = _d2.default.bisectLeft(this.numbers, num);
          if (this.numbers[i0] === num) {
            return i0;
          }
        }
        var i1 = _d2.default.bisectRight(this.numbers, num);
        this.numbers = this.numbers.slice(0, i1).concat(num).concat(this.numbers.slice(i1, this.numbers.length));
        return i1;
      }
    }, {
      key: 'del',
      value: function del(num) {
        if (!isFinite(num) || !this.numbers) {
          return -1;
        }
        if (this.numbers.length > 0) {
          var i0 = _d2.default.bisectLeft(this.numbers, num);
          if (this.numbers[i0] === num) {
            this.numbers = this.numbers.slice(0, i0).concat(this.numbers.slice(i0 + 1, this.numbers.length));
            return i0;
          }
        }
        return -1;
      }
    }, {
      key: 'eval',
      value: function _eval(num) {
        // I. Handle special numbers:
        if (num === 0.0) {
          return '0';
        } else if (num === Infinity) {
          return '∞';
        } else if (num === -Infinity) {
          return '-∞';
        } else if (isNaN(num)) {
          return 'NaN';
        }
        var szn = Math.log10(Math.abs(num));
        var prec = this.fixedPrecision;
        if (this.numbers) {
          var i0 = _d2.default.bisectLeft(this.numbers, num) - 1;
          var i1 = _d2.default.bisectRight(this.numbers, num);
          if (i0 >= 0 && i0 < this.numbers.length) {
            var dnl = num - this.numbers[i0];
            var ld0 = Math.ceil(szn - Math.log10(dnl)); // Need this much precision to distinguish
            // console.log(' dnl ', dnl, ' ld0 ', ld0, ' i0 ', i0);
            if (ld0 > prec) {
              prec = ld0;
            }
          }
          if (i1 > i0 && i1 < this.numbers.length) {
            var dnr = this.numbers[i1] - num;
            var ld1 = Math.ceil(szn - Math.log10(dnr));
            // console.log(' dnr ', dnr, ' ld1 ', ld1, ' i1 ', i1);
            if (ld1 > prec) {
              prec = ld1;
            }
          }
        }
        if (szn <= 3.0 && szn > -2) {
          return num.toFixed(prec - Math.floor(szn));
        }
        var exponent = -Math.floor(Math.log10(Math.abs(num)) / 3) * 3;
        var scaled = Math.pow(10, exponent) * num;
        // console.log(' sca ', scaled, ' exp ', exponent, ' szn ', szn, ' prec ', prec);
        return scaled.toFixed(prec - Math.ceil(szn + exponent)).concat('e').concat(-exponent.toFixed());
      }
    }, {
      key: 'evaluator',
      value: function evaluator() {
        var self = this;
        return function (o) {
          return self.eval(o);
        };
      }
    }]);

    return NumberFormatter;
  }();

  exports.default = NumberFormatter;


  // provide a convenient regExp string for numbers
  var sciNotationRegExp = exports.sciNotationRegExp = '[-+]?[0-9]*[.]?[0-9]*[eE]?[-+]?[0-9]*';
});