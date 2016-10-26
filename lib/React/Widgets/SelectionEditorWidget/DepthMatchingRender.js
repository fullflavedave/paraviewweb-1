'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DepthMatchingRender;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectionEditorWidget = require('PVWStyle/ReactWidgets/SelectionEditorWidget.mcss');

var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DepthMatchingRender(props) {
  if (props.depth < props.maxDepth) {
    return _react2.default.createElement(
      DepthMatchingRender,
      { depth: props.depth + 1, maxDepth: props.maxDepth },
      _react2.default.createElement(
        'table',
        { className: _SelectionEditorWidget2.default.table },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _SelectionEditorWidget2.default.operationCell }),
            _react2.default.createElement('td', { className: _SelectionEditorWidget2.default.groupTableCellPadding }),
            _react2.default.createElement(
              'td',
              null,
              _react2.default.createElement(
                'table',
                { className: _SelectionEditorWidget2.default.table },
                _react2.default.createElement(
                  'tbody',
                  null,
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: _SelectionEditorWidget2.default.tableCell },
                      props.children
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  return props.children;
}

DepthMatchingRender.propTypes = {
  children: _react2.default.PropTypes.object,
  depth: _react2.default.PropTypes.number,
  maxDepth: _react2.default.PropTypes.number
};