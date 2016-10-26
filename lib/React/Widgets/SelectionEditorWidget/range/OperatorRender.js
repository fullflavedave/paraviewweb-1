define(['exports', 'react', 'PVWStyle/ReactWidgets/SelectionEditorWidget.mcss', '../../../../../svg/Operations/And.svg', '../../../../../svg/Operations/Or.svg', '../../SvgIconWidget'], function (exports, _react, _SelectionEditorWidget, _And, _Or, _SvgIconWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = operatorRender;

  var _react2 = _interopRequireDefault(_react);

  var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

  var _And2 = _interopRequireDefault(_And);

  var _Or2 = _interopRequireDefault(_Or);

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
    var operator = props.operator;
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
                _react2.default.Children.map(props.children, function (r, idx) {
                  return _react2.default.createElement(
                    'tr',
                    { key: idx },
                    _react2.default.createElement(
                      'td',
                      { className: _SelectionEditorWidget2.default.tableCell },
                      r
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
    children: _react2.default.PropTypes.array,
    operator: _react2.default.PropTypes.string,
    depth: _react2.default.PropTypes.number,
    className: _react2.default.PropTypes.string
  };
});