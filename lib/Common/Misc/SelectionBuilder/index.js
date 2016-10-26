define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // ----------------------------------------------------------------------------
  // Internal helpers
  // ----------------------------------------------------------------------------

  var generation = 0;

  function setInitialGenerationNumber(genNum) {
    generation = genNum;
  }

  function intersect(a, b) {
    var result = [];
    a.sort();
    b.sort();

    while (a.length && b.length) {
      if (a[0] < b[0]) {
        a.shift();
      } else if (a[0] > b[0]) {
        b.shift();
      } else {
        result.push(a.shift());
        b.shift();
      }
    }
    return result;
  }

  function clone(obj, fieldList, defaults) {
    var clonedObj = {};
    fieldList.forEach(function (name) {
      if (defaults && obj[name] === undefined && defaults[name] !== undefined) {
        clonedObj[name] = defaults[name];
      } else {
        clonedObj[name] = obj[name];
      }
      if (Array.isArray(clonedObj[name])) {
        clonedObj[name] = clonedObj[name].map(function (i) {
          return i;
        });
      }
    });
    return clonedObj;
  }

  var endpointToRuleOperator = {
    o: '<',
    '*': '<='
  };

  var ruleTypes = exports.ruleTypes = {
    '3L': { terms: 3, operators: { values: [['<', '<=']], index: [1] }, variable: 0, values: [2] },
    '3R': { terms: 3, operators: { values: [['>', '>=']], index: [1] }, variable: 2, values: [0] },
    '5C': { terms: 5, operators: { values: [['<', '<='], ['<', '<=']], index: [1, 3] }, variable: 2, values: [0, 4] },
    multi: { terms: -1, operators: null },
    logical: { operators: { values: ['not', 'and', 'or', 'xor'], index: [0] } },
    row: {}
  };

  // ----------------------------------------------------------------------------
  // Public builder method
  // ----------------------------------------------------------------------------

  function empty() {
    generation += 1;
    return {
      type: 'empty',
      generation: generation
    };
  }

  // ----------------------------------------------------------------------------

  function partition(variable, dividers) {
    generation += 1;
    return {
      type: 'partition',
      generation: generation,
      partition: {
        variable: variable,
        dividers: dividers.map(function (divider) {
          return clone(divider, ['value', 'uncertainty', 'closeToLeft'], { closeToLeft: false });
        })
      }
    };
  }

  // ----------------------------------------------------------------------------

  function range(vars) {
    generation += 1;
    var variables = {};
    var selection = {
      type: 'range',
      generation: generation,
      range: {
        variables: variables
      }
    };

    // Fill variables
    Object.keys(vars).forEach(function (name) {
      variables[name] = vars[name].map(function (interval) {
        return clone(interval, ['interval', 'endpoints', 'uncertainty'], { endpoints: '**' });
      });
      variables[name].sort(function (a, b) {
        return a.interval[0] - b.interval[0];
      });
    });

    return selection;
  }

  // ----------------------------------------------------------------------------

  function rule() {
    var type = arguments.length <= 0 || arguments[0] === undefined ? 'multi' : arguments[0];
    var terms = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var roles = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    generation += 1;
    // FIXME ?? deepClone ??
    return {
      type: 'rule',
      generation: generation,
      rule: {
        type: type,
        terms: terms,
        roles: roles
      }
    };
  }

  // ----------------------------------------------------------------------------

  function variableToRule(name, ranges) {
    var terms = ['or'];
    ranges.forEach(function (clause) {
      terms.push({
        type: '5C',
        terms: [clause.interval[0], endpointToRuleOperator[clause.endpoints[0]], name, endpointToRuleOperator[clause.endpoints[1]], clause.interval[1]]
      });
    });
    if (terms.length === 2) {
      // one range, don't need the logical 'or'
      return terms[1];
    }
    return {
      type: 'logical',
      terms: terms
    };
  }

  // ----------

  function rangeToRule(selection) {
    var terms = ['and'];
    var vars = selection.range.variables;
    Object.keys(vars).forEach(function (name) {
      terms.push(variableToRule(name, vars[name]));
    });
    return rule('logical', terms);
  }

  // ----------

  function partitionToRule(selection) {
    var roles = [];
    var _selection$partition = selection.partition;
    var dividers = _selection$partition.dividers;
    var variable = _selection$partition.variable;

    var terms = dividers.map(function (divider, idx, array) {
      if (idx === 0) {
        return {
          type: '3L',
          terms: [variable, divider.closeToLeft ? '<' : '<=', divider.value]
        };
      }
      return {
        type: '5C',
        terms: [array[idx - 1].value, array[idx - 1].closeToLeft ? '<' : '<=', variable, divider.closeToLeft ? '<' : '<=', divider.value]
      };
    });
    var lastDivider = dividers.slice(-1);
    terms.push({
      type: '3R',
      terms: [lastDivider.value, lastDivider.closeToLeft ? '<' : '<=', variable]
    });

    // Fill roles with partition number
    while (roles.length < terms.length) {
      roles.push({ partition: roles.length });
    }

    return rule('multi', terms, roles);
  }

  // ----------------------------------------------------------------------------

  function convertToRuleSelection(selection) {
    if (selection.type === 'range') {
      return rangeToRule(selection);
    }
    if (selection.type === 'partition') {
      return partitionToRule(selection);
    }
    if (selection.type === 'empty') {
      return selection;
    }

    throw new Error('Convertion to rule not supported with selection of type ' + selection.type);
  }

  // ----------------------------------------------------------------------------

  function markModified(selection) {
    generation += 1;
    return Object.assign({}, selection, { generation: generation });
  }

  // ----------------------------------------------------------------------------

  function hasField(selection, fieldNames) {
    if (!selection || selection.type === 'empty') {
      return false;
    }
    var fieldsToLookup = [].concat(fieldNames);

    if (selection.type === 'range') {
      var fields = Object.keys(selection.range.variables);
      var match = intersect(fieldsToLookup, fields);
      return match.length > 0;
    }
    if (selection.type === 'partition') {
      return fieldsToLookup.indexOf(selection.partition.variable) !== -1;
    }

    console.log('SelectionBuilder::hasField does not handle selection of type', selection.type);

    return false;
  }

  // ----------------------------------------------------------------------------
  // Exposed object
  // ----------------------------------------------------------------------------

  var EMPTY_SELECTION = empty();

  exports.default = {
    convertToRuleSelection: convertToRuleSelection,
    empty: empty,
    EMPTY_SELECTION: EMPTY_SELECTION,
    hasField: hasField,
    markModified: markModified,
    partition: partition,
    range: range,
    rule: rule,
    setInitialGenerationNumber: setInitialGenerationNumber
  };
});