define(['exports', './Core', './Native'], function (exports, _Core, _Native) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Core2 = _interopRequireDefault(_Core);

  var _Native2 = _interopRequireDefault(_Native);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    Core: _Core2.default,
    Native: _Native2.default
  };
});