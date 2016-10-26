'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fiveClauseRender;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectionEditorWidget = require('PVWStyle/ReactWidgets/SelectionEditorWidget.mcss');

var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

var _Ineq = require('../../../../../svg/Operations/Ineq.svg');

var _Ineq2 = _interopRequireDefault(_Ineq);

var _Ineqq = require('../../../../../svg/Operations/Ineqq.svg');

var _Ineqq2 = _interopRequireDefault(_Ineqq);

var _LegendIcon = require('../LegendIcon');

var _LegendIcon2 = _interopRequireDefault(_LegendIcon);

var _NumberFormatter = require('../../../../Common/Misc/NumberFormatter');

var _NumberFormatter2 = _interopRequireDefault(_NumberFormatter);

var _SvgIconWidget = require('../../SvgIconWidget');

var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHOICE_LABELS = {
  '<': _Ineq2.default,
  '<=': _Ineqq2.default
};

var NEXT_VALUE = {
  '<': '<=',
  '<=': '<'
};

/* eslint-disable react/no-unused-prop-types */

function fiveClauseRender(props) {
  var rule = props.rule;

  var terms = rule.terms;
  var formatter = new _NumberFormatter2.default(3, [Number(terms[0]), Number(terms[4])]);

  function onChange(e) {
    var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (!e.target.validity.valid) {
      return;
    }

    var value = e.target.value;
    var shouldBeNumber = e.target.nodeName === 'INPUT';
    var path = [].concat(props.path, Number(e.target.dataset.path));

    if (shouldBeNumber) {
      path.push(!force ? value : Number(formatter.eval(Number(value))));
    } else {
      path.push(value);
    }

    props.onChange(path, !force);
  }

  function onBlur(e) {
    onChange(e, true);
  }

  function onDelete() {
    props.onDelete(props.path);
  }

  function toggleIneq(e) {
    var target = e.target;
    while (!target.dataset) {
      target = target.parentNode;
    }
    var idx = Number(target.dataset.path);
    var path = [].concat(props.path, idx, NEXT_VALUE[terms[idx]]);
    props.onChange(path);
  }

  return _react2.default.createElement(
    'section',
    { className: _SelectionEditorWidget2.default.fiveClauseContainer },
    _react2.default.createElement('input', {
      className: _SelectionEditorWidget2.default.numberInput,
      type: 'text',
      pattern: _NumberFormatter.sciNotationRegExp,
      'data-path': '0',
      value: terms[0],
      onChange: onChange,
      onBlur: onBlur
    }),
    _react2.default.createElement(
      'div',
      { className: _SelectionEditorWidget2.default.activeInequality, 'data-path': '1', onClick: toggleIneq },
      _react2.default.createElement(_SvgIconWidget2.default, { style: { pointerEvents: 'none' }, width: '20px', height: '20px', icon: CHOICE_LABELS[terms[1]] })
    ),
    _react2.default.createElement(
      'div',
      { className: _SelectionEditorWidget2.default.inequality, title: terms[2] },
      _react2.default.createElement(_LegendIcon2.default, { width: '20px', height: '20px', getLegend: props.getLegend, name: terms[2] })
    ),
    _react2.default.createElement(
      'div',
      { className: _SelectionEditorWidget2.default.activeInequality, 'data-path': '3', onClick: toggleIneq },
      _react2.default.createElement(_SvgIconWidget2.default, { style: { pointerEvents: 'none' }, width: '20px', height: '20px', icon: CHOICE_LABELS[terms[3]] })
    ),
    _react2.default.createElement('input', {
      className: _SelectionEditorWidget2.default.numberInput,
      type: 'text',
      pattern: _NumberFormatter.sciNotationRegExp,
      'data-path': '4',
      value: terms[4] // formatter.eval(terms[1])
      , onChange: onChange,
      onBlur: onBlur
    }),
    _react2.default.createElement('i', { className: _SelectionEditorWidget2.default.deleteButton, onClick: onDelete })
  );
}

fiveClauseRender.propTypes = {
  getLegend: _react2.default.PropTypes.func,
  rule: _react2.default.PropTypes.object,
  depth: _react2.default.PropTypes.number,
  path: _react2.default.PropTypes.array,
  onChange: _react2.default.PropTypes.func,
  onDelete: _react2.default.PropTypes.func
};