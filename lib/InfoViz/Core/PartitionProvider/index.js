'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _CompositeClosureHelper = require('../../../Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Partition Provider
// ----------------------------------------------------------------------------

function partitionProvider(publicAPI, model, fetchHelper) {
  // Private members
  var ready = publicAPI.firePartitionReady;
  delete publicAPI.firePartitionReady;

  // Protected members
  if (!model.partitionData) {
    model.partitionData = {};
  }

  // Return true if data is available
  publicAPI.loadPartition = function (field) {
    if (!model.partitionData[field]) {
      model.partitionData[field] = { pending: true };
      fetchHelper.addRequest(field);
      return false;
    }

    if (model.partitionData[field].pending) {
      return false;
    }

    if (model.partitionData[field].stale) {
      // stale means the client sent some data to the server,
      // and we need the server to return 'ground truth', even
      // though we have our version of the data right now.
      delete model.partitionData[field].stale;
      fetchHelper.addRequest(field);
      return true;
    }

    return true;
  };

  publicAPI.getPartition = function (field) {
    return model.partitionData[field];
  };
  // server sent us some data
  publicAPI.setPartition = function (field, data) {
    model.partitionData[field] = data;
    ready(field, data);
  };
  // client generated new data
  publicAPI.changePartition = function (field, data) {
    model.partitionData[field] = data;
    model.partitionData[field].stale = true;
    publicAPI.firePartitionChange(field, data);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // partitionData: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _CompositeClosureHelper2.default.destroy(publicAPI, model);
  _CompositeClosureHelper2.default.isA(publicAPI, model, 'PartitionProvider');
  // Change asynchronous default - immediate event tiggers data send to server, and server reply is async.
  _CompositeClosureHelper2.default.event(publicAPI, model, 'partitionChange', false);
  _CompositeClosureHelper2.default.event(publicAPI, model, 'partitionReady');
  var fetchHelper = _CompositeClosureHelper2.default.fetch(publicAPI, model, 'Partition');

  partitionProvider(publicAPI, model, fetchHelper);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };