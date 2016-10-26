define(['exports', '../../../Common/Core/CompositeClosureHelper', './pmi'], function (exports, _CompositeClosureHelper, _pmi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.extend = extend;

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _pmi2 = _interopRequireDefault(_pmi);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // ----------------------------------------------------------------------------
  // Global
  // ----------------------------------------------------------------------------

  function listToPair() {
    var list = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    var size = list.length;
    var pairList = [];
    list.forEach(function (name, idx) {
      for (var i = idx; i < size; i++) {
        pairList.push([name, list[i]]);
      }
    });
    return pairList;
  }

  function unique(list) {
    return list.sort().filter(function (item, index, array) {
      return !index || item !== array[index - 1];
    });
  }

  // ----------------------------------------------------------------------------
  // Mutual Information Provider
  // ----------------------------------------------------------------------------

  function mutualInformationProvider(publicAPI, model) {
    var hasData = false;
    var onMutualInformationReady = publicAPI.onMutualInformationReady;
    var mutualInformationData = _pmi2.default.initializeMutualInformationData();
    var deltaHandling = {
      added: [],
      removed: [],
      modified: [],
      previousMTime: {},
      currentMTime: {},
      processed: true
    };

    function updateHistogram2D(histograms) {
      // even if histograms only has maxCount = 0, run through PMI.updateMI
      // so deltaHandling.removed array is handled properly.
      var invalidAxis = [];
      // Extract mtime
      deltaHandling.modified = [];
      deltaHandling.previousMTime = deltaHandling.currentMTime;
      deltaHandling.currentMTime = {};
      if (Object.keys(histograms).length > 1) {
        model.mutualInformationParameterNames.forEach(function (name) {
          if (histograms[name] && histograms[name][name]) {
            // Validate range
            if (histograms[name][name].x.delta === 0) {
              invalidAxis.push(name);
              deltaHandling.currentMTime[name] = 0;
            } else {
              deltaHandling.currentMTime[name] = histograms[name][name].x.mtime;
            }

            if (deltaHandling.added.indexOf(name) === -1 && deltaHandling.currentMTime[name] && (deltaHandling.previousMTime[name] || 0) < deltaHandling.currentMTime[name]) {
              deltaHandling.modified.push(name);
            }
          }
        });
      }
      // Check mutualInformationParameterNames are consitent with the current set of data
      // if not just for the next notification...
      try {
        _pmi2.default.updateMutualInformation(mutualInformationData, [].concat(deltaHandling.added, deltaHandling.modified), [].concat(deltaHandling.removed, invalidAxis), histograms);

        // Push the new mutual info
        deltaHandling.processed = true;
        hasData = true;
        publicAPI.fireMutualInformationReady(mutualInformationData);
      } catch (e) {
        console.log('PMI error', e);
      }
    }

    publicAPI.onMutualInformationReady = function (callback) {
      if (hasData) {
        callback(mutualInformationData);
      }
      return onMutualInformationReady(callback);
    };

    publicAPI.setHistogram2dProvider = function (provider) {
      if (model.histogram2dProviderSubscription) {
        model.histogram2dProviderSubscription.unsubscribe();
      }
      model.histogram2dProvider = provider;
      if (provider) {
        model.histogram2dProviderSubscription = provider.subscribeToHistogram2D(updateHistogram2D, listToPair(model.mutualInformationParameterNames), { symmetric: true, partial: false });
      }
    };

    publicAPI.setMutualInformationParameterNames = function (names) {
      if (deltaHandling.processed) {
        deltaHandling.added = names.filter(function (name) {
          return model.mutualInformationParameterNames.indexOf(name) === -1;
        });
        deltaHandling.removed = model.mutualInformationParameterNames.filter(function (name) {
          return names.indexOf(name) === -1;
        });
      } else {
        // We need to add to it
        deltaHandling.added = [].concat(deltaHandling.added, names.filter(function (name) {
          return model.mutualInformationParameterNames.indexOf(name) === -1;
        }));
        deltaHandling.removed = [].concat(deltaHandling.removed, model.mutualInformationParameterNames.filter(function (name) {
          return names.indexOf(name) === -1;
        }));
      }

      // Ensure uniqueness
      deltaHandling.added = unique(deltaHandling.added);
      deltaHandling.removed = unique(deltaHandling.removed);

      deltaHandling.processed = false;
      model.mutualInformationParameterNames = [].concat(names);

      if (model.histogram2dProviderSubscription) {
        model.histogram2dProviderSubscription.update(listToPair(model.mutualInformationParameterNames));
      }
    };
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {
    // mutualInformationData: null,
    mutualInformationParameterNames: []
  };

  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, 'MutualInformationProvider');
    _CompositeClosureHelper2.default.get(publicAPI, model, ['histogram2dProvider']);
    _CompositeClosureHelper2.default.event(publicAPI, model, 'mutualInformationReady');

    mutualInformationProvider(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});