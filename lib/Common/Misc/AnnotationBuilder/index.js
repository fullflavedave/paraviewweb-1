'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UUID = require('../UUID');

var _SelectionBuilder = require('../SelectionBuilder');

var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Internal helpers
// ----------------------------------------------------------------------------

var generation = 0;

function setInitialGenerationNumber(genNum) {
  generation = genNum;
}

// ----------------------------------------------------------------------------
// Public builder method
// ----------------------------------------------------------------------------

function annotation(selection, score) {
  var weight = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
  var rationale = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
  var name = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];

  generation += 1;
  return {
    id: (0, _UUID.generateUUID)(),
    generation: generation,
    selection: selection,
    score: score,
    weight: weight,
    rationale: rationale,
    name: name
  };
}

// ----------------------------------------------------------------------------

function update(annotationObject, changeSet) {
  var updatedAnnotation = Object.assign({}, annotationObject, changeSet);

  var changeDetected = false;
  Object.keys(updatedAnnotation).forEach(function (key) {
    if (updatedAnnotation[key] !== annotationObject[key]) {
      changeDetected = true;
    }
  });

  if (changeDetected) {
    generation += 1;
    updatedAnnotation.generation = generation;
  }

  return updatedAnnotation;
}

// ----------------------------------------------------------------------------

function updateReadOnlyFlag(annotationToEdit, readOnlyFields) {
  if (!annotationToEdit || !annotationToEdit.selection || !readOnlyFields) {
    return;
  }

  annotationToEdit.readOnly = _SelectionBuilder2.default.hasField(annotationToEdit.selection, readOnlyFields);
}

// ----------------------------------------------------------------------------

function fork(annotationObj) {
  var id = (0, _UUID.generateUUID)();
  generation += 1;
  return Object.assign({}, annotationObj, { generation: generation, id: id });
}

// ----------------------------------------------------------------------------

function markModified(annotationObject) {
  generation += 1;
  return Object.assign({}, annotationObject, { generation: generation });
}

// ----------------------------------------------------------------------------
// Exposed object
// ----------------------------------------------------------------------------

var EMPTY_ANNOTATION = annotation(_SelectionBuilder2.default.EMPTY_SELECTION, 0);

exports.default = {
  annotation: annotation,
  EMPTY_ANNOTATION: EMPTY_ANNOTATION,
  fork: fork,
  markModified: markModified,
  setInitialGenerationNumber: setInitialGenerationNumber,
  update: update,
  updateReadOnlyFlag: updateReadOnlyFlag
};