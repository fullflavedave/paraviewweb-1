'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emptySelection;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectionEditorWidget = require('PVWStyle/ReactWidgets/SelectionEditorWidget.mcss');

var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emptySelection(props) {
  return _react2.default.createElement(
    'div',
    { className: [_SelectionEditorWidget2.default.emptySelection, props.className].join(' ') },
    'No selection'
  );
}

emptySelection.propTypes = {
  className: _react2.default.PropTypes.string
};