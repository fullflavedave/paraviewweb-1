define(['exports', './Chart', './Image', './Painter'], function (exports, _Chart, _Image, _Painter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Chart2 = _interopRequireDefault(_Chart);

  var _Image2 = _interopRequireDefault(_Image);

  var _Painter2 = _interopRequireDefault(_Painter);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    Chart: _Chart2.default,
    // Geometry,
    Image: _Image2.default,
    Painter: _Painter2.default
  };
});