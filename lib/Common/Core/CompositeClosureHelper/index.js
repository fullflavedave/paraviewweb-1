'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = capitalize;
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
// Basic setter
// ----------------------------------------------------------------------------

function set(publicAPI) {
  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var names = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  names.forEach(function (name) {
    publicAPI['set' + capitalize(name)] = function (value) {
      model[name] = value;
    };
  });
}

// ----------------------------------------------------------------------------
// Basic getter
// ----------------------------------------------------------------------------

function get(publicAPI) {
  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var names = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  names.forEach(function (name) {
    publicAPI['get' + capitalize(name)] = function () {
      return model[name];
    };
  });
}

// ----------------------------------------------------------------------------
// Add destroy function
// ----------------------------------------------------------------------------

function destroy(publicAPI) {
  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var previousDestroy = publicAPI.destroy;

  if (!model.subscriptions) {
    model.subscriptions = [];
  }

  publicAPI.destroy = function () {
    if (previousDestroy) {
      previousDestroy();
    }
    while (model.subscriptions && model.subscriptions.length) {
      model.subscriptions.pop().unsubscribe();
    }
    Object.keys(model).forEach(function (field) {
      delete model[field];
    });

    // Flag the instance beeing deleted
    model.deleted = true;
  };
}

// ----------------------------------------------------------------------------
// Event handling: onXXX(callback), fireXXX(args...)
// ----------------------------------------------------------------------------

function event(publicAPI, model, eventName) {
  var asynchrounous = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  var callbacks = [];
  var previousDestroy = publicAPI.destroy;

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

    function processCallbacks() {
      callbacks.forEach(function (callback) {
        if (callback) {
          try {
            callback.apply(publicAPI, args);
          } catch (errObj) {
            console.log('Error event:', eventName, errObj);
          }
        }
      });
    }

    if (asynchrounous) {
      setImmediate(processCallbacks);
    } else {
      processCallbacks();
    }
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
    previousDestroy();
    callbacks.forEach(function (el, index) {
      return off(index);
    });
  };
}

// ----------------------------------------------------------------------------
// Fetch handling: setXXXFetchCallback / return { addRequest }
// ----------------------------------------------------------------------------
function fetch(publicAPI, model, name) {
  var fetchCallback = null;
  var requestQueue = [];

  publicAPI['set' + capitalize(name) + 'FetchCallback'] = function (fetchMethod) {
    if (requestQueue.length) {
      fetchMethod(requestQueue);
    }
    fetchCallback = fetchMethod;
  };

  return {
    addRequest: function addRequest(request) {
      requestQueue.push(request);
      if (fetchCallback) {
        fetchCallback(requestQueue);
      }
    },
    resetRequests: function resetRequests(requestList) {
      while (requestQueue.length) {
        requestQueue.pop();
      }
      if (requestList) {
        // Rebuild request list
        requestList.forEach(function (req) {
          requestQueue.push(req);
        });
        // Also trigger a request
        if (fetchCallback) {
          fetchCallback(requestQueue);
        }
      }
    }
  };
}

// ----------------------------------------------------------------------------
// Dynamic array handler
//   - add${xxx}(item)
//   - remove${xxx}(item)
//   - get${xxx}() => [items...]
//   - removeAll${xxx}()
// ----------------------------------------------------------------------------

function dynamicArray(publicAPI, model, name) {
  if (!model[name]) {
    model[name] = [];
  }

  publicAPI['set' + capitalize(name)] = function (items) {
    model[name] = [].concat(items);
  };

  publicAPI['add' + capitalize(name)] = function (item) {
    model[name].push(item);
  };

  publicAPI['remove' + capitalize(name)] = function (item) {
    var index = model[name].indexOf(item);
    model[name].splice(index, 1);
  };

  publicAPI['get' + capitalize(name)] = function () {
    return model[name];
  };

  publicAPI['removeAll' + capitalize(name)] = function () {
    return model[name] = [];
  };
}

// ----------------------------------------------------------------------------
// Chain function calls
// ----------------------------------------------------------------------------

function chain() {
  for (var _len2 = arguments.length, fn = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fn[_key2] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return fn.filter(function (i) {
      return !!i;
    }).forEach(function (i) {
      return i.apply(undefined, args);
    });
  };
}

// ----------------------------------------------------------------------------
// Data Subscription
//   => dataHandler = {
//         // Set of default values you would expect in your metadata
//         defaultMetadata: {
//            numberOfBins: 32,
//         },
//
//         // Method used internally to store the data
//         set(model, data) { return !!sameAsBefore; }, // Return true if nothing has changed
//
//         // Method used internally to extract the data from the cache based on a given subscription
//         // This should return null/undefined if the data is not available (yet).
//         get(model, request, dataChanged) {},
//      }
// ----------------------------------------------------------------------------
// Methods generated with dataName = 'mutualInformation'
// => publicAPI
//     - onMutualInformationSubscriptionChange(callback) => subscription[unsubscribe() + update(variables = [], metadata = {})]
//     - fireMutualInformationSubscriptionChange(request)
//     - subscribeToMutualInformation(onDataReady, variables = [], metadata = {})
//     - setMutualInformation(data)
//     - destroy()
// ----------------------------------------------------------------------------

function dataSubscriber(publicAPI, model, dataName, dataHandler) {
  // Private members
  var dataSubscriptions = [];
  var eventName = dataName + 'SubscriptionChange';
  var fireMethodName = 'fire' + capitalize(eventName);
  var dataContainerName = dataName + '_storage';

  // Add data container to model if not exist
  if (!model[dataContainerName]) {
    model[dataContainerName] = {};
  }

  // Add event handling methods
  event(publicAPI, model, eventName);

  function off() {
    var count = dataSubscriptions.length;
    while (count) {
      count -= 1;
      dataSubscriptions[count] = null;
    }
  }

  // Internal function that will notify any subscriber with its data in a synchronous manner
  function flushDataToListener(dataListener, dataChanged) {
    try {
      if (dataListener) {
        var dataToForward = dataHandler.get(model[dataContainerName], dataListener.request, dataChanged);
        if (dataToForward && JSON.stringify(dataToForward) !== dataListener.request.lastPush) {
          dataListener.request.lastPush = JSON.stringify(dataToForward);
          dataListener.onDataReady(dataToForward);
        }
      }
    } catch (err) {
      console.log('flush ' + dataName + ' error caught:', err);
    }
  }

  // onDataReady function will be called each time the setXXX method will be called and
  // when the actual subscription correspond to the data that has been set.
  // This is performed synchronously.
  publicAPI['subscribeTo' + capitalize(dataName)] = function (onDataReady) {
    var variables = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var metadata = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var id = dataSubscriptions.length;
    var request = {
      id: id,
      variables: variables,
      metadata: Object.assign({}, dataHandler.defaultMetadata, metadata)
    };
    var dataListener = { onDataReady: onDataReady, request: request };
    dataSubscriptions.push(dataListener);
    publicAPI[fireMethodName](request);
    flushDataToListener(dataListener, null);
    return {
      unsubscribe: function unsubscribe() {
        request.action = 'unsubscribe';
        publicAPI[fireMethodName](request);
        dataSubscriptions[id] = null;
      },
      update: function update(vars, meta) {
        request.variables = [].concat(vars);
        request.metadata = Object.assign({}, request.metadata, meta);
        publicAPI[fireMethodName](request);
        flushDataToListener(dataListener, null);
      }
    };
  };

  // Method use to store data
  publicAPI['set' + capitalize(dataName)] = function (data) {
    // Process all subscription to see if we can trigger a notification
    if (!dataHandler.set(model[dataContainerName], data)) {
      dataSubscriptions.forEach(function (dataListener) {
        return flushDataToListener(dataListener, data);
      });
    }
  };

  publicAPI.destroy = chain(off, publicAPI.destroy);
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
  chain: chain,
  dataSubscriber: dataSubscriber,
  destroy: destroy,
  dynamicArray: dynamicArray,
  event: event,
  fetch: fetch,
  get: get,
  isA: isA,
  newInstance: newInstance,
  set: set
};