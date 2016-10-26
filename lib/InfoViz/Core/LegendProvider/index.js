'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = undefined;
exports.createSortedIterator = createSortedIterator;
exports.extend = extend;

var _CompositeClosureHelper = require('../../../Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

var _shapes = require('./shapes');

var _shapes2 = _interopRequireDefault(_shapes);

var _ColorPalettes = require('../../../Common/Misc/ColorPalettes');

var _ColorPalettes2 = _interopRequireDefault(_ColorPalettes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Global
// ----------------------------------------------------------------------------

function convert(item, model) {
  var result = { color: item.colors };
  result.shape = model.legendShapes[item.shapes];
  return result;
}

function createSortedIterator(priorityOrder, propertyChoices, defaultValues) {
  var propertyKeys = Object.keys(propertyChoices);

  var prioritySizes = priorityOrder.map(function (name) {
    return propertyChoices[name].length;
  });
  var priorityIndex = prioritySizes.map(function (i) {
    return 0;
  });

  var get = function get() {
    var item = {};
    propertyKeys.forEach(function (name) {
      var idx = priorityOrder.indexOf(name);
      if (idx === -1) {
        item[name] = defaultValues[name];
      } else {
        item[name] = propertyChoices[name][priorityIndex[idx]];
      }
    });
    return item;
  };

  var next = function next() {
    var overflowIdx = 0;
    priorityIndex[overflowIdx] += 1;
    while (priorityIndex[overflowIdx] === prioritySizes[overflowIdx]) {
      // Handle overflow
      priorityIndex[overflowIdx] = 0;
      if (overflowIdx < priorityIndex.length) {
        overflowIdx += 1;
        priorityIndex[overflowIdx] += 1;
      }
    }
  };

  return { get: get, next: next };
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var STATIC = exports.STATIC = {
  shapes: _shapes2.default,
  palettes: _ColorPalettes2.default
};

// ----------------------------------------------------------------------------
// Legend Provider
// ----------------------------------------------------------------------------

function legendProvider(publicAPI, model) {
  publicAPI.addLegendEntry = function (name) {
    if (model.legendEntries.indexOf(name) === -1 && name) {
      model.legendEntries.push(name);
      model.legendDirty = true;
    }
  };

  publicAPI.removeLegendEntry = function (name) {
    if (model.legendEntries.indexOf(name) !== -1 && name) {
      model.legendEntries.splice(model.legendEntries.indexOf(name), 1);
      model.legendDirty = true;
    }
  };
  publicAPI.removeAllLegendEntry = function () {
    model.legendEntries = [];
    model.legendDirty = true;
  };

  publicAPI.assignLegend = function () {
    var newPriority = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    if (newPriority) {
      model.legendPriorities = newPriority;
      model.legendDirty = true;
    }
    if (model.legendDirty) {
      (function () {
        var shapesArray = Object.keys(model.legendShapes);
        model.legendDirty = false;
        model.legendMapping = {};

        if (model.legendPriorities && model.legendPriorities.length) {
          (function () {
            var defaultColor = model.legendColors[0];
            var defaultShape = shapesArray[0];

            var iterator = createSortedIterator(model.legendPriorities, { colors: model.legendColors, shapes: shapesArray }, { colors: defaultColor, shapes: defaultShape });

            model.legendEntries.forEach(function (name) {
              model.legendMapping[name] = convert(iterator.get(), model);
              iterator.next();
            });
          })();
        } else {
          model.legendEntries.forEach(function (name, idx) {
            model.legendMapping[name] = {
              color: model.legendColors[idx % model.legendColors.length],
              shape: model.legendShapes[shapesArray[idx % shapesArray.length]]
            };
          });
        }
      })();
    }
  };

  publicAPI.useLegendPalette = function (name) {
    var colorSet = _ColorPalettes2.default[name];
    if (colorSet) {
      model.legendColors = [].concat(colorSet);
      model.legendDirty = true;
    }
  };

  publicAPI.updateLegendSettings = function (settings) {
    ['legendShapes', 'legendColors', 'legendEntries', 'legendPriorities'].forEach(function (key) {
      if (settings[key]) {
        model[key] = [].concat(settings.key);
        model.legendDirty = true;
      }
    });
  };

  publicAPI.listLegendColorPalettes = function () {
    return Object.keys(_ColorPalettes2.default);
  };

  publicAPI.getLegend = function (name) {
    if (model.legendDirty) {
      publicAPI.assignLegend();
    }
    return model.legendMapping[name];
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  legendShapes: _shapes2.default,
  legendColors: [].concat(_ColorPalettes2.default.Paired),
  legendEntries: [],
  legendPriorities: ['shapes', 'colors'],
  legendMapping: {},
  legendDirty: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _CompositeClosureHelper2.default.destroy(publicAPI, model);
  _CompositeClosureHelper2.default.isA(publicAPI, model, 'LegendProvider');

  legendProvider(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);