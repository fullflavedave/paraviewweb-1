define(['exports', 'react', './RuleRender', '../../../../Common/Misc/SelectionBuilder'], function (exports, _react, _RuleRender, _SelectionBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ruleSelection;

  var _react2 = _interopRequireDefault(_react);

  var _RuleRender2 = _interopRequireDefault(_RuleRender);

  var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function extractMaxDepth(rule, currentDepth) {
    if (!rule || !rule.terms || rule.terms.length === 0) {
      return currentDepth;
    }

    var ruleSelector = rule.type;
    if (ruleSelector === 'rule') {
      return extractMaxDepth(rule.rule, currentDepth);
    }
    if (ruleSelector === 'logical') {
      return rule.terms.filter(function (r, idx) {
        return idx > 0;
      }) // Get the sub rules
      .map(function (sr) {
        return extractMaxDepth(sr, currentDepth + 1);
      }) // Get depth of subRules
      .reduce(function (prev, curr) {
        return prev > curr ? prev : curr;
      }); // Extract max
    }

    return currentDepth;
  }

  // Edit in place
  function ensureRuleNumbers(rule) {
    if (!rule || rule.length === 0) {
      return;
    }

    var ruleSelector = rule.type;
    if (ruleSelector === 'rule') {
      ensureRuleNumbers(rule.rule);
    }
    if (ruleSelector === 'logical') {
      rule.terms.filter(function (r, idx) {
        return idx > 0;
      }).forEach(function (r) {
        return ensureRuleNumbers(r);
      });
    }

    if (ruleSelector === '5C') {
      var terms = rule.terms;
      terms[0] = Number(terms[0]);
      terms[4] = Number(terms[4]);
    }
  }

  function ruleSelection(props) {
    var rule = props.selection.rule;
    if (!rule || rule.length === 0 || !rule.type) {
      return null;
    }

    var onChange = function onChange(changedPath) {
      var editing = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var selection = JSON.parse(JSON.stringify(props.selection));
      var terms = selection.rule.terms;
      var currentSelection = terms;

      while (changedPath.length > 2) {
        var idx = changedPath.shift();
        currentSelection[idx].terms = [].concat(currentSelection[idx].terms);
        currentSelection = currentSelection[idx].terms;
      }
      currentSelection[changedPath[0]] = changedPath[1];

      // Notify the change to other components (only if not in progress editing)
      if (!editing) {
        ensureRuleNumbers(selection.rule);
      }

      // Notify of changes
      props.onChange(editing ? selection : _SelectionBuilder2.default.markModified(selection), !editing);
    };

    var onDelete = function onDelete(pathToDelete) {
      var selection = JSON.parse(JSON.stringify(props.selection));
      var terms = selection.rule.terms;
      var currentSelection = terms;
      var lastIdx = pathToDelete[0];
      var previousSelection = currentSelection;

      if (pathToDelete.length > 1) {
        while (pathToDelete.length > 2) {
          lastIdx = pathToDelete.shift();
          currentSelection[lastIdx].terms = [].concat(currentSelection[lastIdx].terms);
          previousSelection = currentSelection;
          currentSelection = currentSelection[lastIdx].terms;
        }

        // do we have more that 2 terms in this clause? If so, we can just remove one.
        if (currentSelection[pathToDelete[0]].terms.length > 3) {
          currentSelection[pathToDelete[0]].terms.splice(pathToDelete[0], 1);
        } else {
          // Down to 1 clause - we need to bubble up the rule
          var idxToKeep = pathToDelete[1] === 1 ? 2 : 1;
          previousSelection[lastIdx] = currentSelection[pathToDelete[0]].terms[idxToKeep];
        }
      } else {
        // Filtering the root
        selection.rule.terms.splice(pathToDelete[0], 1);
      }

      if (selection.rule.terms.length > 1) {
        // Notify the change to other components
        ensureRuleNumbers(selection.rule);
        props.onChange(_SelectionBuilder2.default.markModified(selection), true);
      } else {
        props.onChange(_SelectionBuilder2.default.empty(), true);
      }
    };

    return _react2.default.createElement(_RuleRender2.default, {
      className: props.className,
      getLegend: props.getLegend,

      onChange: onChange,
      onDelete: onDelete,

      rule: rule,
      depth: 0,
      maxDepth: extractMaxDepth(rule, 0),
      path: []
    });
  }

  ruleSelection.propTypes = {
    selection: _react2.default.PropTypes.object,
    ranges: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func,
    getLegend: _react2.default.PropTypes.func,
    className: _react2.default.PropTypes.string
  };
});