'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.localStorageAvailable = localStorageAvailable;
exports.extend = extend;

var _CompositeClosureHelper = require('../../../Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */

function localStorageAvailable() {
  try {
    if (!window.localStorage) {
      return false;
    }
    var storage = window.localStorage;
    var x = '__storage_test__';
    storage.setItem(x, x);
    var storedX = storage.getItem(x);
    if (x !== storedX) {
      return false;
    }
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

// ----------------------------------------------------------------------------
// Persistence Provider
// ----------------------------------------------------------------------------

function persistentStateProvider(publicAPI, model) {
  if (!model.persistentStateImpl) {
    if (localStorageAvailable()) {
      model.persistentStateImpl = {
        getState: function getState(key) {
          var strVal = window.localStorage[key];
          if (strVal === undefined) {
            return null;
          }
          return JSON.parse(strVal);
        },
        setState: function setState(key, value) {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      };
    } else {
      model.persistentStateImpl = {
        state: {},
        getState: function getState(key) {
          return model.persistentStateImpl.state[key];
        },
        setState: function setState(key, value) {
          model.persistentStateImpl.state[key] = value;
        }
      };
    }
  }

  // Provide this method an object that implements getState(key) and setState(key, value)
  publicAPI.setImplementation = function (impl) {
    model.persistentStateImpl = impl;
  };

  publicAPI.getPersistentState = function (key) {
    return model.persistentStateImpl.getState(key);
  };

  publicAPI.setPersistentState = function (key, value) {
    model.persistentStateImpl.setState(key, value);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _CompositeClosureHelper2.default.destroy(publicAPI, model);
  _CompositeClosureHelper2.default.isA(publicAPI, model, 'PersistentStateProvider');

  persistentStateProvider(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend, localStorageAvailable: localStorageAvailable };