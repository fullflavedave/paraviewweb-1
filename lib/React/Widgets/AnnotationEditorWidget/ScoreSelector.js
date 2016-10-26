'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scoreSelector;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AnnotationEditorWidget = require('PVWStyle/ReactWidgets/AnnotationEditorWidget.mcss');

var _AnnotationEditorWidget2 = _interopRequireDefault(_AnnotationEditorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scoreSelector(props) {
  var click = function click(event) {
    props.onChange(props.name, Number(event.target.getAttribute('data-score')));
  };

  return _react2.default.createElement(
    'section',
    { className: [_AnnotationEditorWidget2.default.scoreContainer, props.className].join(' ') },
    props.scores.map(function (score, idx) {
      return _react2.default.createElement('div', {
        key: idx,
        className: props.score === idx ? _AnnotationEditorWidget2.default.selectedScoreBlock : _AnnotationEditorWidget2.default.scoreBlock,
        style: { background: score.color, display: props.horizontal ? 'inline-block' : 'block' },
        title: score.name,
        'data-score': idx,
        onClick: click
      });
    })
  );
}

scoreSelector.propTypes = {
  name: _react2.default.PropTypes.string,
  score: _react2.default.PropTypes.number,
  scores: _react2.default.PropTypes.array,
  onChange: _react2.default.PropTypes.func,
  horizontal: _react2.default.PropTypes.bool,
  className: _react2.default.PropTypes.string
};

scoreSelector.defaultProps = {
  name: 'default',
  horizontal: false,
  onChange: function onChange(name, score) {}
};