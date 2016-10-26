define(['exports', './CoreEndpoints', './GirderClientBuilder'], function (exports, _CoreEndpoints, _GirderClientBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _CoreEndpoints2 = _interopRequireDefault(_CoreEndpoints);

  var _GirderClientBuilder2 = _interopRequireDefault(_GirderClientBuilder);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    CoreEndpoints: _CoreEndpoints2.default,
    GirderClientBuilder: _GirderClientBuilder2.default
  };
});