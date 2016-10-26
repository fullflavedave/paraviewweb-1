define(['exports', './Native', './React'], function (exports, _Native, _React) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Native2 = _interopRequireDefault(_Native);

  var _React2 = _interopRequireDefault(_React);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    Native: _Native2.default,
    React: _React2.default
  };
});