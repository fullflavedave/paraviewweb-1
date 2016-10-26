'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rangeSelection;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DepthMatchingRender = require('../DepthMatchingRender');

var _DepthMatchingRender2 = _interopRequireDefault(_DepthMatchingRender);

var _FiveClauseRender = require('./FiveClauseRender');

var _FiveClauseRender2 = _interopRequireDefault(_FiveClauseRender);

var _OperatorRender = require('./OperatorRender');

var _OperatorRender2 = _interopRequireDefault(_OperatorRender);

var _SelectionBuilder = require('../../../../Common/Misc/SelectionBuilder');

var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rangeSelection(props) {
  var vars = props.selection.range.variables;

  var maxDepth = 1;
  Object.keys(vars).forEach(function (key) {
    if (vars[key].length > 1) maxDepth = 2;
  });

  var onChange = function onChange(changedPath) {
    var editing = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    // clone, so we don't step on whatever is current.
    var selection = JSON.parse(JSON.stringify(props.selection));
    var currentInterval = selection.range.variables[changedPath[0]][changedPath[1]];
    var changeItemIndex = changedPath[2];
    var newValue = changedPath[3];

    if (changeItemIndex === 0 || changeItemIndex === 4) {
      // change an input
      currentInterval.interval[changeItemIndex === 0 ? 0 : 1] = newValue;
    } else if (changeItemIndex === 1 || changeItemIndex === 3) {
      currentInterval.endpoints = changeItemIndex === 1 ? '' + newValue + currentInterval.endpoints.slice(1, 2) : '' + currentInterval.endpoints.slice(0, 1) + newValue;
    }

    // Notify happens in parent
    props.onChange(editing ? selection : _SelectionBuilder2.default.markModified(selection), !editing);
  };

  var onDelete = function onDelete(pathToDelete) {
    // clone, so we don't step on whatever is current.
    var selection = JSON.parse(JSON.stringify(props.selection));
    var intervals = selection.range.variables[pathToDelete[0]];
    var deleteIntervalIndex = pathToDelete[1];

    // do we have more that 2 terms for this variable? If so, we can just remove one.
    if (intervals.length >= 2) {
      intervals.splice(deleteIntervalIndex, 1);
    } else {
      // Deleting the last interval - delete the variable.
      delete selection.range.variables[pathToDelete[0]];
    }

    // If we still have at least one variable, selection isn't empty.
    if (Object.keys(selection.range.variables).length !== 0) {
      props.onChange(_SelectionBuilder2.default.markModified(selection), true);
    } else {
      props.onChange(_SelectionBuilder2.default.empty(), true);
    }
  };

  return _react2.default.createElement(
    _OperatorRender2.default,
    { operator: 'and', depth: 0, className: props.className },
    Object.keys(vars).map(function (fieldName, idx) {
      if (vars[fieldName].length > 1) {
        return _react2.default.createElement(
          _OperatorRender2.default,
          { operator: 'or', depth: 1, key: idx },
          vars[fieldName].map(function (clause, j) {
            return _react2.default.createElement(_FiveClauseRender2.default, {
              getLegend: props.getLegend,
              onChange: onChange,
              onDelete: onDelete,
              intervalSpec: clause,
              fieldName: fieldName,
              path: [fieldName, j],
              key: j
            });
          })
        );
      }
      return vars[fieldName].map(function (clause, j) {
        return _react2.default.createElement(
          _DepthMatchingRender2.default,
          { depth: 1, maxDepth: maxDepth },
          _react2.default.createElement(_FiveClauseRender2.default, {
            getLegend: props.getLegend,
            onChange: onChange,
            onDelete: onDelete,
            intervalSpec: clause,
            fieldName: fieldName,
            path: [fieldName, j],
            key: j
          })
        );
      });
    })
  );
}

rangeSelection.propTypes = {
  selection: _react2.default.PropTypes.object,
  ranges: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func,
  getLegend: _react2.default.PropTypes.func,
  className: _react2.default.PropTypes.string
};