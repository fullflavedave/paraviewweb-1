define(['exports', 'react', 'PVWStyle/ReactWidgets/AnnotationStoreEditorWidget.mcss', '../ActionListWidget', '../AnnotationEditorWidget'], function (exports, _react, _AnnotationStoreEditorWidget, _ActionListWidget, _AnnotationEditorWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = annotationStoreEditorWidget;

  var _react2 = _interopRequireDefault(_react);

  var _AnnotationStoreEditorWidget2 = _interopRequireDefault(_AnnotationStoreEditorWidget);

  var _ActionListWidget2 = _interopRequireDefault(_ActionListWidget);

  var _AnnotationEditorWidget2 = _interopRequireDefault(_AnnotationEditorWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function button(label, action) {
    return _react2.default.createElement(
      'div',
      { key: label, className: _AnnotationStoreEditorWidget2.default.button, onClick: action },
      label
    );
  }

  function annotationStoreEditorWidget(props) {
    if (!props.annotations) {
      return null;
    }

    var listAnnotation = Object.keys(props.annotations).map(function (id, index) {
      return {
        name: props.annotations[id].name,
        action: '' + index,
        data: '' + id,
        active: props.annotation ? props.annotation.id === id : false
      };
    });

    var onActivateAnnotation = function onActivateAnnotation(name, action, data) {
      props.onChange('select', data, props.annotations[data]);
    };

    var storeAction = function storeAction(action) {
      return function () {
        props.onChange(action, props.annotation.id, props.annotation);
      };
    };

    var buttons = [];

    if (props.annotation && props.annotations[props.annotation.id]) {
      var storedSelectedAnnotation = props.annotations[props.annotation.id];
      if (storedSelectedAnnotation.generation === props.annotation.generation) {
        buttons.push(button('Delete', storeAction('delete')));
      } else {
        buttons.push(button('Save as new', storeAction('new')));
        buttons.push(button('Revert', storeAction('reset')));
        buttons.push(button('Update', storeAction('save')));
      }
    } else if (props.annotation && props.annotation.selection.type !== 'empty' && !props.annotation.readOnly) {
      buttons.push(button('Save', storeAction('new')));
    }

    return _react2.default.createElement(
      'div',
      { className: _AnnotationStoreEditorWidget2.default.container },
      _react2.default.createElement(
        'div',
        { className: _AnnotationStoreEditorWidget2.default.topLine },
        _react2.default.createElement(
          'section',
          { className: _AnnotationStoreEditorWidget2.default.list },
          _react2.default.createElement(_ActionListWidget2.default, { list: listAnnotation, onClick: onActivateAnnotation })
        ),
        _react2.default.createElement(
          'section',
          { className: _AnnotationStoreEditorWidget2.default.editor },
          _react2.default.createElement(_AnnotationEditorWidget2.default, {
            annotation: props.annotation,
            scores: props.scores,
            ranges: props.ranges,
            getLegend: props.getLegend,
            onChange: props.onAnnotationChange,
            rationaleOpen: props.rationaleOpen
          })
        )
      ),
      _react2.default.createElement(
        'div',
        { className: _AnnotationStoreEditorWidget2.default.buttonLine },
        _react2.default.createElement(
          'section',
          { className: _AnnotationStoreEditorWidget2.default.buttonsSection },
          _react2.default.createElement(
            'div',
            { className: _AnnotationStoreEditorWidget2.default.button, onClick: function onClick() {
                return props.onChange('pushEmpty');
              } },
            'Reset'
          )
        ),
        _react2.default.createElement(
          'section',
          { className: _AnnotationStoreEditorWidget2.default.buttonsSection },
          buttons
        )
      )
    );
  }

  annotationStoreEditorWidget.propTypes = {
    annotation: _react2.default.PropTypes.object,
    annotations: _react2.default.PropTypes.object,

    scores: _react2.default.PropTypes.array,
    ranges: _react2.default.PropTypes.object,
    getLegend: _react2.default.PropTypes.func,
    rationaleOpen: _react2.default.PropTypes.bool,

    onAnnotationChange: _react2.default.PropTypes.func,
    onChange: _react2.default.PropTypes.func
  };

  annotationStoreEditorWidget.defaultProps = {
    onAnnotationChange: function onAnnotationChange(annotation, isEditing) {},
    onChange: function onChange(action, id, annotation) {},

    rationaleOpen: false
  };
});