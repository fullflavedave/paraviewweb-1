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

  // ----------------------------------------------------------------------------
  // Expected Data Format for Histogram2D
  // ----------------------------------------------------------------------------
  //
  // {
  //   "x": {
  //     delta: 3.5,
  //     extent: [0, 35],
  //     name: "Name of X",
  //   },
  //   "y": {
  //     delta: 1,
  //     extent: [0, 10],
  //     name: "Name of Y",
  //   },
  //   "bins": [
  //     { x: 3.5, y: 5, count: 46 }, ...
  //   ]
  // }
  //
  // ----------------------------------------------------------------------------

  // ----------------------------------------------------------------------------
  // Global
  // ----------------------------------------------------------------------------

  function flipHistogram(histo2d) {
    var newHisto2d = {
      bins: histo2d.bins.map(function (bin) {
        var x = bin.x;
        var y = bin.y;
        var count = bin.count;

        return {
          x: y,
          y: x,
          count: count
        };
      }),
      x: histo2d.y,
      y: histo2d.x,
      maxCount: histo2d.maxCount,
      numberOfBins: histo2d.numberOfBins
    };

    return newHisto2d;
  }

  // ----------------------------------------------------------------------------
  // Histogram 2D Provider
  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, 'Histogram2DProvider');
    _CompositeClosureHelper2.default.dataSubscriber(publicAPI, model, 'histogram2D', {
      defaultMetadata: {
        numberOfBins: 32,
        partial: true
      },
      set: function set(storage, data) {
        var binSize = data.numberOfBins || 'default';
        if (!storage[binSize]) {
          storage[binSize] = {};
        }
        var binStorage = storage[binSize];
        if (!binStorage[data.x.name]) {
          binStorage[data.x.name] = {};
        }
        if (!binStorage[data.y.name]) {
          binStorage[data.y.name] = {};
        }

        // Add maxCount
        var maxCount = 0;
        data.bins.forEach(function (item) {
          maxCount = maxCount < item.count ? item.count : maxCount;
        });
        data.maxCount = maxCount;

        var cleanedData = Object.assign({}, data, { annotationInfo: [] });
        var previousData = binStorage[data.x.name][data.y.name];

        var sameAsBefore = JSON.stringify(cleanedData) === JSON.stringify(previousData);

        binStorage[data.x.name][data.y.name] = cleanedData;
        binStorage[data.y.name][data.x.name] = flipHistogram(cleanedData);

        return sameAsBefore;
      },
      get: function get(storage, request, dataChanged) {
        var returnedData = {};
        var count = 0;
        var maxCount = 0;
        var numberOfBins = request.metadata.numberOfBins;

        var binStorage = storage[numberOfBins];
        var rangeConsistency = {};
        request.variables.forEach(function (axisPair) {
          if (!returnedData[axisPair[0]]) {
            returnedData[axisPair[0]] = {};
          }
          if (binStorage && binStorage[axisPair[0]] && binStorage[axisPair[0]][axisPair[1]]) {
            var hist2d = binStorage[axisPair[0]][axisPair[1]];

            // Look for range consistency within data
            if (hist2d.x.name && hist2d.y.name) {
              if (!rangeConsistency[hist2d.x.name]) {
                rangeConsistency[hist2d.x.name] = [];
              }
              rangeConsistency[hist2d.x.name].push(JSON.stringify(hist2d.x.extent));
              if (!rangeConsistency[hist2d.y.name]) {
                rangeConsistency[hist2d.y.name] = [];
              }
              rangeConsistency[hist2d.y.name].push(JSON.stringify(hist2d.y.extent));
            }
            count += 1;
            maxCount = maxCount < hist2d.maxCount ? hist2d.maxCount : maxCount;
            returnedData[axisPair[0]][axisPair[1]] = hist2d;
            if (request.metadata.symmetric) {
              if (!returnedData[axisPair[1]]) {
                returnedData[axisPair[1]] = {};
              }
              returnedData[axisPair[1]][axisPair[0]] = binStorage[axisPair[1]][axisPair[0]];
            }
          }
        });

        // Attach global maxCount
        returnedData.maxCount = maxCount;

        if (count === request.variables.length || request.metadata.partial && count > 0) {
          // Chech consistency
          var skip = false;
          Object.keys(rangeConsistency).forEach(function (name) {
            var values = rangeConsistency[name];
            values.sort();
            if (values.length > 1) {
              var a = values.pop();
              var b = values.shift();
              if (a !== b) {
                skip = true;
              }
            }
          });

          return skip ? null : returnedData;
        }

        return null;
      }
    });
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});