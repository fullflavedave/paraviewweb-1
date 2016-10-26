define(['exports', 'react', 'PVWStyle/ReactWidgets/AnnotationEditorWidget.mcss', './OneScore', './ManyScore', './placeholder-full.png', '../../../Common/Misc/AnnotationBuilder'], function (exports, _react, _AnnotationEditorWidget, _OneScore, _ManyScore, _placeholderFull, _AnnotationBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = annotationEditorWidget;

  var _react2 = _interopRequireDefault(_react);

  var _AnnotationEditorWidget2 = _interopRequireDefault(_AnnotationEditorWidget);

  var _OneScore2 = _interopRequireDefault(_OneScore);

  var _ManyScore2 = _interopRequireDefault(_ManyScore);

  var _placeholderFull2 = _interopRequireDefault(_placeholderFull);

  var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var placeholderContainer = _react2.default.createElement(
    'div',
    { className: _AnnotationEditorWidget2.default.placeholderContainer },
    _react2.default.createElement(
      'div',
      { className: _AnnotationEditorWidget2.default.placeholderTitle },
      'Annotation Editor'
    ),
    _react2.default.createElement(
      'div',
      { className: _AnnotationEditorWidget2.default.placeholderImageContainer },
      _react2.default.createElement('img', { src: _placeholderFull2.default, alt: 'Placeholder', className: _AnnotationEditorWidget2.default.placeholderImage })
    ),
    _react2.default.createElement(
      'div',
      { className: _AnnotationEditorWidget2.default.placeholderSubtitle },
      'No annotation currently available'
    )
  );

  function annotationEditorWidget(props) {
    if (!props.annotation) {
      return placeholderContainer;
    }

    var onSelectionChange = function onSelectionChange(selection, isEditDone) {
      var annotation = _AnnotationBuilder2.default.update(props.annotation, { selection: selection });

      // Remove score if a divider is removed
      if (selection.type === 'partition' && selection.partition.dividers.length + 1 !== annotation.score.length) {
        (function () {
          var removedIdx = 0;
          props.annotation.selection.partition.dividers.forEach(function (divider, idx) {
            if (selection.partition.dividers.indexOf(divider) === -1) {
              removedIdx = idx;
            }
          });
          annotation.score = annotation.score.filter(function (i, idx) {
            return idx !== removedIdx;
          });
        })();
      }

      if (selection.type === 'empty') {
        annotation.score = [];
      }

      props.onChange(annotation, isEditDone);
    };

    var onAnnotationChange = function onAnnotationChange(event) {
      var value = event.target.value;
      var name = event.target.name;
      var type = event.type;

      if (type === 'blur') {
        var annotation = _AnnotationBuilder2.default.update(props.annotation, _defineProperty({}, name, value));
        props.onChange(_AnnotationBuilder2.default.markModified(annotation), true);
      } else {
        var _annotation = Object.assign({}, props.annotation, _defineProperty({}, name, value));
        props.onChange(_annotation, false);
      }
    };

    var onScoreChange = function onScoreChange(idx, value) {
      var score = [].concat(props.annotation.score);
      score[Number(idx)] = value;

      var annotation = Object.assign({}, props.annotation, { score: score });
      props.onChange(_AnnotationBuilder2.default.markModified(annotation), true);
    };

    var Render = props.annotation.selection.type === 'partition' ? _ManyScore2.default : _OneScore2.default;

    if (props.annotation.selection.type === 'empty') {
      return placeholderContainer;
    }

    return _react2.default.createElement(
      'div',
      { className: props.annotation && props.annotation.readOnly ? _AnnotationEditorWidget2.default.disabledTopContainer : _AnnotationEditorWidget2.default.topContainer },
      _react2.default.createElement(Render, _extends({}, props, {
        onSelectionChange: onSelectionChange,
        onAnnotationChange: onAnnotationChange,
        onScoreChange: onScoreChange
      }))
    );
  }

  annotationEditorWidget.propTypes = {
    annotation: _react2.default.PropTypes.object,
    scores: _react2.default.PropTypes.array,
    ranges: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func,
    getLegend: _react2.default.PropTypes.func,
    rationaleOpen: _react2.default.PropTypes.bool
  };

  annotationEditorWidget.defaultProps = {
    onChange: function onChange(annotation, isEditDone) {},

    rationaleOpen: false
  };
});