define(['exports', './empty', './partition', './range', './rule'], function (exports, _empty, _partition, _range, _rule) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _empty2 = _interopRequireDefault(_empty);

  var _partition2 = _interopRequireDefault(_partition);

  var _range2 = _interopRequireDefault(_range);

  var _rule2 = _interopRequireDefault(_rule);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    empty: _empty2.default,
    partition: _partition2.default,
    range: _range2.default,
    rule: _rule2.default
  };
});