define(['exports', './AutobahnConnection', './BinaryImageStream', './ParaViewWebClient', './SmartConnect'], function (exports, _AutobahnConnection, _BinaryImageStream, _ParaViewWebClient, _SmartConnect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AutobahnConnection2 = _interopRequireDefault(_AutobahnConnection);

  var _BinaryImageStream2 = _interopRequireDefault(_BinaryImageStream);

  var _ParaViewWebClient2 = _interopRequireDefault(_ParaViewWebClient);

  var _SmartConnect2 = _interopRequireDefault(_SmartConnect);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    AutobahnConnection: _AutobahnConnection2.default,
    BinaryImageStream: _BinaryImageStream2.default,
    ParaViewWebClient: _ParaViewWebClient2.default,
    SmartConnect: _SmartConnect2.default
  };
});