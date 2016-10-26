define(['exports', './MouseHandler', './VtkWebMouseListener'], function (exports, _MouseHandler, _VtkWebMouseListener) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

  var _VtkWebMouseListener2 = _interopRequireDefault(_VtkWebMouseListener);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    MouseHandler: _MouseHandler2.default,
    VtkWebMouseListener: _VtkWebMouseListener2.default
  };
});