define(['exports', 'react', './types'], function (exports, _react, _types) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = selectionEditorWidget;

  var _react2 = _interopRequireDefault(_react);

  var _types2 = _interopRequireDefault(_types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function selectionEditorWidget(props) {
    var SelectionWidget = _types2.default[props.selection ? props.selection.type : 'empty'];
    return _react2.default.createElement(SelectionWidget, props);
  }

  selectionEditorWidget.propTypes = {
    selection: _react2.default.PropTypes.object,
    ranges: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func,
    getLegend: _react2.default.PropTypes.func,
    className: _react2.default.PropTypes.string
  };

  selectionEditorWidget.defaultProps = {
    onChange: function onChange(selection, isEditDone) {}
  };
});