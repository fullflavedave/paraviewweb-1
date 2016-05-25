'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = capitalize;
exports.isA = isA;
exports.destroy = destroy;
exports.event = event;
exports.newInstance = newInstance;
// ----------------------------------------------------------------------------
// capitilze provided string
// ----------------------------------------------------------------------------

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ----------------------------------------------------------------------------
// Add isA function and register your class name
// ----------------------------------------------------------------------------

function isA(publicAPI) {
  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var name = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (!model.isA) {
    model.isA = [];
  }

  if (name) {
    model.isA.push(name);
  }

  if (!publicAPI.isA) {
    publicAPI.isA = function (className) {
      return model.isA.indexOf(className) !== -1;
    };
  }
}

// ----------------------------------------------------------------------------
// Add destroy function
// ----------------------------------------------------------------------------

function destroy(publicAPI) {
  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (!publicAPI.destroy) {
    publicAPI.destroy = function () {
      Object.keys(model).forEach(function (field) {
        return delete model[field];
      });

      // Flag the instance beeing deleted
      model.deleted = true;
    };
  }
}

// ----------------------------------------------------------------------------
// Event handling: onXXX(callback), fireXXX(args...)
// ----------------------------------------------------------------------------

function event(publicAPI, model, eventName) {
  var callbacks = [];
  var previousDelete = publicAPI.destroy;

  function off(index) {
    callbacks[index] = null;
  }

  function on(index) {
    function unsubscribe() {
      off(index);
    }
    return Object.freeze({ unsubscribe: unsubscribe });
  }

  publicAPI['fire' + capitalize(eventName)] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (model.deleted) {
      console.log('instance deleted - can not call any method');
      return;
    }

    callbacks.forEach(function (callback) {
      return callback && callback.apply(publicAPI, args);
    });
  };

  publicAPI['on' + capitalize(eventName)] = function (callback) {
    if (model.deleted) {
      console.log('instance deleted - can not call any method');
      return null;
    }

    var index = callbacks.length;
    callbacks.push(callback);
    return on(index);
  };

  publicAPI.destroy = function () {
    previousDelete();
    callbacks.forEach(function (el, index) {
      return off(index);
    });
  };
}

// ----------------------------------------------------------------------------
// newInstance
// ----------------------------------------------------------------------------

function newInstance(extend) {
  return function () {
    var initialValues = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var model = {};
    var publicAPI = {};
    extend(publicAPI, model, initialValues);
    return Object.freeze(publicAPI);
  };
}

exports.default = {
  newInstance: newInstance,
  destroy: destroy,
  isA: isA,
  event: event
};