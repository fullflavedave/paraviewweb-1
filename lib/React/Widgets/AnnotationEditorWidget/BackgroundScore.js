'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bgScore;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AnnotationEditorWidget = require('PVWStyle/ReactWidgets/AnnotationEditorWidget.mcss');

var _AnnotationEditorWidget2 = _interopRequireDefault(_AnnotationEditorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bgScore(props) {
  return _react2.default.createElement('div', {
    className: _AnnotationEditorWidget2.default.backgroundScore,
    style: {
      background: props.color,
      top: props.index * props.step + props.margin + 'px',
      height: props.fullHeight ? 'calc(100% - ' + 2 * props.margin + 'px)' : props.step - 2 * props.margin + 'px'
    }
  });
}

bgScore.propTypes = {
  color: _react2.default.PropTypes.string,
  index: _react2.default.PropTypes.number,
  step: _react2.default.PropTypes.number,
  margin: _react2.default.PropTypes.number,
  fullHeight: _react2.default.PropTypes.bool
};

bgScore.defaultProps = {
  index: 0,
  step: 28,
  margin: 1,
  fullHeight: false
};