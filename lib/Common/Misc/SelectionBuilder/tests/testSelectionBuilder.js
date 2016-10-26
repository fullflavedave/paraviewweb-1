define(['tape-catch', '..'], function (_tapeCatch, _) {
  'use strict';

  var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

  var _2 = _interopRequireDefault(_);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var expected = {
    emptySelection: { "type": "empty", "generation": 2 },
    rangeSelection: { "type": "range", "generation": 3, "range": { "variables": { "pressure": [{ "interval": [0, 101.3], "endpoints": "oo", "uncertainty": 15 }, { "interval": [200, 400], "endpoints": "*o", "uncertainty": 30 }], "temperature": [{ "interval": [233, 1.7976931348623157e+308], "endpoints": "oo", "uncertainty": 15 }] } } },
    partitionSelection: { "type": "partition", "generation": 4, "partition": { "variable": "pressure", "dividers": [{ "value": 101.3, "uncertainty": 20, "closeToLeft": false }, { "value": 200, "uncertainty": 40, "closeToLeft": true }] } },
    ruleEmptySelection: { "type": "empty", "generation": 2 },
    ruleRangeSelection: { "type": "rule", "generation": 5, "rule": { "type": "logical", "terms": ["and", { "type": "logical", "terms": ["or", { "type": "5C", "terms": [0, "<", "pressure", "<", 101.3] }, { "type": "5C", "terms": [200, "<=", "pressure", "<", 400] }] }, { "type": "5C", "terms": [233, "<", "temperature", "<", 1.7976931348623157e+308] }], "roles": [] } },
    rulePartitionSelection: { "type": "rule", "generation": 6, "rule": { "type": "multi", "terms": [{ "type": "3L", "terms": ["pressure", "<=", 101.3] }, { "type": "5C", "terms": [101.3, "<=", "pressure", "<", 200] }, { "type": "3R", "terms": [undefined, "<=", "pressure"] }], "roles": [{ "partition": 0 }, { "partition": 1 }, { "partition": 2 }] } }
  };
  // ----------------------------------------------------------------------------

  (0, _tapeCatch2.default)('Selection builder', function (t) {
    var emptySelection = _2.default.empty();
    var rangeSelection = _2.default.range({
      pressure: [{ interval: [0, 101.3], endpoints: 'oo', uncertainty: 15 }, { interval: [200, 400], endpoints: '*o', uncertainty: 30 }],
      temperature: [{ interval: [233, Number.MAX_VALUE], endpoints: 'oo', uncertainty: 15 }]
    });
    var partitionSelection = _2.default.partition('pressure', [{ value: 101.3, uncertainty: 20 }, { value: 200, uncertainty: 40, closeToLeft: true }]);

    t.deepEqual(emptySelection, expected.emptySelection, 'emptySelection');
    t.deepEqual(rangeSelection, expected.rangeSelection, 'rangeSelection');
    t.deepEqual(partitionSelection, expected.partitionSelection, 'partitionSelection');
    t.deepEqual(_2.default.convertToRuleSelection(emptySelection), expected.ruleEmptySelection, 'ruleEmptySelection');
    t.deepEqual(_2.default.convertToRuleSelection(rangeSelection), expected.ruleRangeSelection, 'ruleRangeSelection');
    t.deepEqual(_2.default.convertToRuleSelection(partitionSelection), expected.rulePartitionSelection, 'rulePartitionSelection');
    t.end();
  });
});