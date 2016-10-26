define(['exports', '../../../Common/Core/CompositeClosureHelper', '../../../Common/Misc/AnnotationBuilder', '../../../Common/Misc/SelectionBuilder'], function (exports, _CompositeClosureHelper, _AnnotationBuilder, _SelectionBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.extend = extend;

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

  var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  // ----------------------------------------------------------------------------
  // Annotation Store Provider
  // ----------------------------------------------------------------------------

  var dupNameRegex = /^(.+)\s\(([\d]+)\)$/;
  var PROVIDER_NAME = 'AnnotationStoreProvider';

  function annotationStoreProvider(publicAPI, model) {
    if (!model.annotationStore) {
      model.annotationStore = {};
    }

    publicAPI.loadStoredAnnotationsFromState = function () {
      if (publicAPI.isA('PersistentStateProvider')) {
        (function () {
          model.annotationStore = publicAPI.getPersistentState(PROVIDER_NAME);
          // The AnnotationBuilder and SelectionBuilder need to know where to start
          // their generation number count.
          var maxAnnoGen = 0;
          var maxSelGen = 0;
          Object.keys(model.annotationStore).forEach(function (annoId) {
            var anno = model.annotationStore[annoId];
            if (anno.generation > maxAnnoGen) {
              maxAnnoGen = anno.generation;
            }
            if (anno.selection.generation > maxSelGen) {
              maxSelGen = anno.selection.generation;
            }
          });
          _AnnotationBuilder2.default.setInitialGenerationNumber(maxAnnoGen);
          _SelectionBuilder2.default.setInitialGenerationNumber(maxSelGen);
        })();
      }
    };

    publicAPI.getStoredAnnotationNames = function () {
      var val = Object.keys(model.annotationStore).map(function (id) {
        return model.annotationStore[id].name;
      });
      val.sort();
      return val;
    };

    publicAPI.getNextStoredAnnotationName = function (name) {
      var allNames = publicAPI.getStoredAnnotationNames();
      var newName = name;
      if (!name || name.length === 0) {
        newName = model.defaultEmptyAnnotationName;
      }

      if (allNames.indexOf(newName) === -1) {
        return newName;
      }

      var _ref = dupNameRegex.exec(newName) || [newName, newName, '0'];

      var _ref2 = _slicedToArray(_ref, 3);

      var base = _ref2[1];
      var countStr = _ref2[2];

      var count = Number(countStr) || 0;

      while (allNames.indexOf(newName) !== -1) {
        count += 1;
        newName = base + ' (' + count + ')';
      }

      return newName;
    };

    publicAPI.getStoredAnnotation = function (id) {
      return model.annotationStore[id];
    };

    publicAPI.getStoredAnnotations = function () {
      return model.annotationStore;
    };

    publicAPI.setStoredAnnotation = function (id, annotation) {
      var changeSet = {
        id: id,
        annotation: annotation,
        action: 'new'
      };
      if (model.annotationStore[id]) {
        changeSet.action = 'save';
      }
      model.annotationStore[id] = annotation;
      if (publicAPI.isA('PersistentStateProvider')) {
        publicAPI.setPersistentState(PROVIDER_NAME, model.annotationStore);
      }
      publicAPI.fireStoreAnnotationChange(changeSet);
    };

    publicAPI.updateStoredAnnotations = function (updates) {
      Object.keys(updates).forEach(function (annoId) {
        model.annotationStore[annoId] = updates[annoId];
      });
      if (publicAPI.isA('PersistentStateProvider')) {
        publicAPI.setPersistentState(PROVIDER_NAME, model.annotationStore);
      }
      publicAPI.fireStoreAnnotationChange({ action: 'updates' });
    };

    publicAPI.deleteStoredAnnotation = function (id) {
      var changeSet = {
        id: id,
        action: 'delete',
        annotation: model.annotationStore[id]
      };
      delete model.annotationStore[id];
      if (publicAPI.isA('PersistentStateProvider')) {
        publicAPI.setPersistentState(PROVIDER_NAME, model.annotationStore);
      }
      publicAPI.fireStoreAnnotationChange(changeSet);
    };
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {
    // annotationStore: null,
    defaultEmptyAnnotationName: 'Empty'
  };

  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, PROVIDER_NAME);
    _CompositeClosureHelper2.default.event(publicAPI, model, 'StoreAnnotationChange');
    _CompositeClosureHelper2.default.set(publicAPI, model, ['defaultEmptyAnnotationName']);
    _CompositeClosureHelper2.default.get(publicAPI, model, ['defaultEmptyAnnotationName']);

    annotationStoreProvider(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});