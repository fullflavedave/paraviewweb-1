define(['exports', './CompositeClosureHelper', './LookupTable', './LookupTableManager'], function (exports, _CompositeClosureHelper, _LookupTable, _LookupTableManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _LookupTable2 = _interopRequireDefault(_LookupTable);

  var _LookupTableManager2 = _interopRequireDefault(_LookupTableManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    CompositeClosureHelper: _CompositeClosureHelper2.default,
    LookupTable: _LookupTable2.default,
    LookupTableManager: _LookupTableManager2.default
  };
});