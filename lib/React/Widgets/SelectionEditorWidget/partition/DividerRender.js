'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default =

// typical divider we are rendering:
// {
//   "value": 101.3,
//   "uncertainty": 20,
//   "closeToLeft": false
// },

dividerRender;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectionEditorWidget = require('PVWStyle/ReactWidgets/SelectionEditorWidget.mcss');

var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

var _NumberFormatter = require('../../../../Common/Misc/NumberFormatter');

var _NumberFormatter2 = _interopRequireDefault(_NumberFormatter);

var _SvgIconWidget = require('../../SvgIconWidget');

var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

var _Ineq = require('../../../../../svg/Operations/Ineq.svg');

var _Ineq2 = _interopRequireDefault(_Ineq);

var _Ineqq = require('../../../../../svg/Operations/Ineqq.svg');

var _Ineqq2 = _interopRequireDefault(_Ineqq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHOICE_LABELS = {
  o: _Ineq2.default,
  '*': _Ineqq2.default
};function dividerRender(props) {
  var divider = props.divider;

  var formatter = new _NumberFormatter2.default(3, [Number(divider.value), Number(divider.uncertainty)]);

  function onChange(e) {
    var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (!e.target.validity.valid) {
      return;
    }

    var value = e.target.value;
    var shouldBeNumber = e.target.nodeName === 'INPUT';
    var path = [].concat(props.path, e.target.dataset.path);

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
    var path = [].concat(props.path, target.dataset.path, !divider.closeToLeft);
    props.onChange(path);
  }

  return _react2.default.createElement(
    'section',
    { className: _SelectionEditorWidget2.default.fiveClauseContainer },
    _react2.default.createElement(
      'div',
      { className: _SelectionEditorWidget2.default.activeInequality, 'data-path': 'closeToLeft', onClick: toggleIneq },
      _react2.default.createElement(_SvgIconWidget2.default, { style: { pointerEvents: 'none' }, width: '20px', height: '20px', icon: CHOICE_LABELS[divider.closeToLeft ? '*' : 'o'] })
    ),
    _react2.default.createElement('input', {
      className: _SelectionEditorWidget2.default.numberInput,
      type: 'text',
      pattern: _NumberFormatter.sciNotationRegExp,
      'data-path': 'value',
      value: divider.value,
      onChange: onChange,
      onBlur: onBlur
    }),
    divider.uncertainty !== undefined ? _react2.default.createElement(
      'span',
      null,
      _react2.default.createElement(
        'div',
        { className: _SelectionEditorWidget2.default.inequality },
        '±'
      ),
      _react2.default.createElement('input', {
        className: _SelectionEditorWidget2.default.numberInput,
        type: 'text',
        pattern: _NumberFormatter.sciNotationRegExp,
        'data-path': 'uncertainty',
        value: divider.uncertainty,
        onChange: onChange,
        onBlur: onBlur
      })
    ) : null,
    _react2.default.createElement('i', { className: _SelectionEditorWidget2.default.deleteButton, onClick: onDelete })
  );
}

dividerRender.propTypes = {
  divider: _react2.default.PropTypes.object,
  path: _react2.default.PropTypes.array,
  onChange: _react2.default.PropTypes.func,
  onDelete: _react2.default.PropTypes.func
};