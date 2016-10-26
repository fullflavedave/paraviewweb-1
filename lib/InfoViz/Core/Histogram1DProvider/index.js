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
// Histogram 1D Provider
// ----------------------------------------------------------------------------

/*
  Data Format: Below is an example of the expected histogram 1D data format

  {
    "name": "points per game",
    "min": 0,
    "max": 32,
    "counts": [10, 4, 0, 0, 13, ... ]
  }
*/

function extend(publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, initialValues);

  _CompositeClosureHelper2.default.destroy(publicAPI, model);
  _CompositeClosureHelper2.default.isA(publicAPI, model, 'Histogram1DProvider');
  _CompositeClosureHelper2.default.dataSubscriber(publicAPI, model, 'histogram1D', {
    defaultMetadata: {
      numberOfBins: 32,
      partial: true
    },
    set: function set(storage, data) {
      var numberOfBins = data.counts.length;
      if (!storage[numberOfBins]) {
        storage[numberOfBins] = {};
      }
      var binStorage = storage[numberOfBins];

      // Ensure that empty range histogram to only fill the first bin
      if (data.min === data.max) {
        (function () {
          var totalCount = data.counts.reduce(function (a, b) {
            return a + b;
          }, 0);
          data.counts = data.counts.map(function (v, i) {
            return i ? 0 : totalCount;
          });
        })();
      }

      var sameAsBefore = JSON.stringify(data) === JSON.stringify(binStorage[data.name]);
      binStorage[data.name] = data;

      return sameAsBefore;
    },
    get: function get(storage, request, dataChanged) {
      var numberOfBins = request.metadata.numberOfBins;

      var binStorage = storage[numberOfBins];
      var returnedData = {};
      var count = 0;
      request.variables.forEach(function (name) {
        if (binStorage && binStorage[name]) {
          count += 1;
          returnedData[name] = binStorage[name];
        }
      });
      if (count === request.variables.length || request.metadata.partial && count > 0) {
        return returnedData;
      }
      return null;
    }
  });
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };