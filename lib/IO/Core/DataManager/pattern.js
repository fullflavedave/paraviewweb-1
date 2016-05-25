'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// The goal of that module is to be able to register a set of String pattern
// and have a simple way to evaluate that pattern from an object.
// Here is an example on how the following module can be used.
//
//     var m = new PatternMap();
//     m.registerPattern('imagesURL', '{time}/{pressure}/{phi}_{theta}.png');
//     m.registerPattern('jsonURL', '{time}/{pressure}/data.json');
//     var time = [1, 2, 3, 4, 5, 6],
//         pressure = [34, 35, 36],
//         phi = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
//         theta = [0, 20, 40, 60, 80];
//
//     timeCount =  time.length;
//     var options = {};
//     while(timeCount--) {
//        options.time = time[timeCount];
//        pressureCount = pressure.length;
//        while(pressureCount--) {
//           options.pressure = pressure[pressureCount];
//           phiCount = phi.length;
//           while(phiCount--) {
//              options.phi = phi[phiCount];
//              thetaCount = theta.length;
//              while(thetaCount--) {
//                 options.theta = theta[thetaCount];
//                 console.log(" => Image: " + m.getValue('imageURL', options));
//              }
//           }
//           console.log(" => JSON: " + m.getValue('jsonURL', options));
//        }
//     }
//     m.unregisterPattern('imageURL');

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

    // Unregister a key

  }, {
    key: 'unregisterPattern',
    value: function unregisterPattern(key) {
      delete this.keyPatternMap[key];
    }

    // Evaluate the pattern base on its registered key and set of key to be replaced

  }, {
    key: 'getValue',
    value: function getValue(key, options) {
      var result = this.keyPatternMap[key],
          keyPattern = ['{', '}'];

      Object.keys(options).forEach(function (opt) {
        result = result.replace(keyPattern.join(opt), options[opt]);
      });

      return result;
    }
  }]);

  return PatternMap;
}();

exports.default = PatternMap;