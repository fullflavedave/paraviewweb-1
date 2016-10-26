define(['exports', 'react', 'PVWStyle/ReactWidgets/AnnotationEditorWidget.mcss', '../../CollapsibleWidget', '../ScoreSelector', '../BackgroundScore', '../../SelectionEditorWidget'], function (exports, _react, _AnnotationEditorWidget, _CollapsibleWidget, _ScoreSelector, _BackgroundScore, _SelectionEditorWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = manyScoreAnnotationEditorWidget;

  var _react2 = _interopRequireDefault(_react);

  var _AnnotationEditorWidget2 = _interopRequireDefault(_AnnotationEditorWidget);

  var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

  var _ScoreSelector2 = _interopRequireDefault(_ScoreSelector);

  var _BackgroundScore2 = _interopRequireDefault(_BackgroundScore);

  var _SelectionEditorWidget2 = _interopRequireDefault(_SelectionEditorWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function manyScoreAnnotationEditorWidget(props) {
    return _react2.default.createElement(
      'div',
      { className: _AnnotationEditorWidget2.default.verticalContainer },
      _react2.default.createElement(
        'section',
        { className: _AnnotationEditorWidget2.default.lineContainer },
        _react2.default.createElement(
          'label',
          { className: _AnnotationEditorWidget2.default.nameLabel },
          'Name'
        ),
        _react2.default.createElement('input', {
          type: 'text',
          name: 'name',
          className: _AnnotationEditorWidget2.default.nameInput,
          value: props.annotation.name,
          onChange: props.onAnnotationChange,
          onBlur: props.onAnnotationChange
        })
      ),
      _react2.default.createElement(
        'section',
        { className: _AnnotationEditorWidget2.default.lineContainerCenter },
        _react2.default.createElement(
          _SelectionEditorWidget2.default,
          {
            className: _AnnotationEditorWidget2.default.flexItem,
            selection: props.annotation.selection,
            ranges: props.ranges,
            getLegend: props.getLegend,
            onChange: props.onSelectionChange
          },
          props.annotation.score.map(function (score, idx, array) {
            return _react2.default.createElement(_BackgroundScore2.default, {
              key: 'bgscore-' + idx,
              index: idx,
              fullHeight: array.length === 1,
              color: props.scores[score].color
            });
          })
        ),
        _react2.default.createElement(
          'div',
          { className: _AnnotationEditorWidget2.default.verticalContainer, style: { position: 'relative', zIndex: 0 } },
          props.annotation.score.map(function (score, idx) {
            return _react2.default.createElement(_ScoreSelector2.default, {
              key: 'score-' + idx,
              className: _AnnotationEditorWidget2.default.flexItem,
              score: score,
              scores: props.scores,
              name: '' + idx,
              onChange: props.onScoreChange,
              horizontal: true
            });
          })
        )
      ),
      _react2.default.createElement(
        'section',
        { className: _AnnotationEditorWidget2.default.lineContainerSpaceBetween },
        _react2.default.createElement('label', { className: _AnnotationEditorWidget2.default.label }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'label',
            { className: _AnnotationEditorWidget2.default.label },
            'Weight'
          ),
          _react2.default.createElement('input', {
            className: _AnnotationEditorWidget2.default.weightInput,
            type: 'number',
            value: props.annotation.weight,
            min: '1',
            max: '10',
            name: 'weight',
            onChange: props.onAnnotationChange,
            onBlur: props.onAnnotationChange
          })
        )
      ),
      _react2.default.createElement(
        'section',
        { className: _AnnotationEditorWidget2.default.lineContainerSpaceBetween },
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          { title: 'Rationale', open: props.rationaleOpen },
          _react2.default.createElement('textarea', {
            className: _AnnotationEditorWidget2.default.textBox,
            name: 'rationale',
            rows: '5',
            value: props.annotation.rationale,
            onChange: props.onAnnotationChange,
            onBlur: props.onAnnotationChange
          })
        )
      )
    );
  }

  manyScoreAnnotationEditorWidget.propTypes = {
    annotation: _react2.default.PropTypes.object,
    scores: _react2.default.PropTypes.array,
    ranges: _react2.default.PropTypes.object,
    getLegend: _react2.default.PropTypes.func,
    rationaleOpen: _react2.default.PropTypes.bool,

    onSelectionChange: _react2.default.PropTypes.func,
    onAnnotationChange: _react2.default.PropTypes.func,
    onScoreChange: _react2.default.PropTypes.func
  };

  manyScoreAnnotationEditorWidget.defaultProps = {
    rationaleOpen: false
  };
});