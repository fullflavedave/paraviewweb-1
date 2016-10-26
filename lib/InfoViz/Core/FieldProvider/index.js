define(['exports', '../../../Common/Core/CompositeClosureHelper'], function (exports, _CompositeClosureHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.extend = extend;

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var DEFAULT_FIELD_STATE = {
    range: [0, 1],
    active: false
  };

  var PROVIDER_NAME = 'FieldProvider';

  // ----------------------------------------------------------------------------
  // Field Provider
  // ----------------------------------------------------------------------------

  function fieldProvider(publicAPI, model) {
    if (!model.fields) {
      model.fields = {};
    }

    var triggerFieldChange = function triggerFieldChange(field) {
      if (publicAPI.isA('PersistentStateProvider')) {
        publicAPI.setPersistentState(PROVIDER_NAME, model.fields);
      }
      publicAPI.fireFieldChange(field);
    };

    publicAPI.loadFieldsFromState = function () {
      var count = 0;
      if (publicAPI.isA('PersistentStateProvider')) {
        (function () {
          var storageItems = publicAPI.getPersistentState(PROVIDER_NAME);
          Object.keys(storageItems).forEach(function (storeKey) {
            publicAPI.updateField(storeKey, storageItems[storeKey]);
            count += 1;
          });
        })();
      }
      return count;
    };

    publicAPI.getFieldNames = function () {
      var val = Object.keys(model.fields);
      if (model.fieldsSorted) val.sort();
      return val;
    };

    publicAPI.getActiveFieldNames = function () {
      var val = Object.keys(model.fields).filter(function (name) {
        return model.fields[name].active;
      });
      if (model.fieldsSorted) val.sort();
      return val;
    };

    publicAPI.addField = function (name) {
      var initialState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var field = Object.assign({}, DEFAULT_FIELD_STATE, initialState, { name: name });
      field.range = [].concat(field.range); // Make sure we copy the array
      model.fields[name] = field;
      triggerFieldChange(field);
    };

    publicAPI.getField = function (name) {
      return model.fields[name];
    };

    publicAPI.updateField = function (name) {
      var changeSet = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var field = model.fields[name] || {};
      var hasChange = false;

      Object.keys(changeSet).forEach(function (key) {
        hasChange = hasChange || JSON.stringify(field[key]) !== JSON.stringify(changeSet[key]);
        // Set changes
        field[key] = changeSet[key];
      });

      if (hasChange) {
        field.name = name; // Just in case
        model.fields[name] = field;
        triggerFieldChange(field);
      }
    };

    publicAPI.toggleFieldSelection = function (name) {
      model.fields[name].active = !model.fields[name].active;
      triggerFieldChange(model.fields[name]);
    };

    publicAPI.removeAllFields = function () {
      model.fields = {};
      triggerFieldChange();
    };
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {
    fields: null,
    fieldsSorted: true
  };

  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, PROVIDER_NAME);
    _CompositeClosureHelper2.default.event(publicAPI, model, 'FieldChange');
    _CompositeClosureHelper2.default.get(publicAPI, model, ['fieldsSorted']);
    _CompositeClosureHelper2.default.set(publicAPI, model, ['fieldsSorted']);

    fieldProvider(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});