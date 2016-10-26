'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _CompositeClosureHelper = require('../../../Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

var _dataHelper = require('./dataHelper');

var _dataHelper2 = _interopRequireDefault(_dataHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Selection Provider
// ----------------------------------------------------------------------------

function selectionProvider(publicAPI, model) {
  var dataSubscriptions = [];

  if (!model.selectionData) {
    model.selectionData = {};
  }
  if (!model.selectionMetaData) {
    model.selectionMetaData = {};
  }

  function off() {
    var count = dataSubscriptions.length;
    while (count) {
      count -= 1;
      dataSubscriptions[count] = null;
    }
  }

  function flushDataToListener(dataListener, dataChanged) {
    try {
      if (dataListener) {
        var event = _dataHelper2.default.getNotificationData(model.selectionData, dataListener.request);
        if (event) {
          if (dataChanged && dataChanged.type === dataListener.request.type) {
            dataListener.onDataReady(event);
          } else if (!dataChanged) {
            dataListener.onDataReady(event);
          }
        }
      }
    } catch (err) {
      console.log('flushDataToListener error caught:', err);
    }
  }

  // Method use to store received data
  publicAPI.setSelectionData = function (data) {
    _dataHelper2.default.set(model.selectionData, data);

    // Process all subscription to see if we can trigger a notification
    dataSubscriptions.forEach(function (listener) {
      return flushDataToListener(listener, data);
    });
  };

  // Method use to access cached data. Will return undefined if not available
  publicAPI.getSelectionData = function (query) {
    return _dataHelper2.default.get(model.selectionData, query);
  };

  // Use to extend data subscription
  publicAPI.updateSelectionMetadata = function (addon) {
    model.selectionMetaData[addon.type] = Object.assign({}, model.selectionMetaData[addon.type], addon.metadata);
  };

  // Get metadata for a given data type
  publicAPI.getSelectionMetadata = function (type) {
    return model.selectionMetaData[type];
  };

  // --------------------------------

  publicAPI.setSelection = function (selection) {
    model.selection = selection;
    publicAPI.fireSelectionChange(selection);
  };

  // --------------------------------

  // annotation = {
  //    selection: {...},
  //    score: [0],
  //    weight: 1,
  //    rationale: 'why not...',
  // }

  publicAPI.setAnnotation = function (annotation) {
    model.annotation = annotation;
    if (annotation.selection) {
      publicAPI.setSelection(annotation.selection);
    } else {
      annotation.selection = model.selection;
    }
    model.shouldCreateNewAnnotation = false;
    publicAPI.fireAnnotationChange(annotation);
  };

  // --------------------------------

  publicAPI.shouldCreateNewAnnotation = function () {
    return model.shouldCreateNewAnnotation;
  };
  publicAPI.setCreateNewAnnotationFlag = function (shouldCreate) {
    return model.shouldCreateNewAnnotation = shouldCreate;
  };

  // --------------------------------
  // When a new selection is made, data dependent on that selection will be pushed
  // to subscribers.
  // A subscriber should save the return value and call update() when they need to
  // change the variables or meta data which is pushed to them.
  publicAPI.subscribeToDataSelection = function (type, onDataReady) {
    var variables = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    var metadata = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var id = dataSubscriptions.length;
    var request = { id: id, type: type, variables: variables, metadata: metadata };
    var dataListener = { onDataReady: onDataReady, request: request };
    dataSubscriptions.push(dataListener);
    publicAPI.fireDataSelectionSubscriptionChange(request);
    flushDataToListener(dataListener, null);
    return {
      unsubscribe: function unsubscribe() {
        request.action = 'unsubscribe';
        publicAPI.fireDataSelectionSubscriptionChange(request);
        dataSubscriptions[id] = null;
      },
      update: function update(vars, meta) {
        request.variables = [].concat(vars);
        request.metadata = Object.assign({}, request.metadata, meta);
        publicAPI.fireDataSelectionSubscriptionChange(request);
        flushDataToListener(dataListener, null);
      }
    };
  };

  publicAPI.destroy = _CompositeClosureHelper2.default.chain(off, publicAPI.destroy);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // selection: null,
  // selectionData: null,
  // selectionMetaData: null,
  shouldCreateNewAnnotation: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _CompositeClosureHelper2.default.destroy(publicAPI, model);
  _CompositeClosureHelper2.default.isA(publicAPI, model, 'SelectionProvider');
  _CompositeClosureHelper2.default.get(publicAPI, model, ['selection', 'annotation']);
  _CompositeClosureHelper2.default.event(publicAPI, model, 'selectionChange');
  _CompositeClosureHelper2.default.event(publicAPI, model, 'annotationChange');
  _CompositeClosureHelper2.default.event(publicAPI, model, 'dataSelectionSubscriptionChange');

  selectionProvider(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };