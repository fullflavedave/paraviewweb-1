define(['exports', './Core', './Girder', './WebSocket'], function (exports, _Core, _Girder, _WebSocket) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Core2 = _interopRequireDefault(_Core);

  var _Girder2 = _interopRequireDefault(_Girder);

  var _WebSocket2 = _interopRequireDefault(_WebSocket);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    Core: _Core2.default,
    Girder: _Girder2.default,
    WebSocket: _WebSocket2.default
  };
});