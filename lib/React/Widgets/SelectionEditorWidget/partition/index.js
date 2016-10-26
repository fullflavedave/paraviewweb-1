'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = partitionSelection;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FieldRender = require('./FieldRender');

var _FieldRender2 = _interopRequireDefault(_FieldRender);

var _DividerRender = require('./DividerRender');

var _DividerRender2 = _interopRequireDefault(_DividerRender);

var _SelectionBuilder = require('../../../../Common/Misc/SelectionBuilder');

var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clampDividerUncertainty(dividers, index, inMaxUncertainty) {
  var divider = dividers[index];
  var val = divider.value;
  var uncertScale = 1.0;
  var maxUncertainty = inMaxUncertainty;
  // Note comparison with low/high divider is signed. If val indicates divider has been
  // moved _past_ the neighboring divider, low/high will be negative.
  if (index > 0) {
    var low = dividers[index - 1].value + dividers[index - 1].uncertainty * uncertScale;
    maxUncertainty = Math.min(maxUncertainty, (val - low) / uncertScale);
  }
  if (index < dividers.length - 1) {
    var high = dividers[index + 1].value - dividers[index + 1].uncertainty * uncertScale;
    maxUncertainty = Math.min((high - val) / uncertScale, maxUncertainty);
  }
  // make sure uncertainty is zero when val has passed a neighbor.
  maxUncertainty = Math.max(maxUncertainty, 0);
  divider.uncertainty = Math.min(maxUncertainty, divider.uncertainty);
}

function clampDivider(selection, index, ranges) {
  // make sure uncertainties don't overlap.
  var divider = selection.partition.dividers[index];

  var maxUncertainty = Number.MAX_VALUE;
  var minMax = ranges ? ranges[selection.partition.variable] : undefined;
  if (minMax) {
    maxUncertainty = 0.5 * (minMax[1] - minMax[0]);
    // if available, clamp divider value to min/max of its range.
    divider.value = Math.min(minMax[1], Math.max(minMax[0], divider.value));
  }
  clampDividerUncertainty(selection.partition.dividers, index, maxUncertainty);
  // Re-sort dividers so uncertainty clamping works next time.
  selection.partition.dividers.sort(function (a, b) {
    return a.value - b.value;
  });
  // make sure uncertainties don't overlap.
  selection.partition.dividers.forEach(function (divdr, i) {
    clampDividerUncertainty(selection.partition.dividers, i, maxUncertainty);
  });
}

function partitionSelection(props) {
  var onChange = function onChange(changedPath) {
    var editing = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    // clone, so we don't step on whatever is current.
    var selection = JSON.parse(JSON.stringify(props.selection));
    if (changedPath[0] === 'dividers') {
      var index = changedPath[1];
      var divider = selection.partition.dividers[index];
      var changeItemKey = changedPath[2];
      var newValue = changedPath[3];

      // console.log('change', divider, changeItemKey, newValue);
      divider[changeItemKey] = newValue;
      if (!editing) clampDivider(selection, index, props.ranges);
    }

    // Notify happens in parent
    props.onChange(editing ? selection : _SelectionBuilder2.default.markModified(selection), !editing);
  };

  var onDelete = function onDelete(pathToDelete) {
    // clone, so we don't step on whatever is current.
    var selection = JSON.parse(JSON.stringify(props.selection));
    if (pathToDelete[0] === 'dividers') {
      var deleteIndex = pathToDelete[1];
      // remove one.
      selection.partition.dividers.splice(deleteIndex, 1);
    }

    props.onChange(_SelectionBuilder2.default.markModified(selection), true);
  };

  var dividers = props.selection.partition.dividers;
  var fieldName = props.selection.partition.variable;

  return _react2.default.createElement(
    'div',
    { style: { position: 'relative' } },
    _react2.default.createElement(
      'div',
      { style: { position: 'absolute', width: '100%', height: '100%', zIndex: 0 } },
      props.children
    ),
    _react2.default.createElement(
      _FieldRender2.default,
      { className: props.className, fieldName: fieldName, getLegend: props.getLegend, depth: 0 },
      dividers.map(function (divider, idx) {
        return _react2.default.createElement(_DividerRender2.default, {
          onChange: onChange,
          onDelete: onDelete,
          divider: divider,
          path: ['dividers', idx],
          key: idx,
          getLegend: props.getLegend
        });
      })
    )
  );
}

partitionSelection.propTypes = {
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.array]),
  selection: _react2.default.PropTypes.object,
  ranges: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func,
  getLegend: _react2.default.PropTypes.func,
  className: _react2.default.PropTypes.string
};