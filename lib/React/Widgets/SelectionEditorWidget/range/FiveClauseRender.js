define(['exports', 'react', 'PVWStyle/ReactWidgets/SelectionEditorWidget.mcss', '../../../../../svg/Operations/Ineq.svg', '../../../../../svg/Operations/Ineqq.svg', '../LegendIcon', '../../../../Common/Misc/NumberFormatter', '../../SvgIconWidget'], function (exports, _react, _SelectionEditorWidget, _Ineq, _Ineqq, _LegendIcon, _NumberFormatter, _SvgIconWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = fiveClauseRender;

  var _react2 = _interopRequireDefault(_react);

  var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

  var _Ineq2 = _interopRequireDefault(_Ineq);

  var _Ineqq2 = _interopRequireDefault(_Ineqq);

  var _LegendIcon2 = _interopRequireDefault(_LegendIcon);

  var _NumberFormatter2 = _interopRequireDefault(_NumberFormatter);

  var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var CHOICE_LABELS = {
    o: _Ineq2.default,
    '*': _Ineqq2.default
  };

  var NEXT_VALUE = {
    o: '*',
    '*': 'o'
  };

  // typical intervalSpec we are rendering as 5 clauses:
  // {
  //   "interval": [
  //     233,
  //     1.7976931348623157e+308
  //   ],
  //   "endpoints": "oo",
  //   "uncertainty": 15
  // }

  function fiveClauseRender(props) {
    var intervalSpec = props.intervalSpec;
    var fieldName = props.fieldName;

    var terms = [intervalSpec.interval[0], intervalSpec.endpoints.slice(0, 1), fieldName, intervalSpec.endpoints.slice(1, 2), intervalSpec.interval[1]];
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
    fieldName: _react2.default.PropTypes.string,
    intervalSpec: _react2.default.PropTypes.object,
    path: _react2.default.PropTypes.array,
    onChange: _react2.default.PropTypes.func,
    onDelete: _react2.default.PropTypes.func
  };
});