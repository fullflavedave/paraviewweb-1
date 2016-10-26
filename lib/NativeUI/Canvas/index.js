define(['exports', './LinearPieceWiseEditor', './RemoteRenderer'], function (exports, _LinearPieceWiseEditor, _RemoteRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _LinearPieceWiseEditor2 = _interopRequireDefault(_LinearPieceWiseEditor);

  var _RemoteRenderer2 = _interopRequireDefault(_RemoteRenderer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    LinearPieceWiseEditor: _LinearPieceWiseEditor2.default,
    RemoteRenderer: _RemoteRenderer2.default
  };
});