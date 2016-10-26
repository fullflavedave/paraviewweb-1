'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fieldRender;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectionEditorWidget = require('PVWStyle/ReactWidgets/SelectionEditorWidget.mcss');

var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

var _LegendIcon = require('../LegendIcon');

var _LegendIcon2 = _interopRequireDefault(_LegendIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fieldRender(props) {
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
          { className: _SelectionEditorWidget2.default.operationCell, title: props.fieldName },
          _react2.default.createElement(_LegendIcon2.default, { width: '25px', height: '25px', getLegend: props.getLegend, name: props.fieldName })
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

fieldRender.propTypes = {
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.array]),
  getLegend: _react2.default.PropTypes.func,
  fieldName: _react2.default.PropTypes.string,
  depth: _react2.default.PropTypes.number,
  className: _react2.default.PropTypes.string
};