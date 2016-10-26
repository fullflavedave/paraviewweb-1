define(['exports', 'react', 'PVWStyle/ReactWidgets/SelectionEditorWidget.mcss', '../../../../../svg/Operations/And.svg', '../../../../../svg/Operations/Or.svg', './RuleRender', '../../SvgIconWidget'], function (exports, _react, _SelectionEditorWidget, _And, _Or, _RuleRender, _SvgIconWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = operatorRender;

  var _react2 = _interopRequireDefault(_react);

  var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

  var _And2 = _interopRequireDefault(_And);

  var _Or2 = _interopRequireDefault(_Or);

  var _RuleRender2 = _interopRequireDefault(_RuleRender);

  var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var OPERATOR_LABEL = {
    or: _Or2.default,
    and: _And2.default
  };

  function operatorRender(props) {
    var operator = props.rule.terms[0];
    var subRules = props.rule.terms.filter(function (r, idx) {
      return idx > 0;
    });
    return _react2.default.createElement(
      'table',
      { className: [props.depth ? _SelectionEditorWidget2.default.table : _SelectionEditorWidget2.default.rootTable, props.className].join(' ') },
      _react2.default.createElement(
        'tbody',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'td',
            { className: _SelectionEditorWidget2.default.operationCell },
            _react2.default.createElement(_SvgIconWidget2.default, { icon: OPERATOR_LABEL[operator], width: '25px', height: '25px' })
          ),
          _react2.default.createElement('td', { className: _SelectionEditorWidget2.default.groupTableCell }),
          _react2.default.createElement(
            'td',
            null,
            _react2.default.createElement(
              'table',
              { className: _SelectionEditorWidget2.default.table },
              _react2.default.createElement(
                'tbody',
                null,
                subRules.map(function (r, idx) {
                  return _react2.default.createElement(
                    'tr',
                    { key: idx },
                    _react2.default.createElement(
                      'td',
                      { className: _SelectionEditorWidget2.default.tableCell },
                      _react2.default.createElement(_RuleRender2.default, {
                        rule: r,
                        path: [].concat(props.path, idx + 1),
                        depth: props.depth + 1,
                        maxDepth: props.maxDepth,
                        onChange: props.onChange,
                        onDelete: props.onDelete,
                        getLegend: props.getLegend
                      })
                    )
                  );
                })
              )
            )
          )
        )
      )
    );
  }

  operatorRender.propTypes = {
    getLegend: _react2.default.PropTypes.func,
    rule: _react2.default.PropTypes.object,
    depth: _react2.default.PropTypes.number,
    maxDepth: _react2.default.PropTypes.number,
    path: _react2.default.PropTypes.array,
    onChange: _react2.default.PropTypes.func,
    onDelete: _react2.default.PropTypes.func,
    className: _react2.default.PropTypes.string
  };
});