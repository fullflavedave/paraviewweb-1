define(['exports', './Canvas', './Renderers'], function (exports, _Canvas, _Renderers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Canvas2 = _interopRequireDefault(_Canvas);

  var _Renderers2 = _interopRequireDefault(_Renderers);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    Canvas: _Canvas2.default,
    Renderers: _Renderers2.default
  };
});