'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DataManager = require('../DataManager');

var _DataManager2 = _interopRequireDefault(_DataManager);

var _hasOwn = require('mout/object/hasOwn');

var _hasOwn2 = _interopRequireDefault(_hasOwn);

var _max = require('mout/object/max');

var _max2 = _interopRequireDefault(_max);

var _min = require('mout/object/min');

var _min2 = _interopRequireDefault(_min);

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _now = require('mout/src/time/now');

var _now2 = _interopRequireDefault(_now);

var _omit = require('mout/object/omit');

var _omit2 = _interopRequireDefault(_omit);

var _size = require('mout/object/size');

var _size2 = _interopRequireDefault(_size);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ============================================================================
var dataManager = new _DataManager2.default(),
    DEFAULT_KEY_NAME = '_';
// ============================================================================
var queryDataModelCounter = 0;
// ============================================================================

// Helper function used to handle next/previous when the loop function is 'reverse'
function deltaReverse(arg, increment) {
  var newIdx = arg.idx + arg.direction * increment;
  if (newIdx >= arg.values.length) {
    arg.direction *= -1; // Reverse direction
    newIdx = arg.values.length - 2;
  }

  if (newIdx < 0) {
    arg.direction *= -1; // Reverse direction
    newIdx = 1;
  }

  if (newIdx >= 0 && newIdx < arg.values.length) {
    arg.idx = newIdx;
  }

  return true;
}

// Helper function used to handle next/previous when the loop function is 'modulo'
function deltaModulo(arg, increment) {
  arg.idx = (arg.values.length + arg.idx + increment) % arg.values.length;
  return true;
}

// Helper function used to handle next/previous when the loop function is 'none'
function deltaNone(arg, increment) {
  var newIdx = arg.idx + increment;

  if (newIdx >= arg.values.length) {
    newIdx = arg.values.length - 1;
  }

  if (newIdx < 0) {
    newIdx = 0;
  }

  if (arg.idx !== newIdx) {
    arg.idx = newIdx;
    return true;
  }

  return false;
}

// QueryDataModel class definition

var QueryDataModel = function () {
  function QueryDataModel(jsonData, basepath) {
    var _this = this;

    _classCallCheck(this, QueryDataModel);

    this.originalData = jsonData;
    this.basepath = basepath; // Needed for cloning
    this.id = 'QueryDataModel_' + ++queryDataModelCounter + ' :';
    this.args = {};
    this.externalArgs = {};
    this.dataCount = {};
    this.categories = {};
    this.requests = [];
    this.keepAnimating = false;
    this.animationTimerId = 0;
    this.mouseListener = null;
    this.dataMetadata = {};
    this.lazyFetchRequest = null;

    this.playNext = function () {
      if (_this.keepAnimating) {
        (function () {
          var changeDetected = false;
          _this.lastPlay = +new Date();

          // Move all flagged arg to next()
          Object.keys(_this.args).forEach(function (argName) {
            if (_this.args[argName].anime) {
              changeDetected = _this.next(argName) || changeDetected;
            }
          });

          // Keep moving if change detected
          if (changeDetected) {
            // Get new data
            _this.lazyFetchData(); // FIXME may need a category
          } else {
              // Auto stop as nothing change
              _this.keepAnimating = false;
              _this.emit('state.change.play', {
                instance: _this
              });
            }
        })();
      } else {
        _this.emit('state.change.play', {
          instance: _this
        });
      }
    };

    var processRequest = function processRequest(request) {
      var dataToBroadcast = {},
          count = request.urls.length,
          hasPending = false,
          hasError = false;

      if (_this.animationTimerId !== 0) {
        clearTimeout(_this.animationTimerId);
        _this.animationTimerId = 0;
      }

      while (count--) {
        var item = request.urls[count];
        dataToBroadcast[item.key] = dataManager.get(item.url);
        if (dataToBroadcast[item.key]) {
          hasPending = hasPending || dataToBroadcast[item.key].pending;
        } else {
          hasError = true;
        }
      }

      if (hasPending) {
        // put the request back in the queue
        setImmediate(function () {
          _this.requests.push(request);
        });
      } else if (!hasError) {
        // We are good to go
        // Broadcast data to the category
        _this.emit(request.category, dataToBroadcast);

        // Trigger new fetch data if any lazyFetchData is pending
        if (_this.requests.length === 0 && _this.lazyFetchRequest) {
          _this.fetchData(_this.lazyFetchRequest);
          _this.lazyFetchRequest = null;
        }
      }

      // Handle animation if any
      if (_this.keepAnimating) {
        var ts = +new Date();
        _this.animationTimerId = setTimeout(_this.playNext, ts - _this.lastPlay > _this.deltaT ? 0 : _this.deltaT);
      }
    };

    var dataHandler = function dataHandler(data, envelope) {
      _this.dataCount[envelope.topic]++;

      // Pre-decode image urls
      if (data.url && data.type === 'blob' && data.data.type.indexOf('image') !== -1 && data.image === undefined) {
        data.image = new Image();
        data.image.src = data.url;
      }

      if (data.error) {
        _this.emit('error', envelope);
        return;
        // console.error('Error when fetching ' + envelope.topic);
      }

      // All fetched request are complete
      var minValue = (0, _min2.default)(_this.dataCount),
          maxValue = (0, _max2.default)(_this.dataCount),
          dataSize = (0, _size2.default)(_this.dataCount);

      if (minValue === maxValue && (dataSize === 1 ? minValue === 0 : true)) {
        // Handling requests after any re-queue
        setImmediate(function () {
          while (_this.requests.length) {
            processRequest(_this.requests.pop());
          }
        });
      }
    };

    // Flatten args
    Object.keys(jsonData.arguments).forEach(function (key) {
      var arg = jsonData.arguments[key];
      _this.args[key] = {
        label: arg.label ? arg.label : key,
        idx: arg.default ? arg.default : 0,
        direction: 1,
        anime: false,
        values: arg.values,
        ui: arg.ui ? arg.ui : 'list',
        delta: arg.loop ? arg.loop === 'reverse' ? deltaReverse : arg.loop === 'modulo' ? deltaModulo : deltaNone : deltaNone
      };
    });

    // Register all data urls
    jsonData.data.forEach(function (dataEntry) {
      var dataId = _this.id + dataEntry.name;

      // Register data metadata if any
      _this.dataMetadata[dataEntry.name] = dataEntry.metadata || {};

      // Fill categories with dataIds
      (dataEntry.categories || [DEFAULT_KEY_NAME]).forEach(function (category) {
        if ((0, _hasOwn2.default)(_this.categories, category)) {
          _this.categories[category].push(dataId);
        } else {
          _this.categories[category] = [dataId];
        }
      });

      // Register data handler + listener
      dataManager.registerURL(dataId, (dataEntry.absolute ? '' : basepath) + dataEntry.pattern, dataEntry.type, dataEntry.mimeType);
      dataManager.on(dataId, dataHandler);
      _this.dataCount[dataId] = 0;
    });

    // Data Exploration handling
    this.exploreState = {
      order: jsonData.arguments_order.map(function (f) {
        return f;
      }).reverse(), // Clone
      idxs: jsonData.arguments_order.map(function (i) {
        return 0;
      }), // Reset index
      sizes: jsonData.arguments_order.map(function (f) {
        return _this.getSize(f);
      }).reverse(), // Get Size
      onDataReady: true,
      animate: false
    };

    this.explorationSubscription = this.onDataChange(function () {
      if (_this.exploreState.animate && _this.exploreState.onDataReady) {
        setImmediate(function (_) {
          return _this.nextExploration();
        });
      }
    });
  }

  _createClass(QueryDataModel, [{
    key: 'getDataMetaData',
    value: function getDataMetaData(dataName) {
      return this.dataMetadata[dataName];
    }

    // Return the current set of arguments values

  }, {
    key: 'getQuery',
    value: function getQuery() {
      var _this2 = this;

      var query = {};

      Object.keys(this.args).forEach(function (key) {
        var arg = _this2.args[key];
        query[key] = arg.values[arg.idx];
      });

      // Add external args to the query too
      Object.keys(this.externalArgs).forEach(function (eKey) {
        query[eKey] = _this2.externalArgs[eKey];
      });

      return query;
    }

    // Fetch data for a given category or _ if none provided

  }, {
    key: 'fetchData',
    value: function fetchData() {
      var _this3 = this;

      var category = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_KEY_NAME : arguments[0];

      var dataToFetch = [],
          query = this.getQuery(),
          request = {
        urls: []
      };

      // fill the data to fetch
      if (category.name) {
        request.category = category.name;
        category.categories.forEach(function (cat) {
          if (_this3.categories[cat]) {
            dataToFetch = dataToFetch.concat(_this3.categories[cat]);
          }
        });
      } else if (this.categories[category]) {
        request.category = category;
        dataToFetch = dataToFetch.concat(this.categories[category]);
      }

      // Decrease the count and record the category request + trigger fetch
      if (dataToFetch.length) {
        this.requests.push(request);
      }

      dataToFetch.forEach(function (dataId) {
        _this3.dataCount[dataId]--;
        request.urls.push({
          key: dataId.slice(_this3.id.length),
          url: dataManager.fetch(dataId, query)
        });
      });
    }
  }, {
    key: 'lazyFetchData',
    value: function lazyFetchData() {
      var category = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_KEY_NAME : arguments[0];

      if (this.lazyFetchRequest || this.requests.length > 0) {
        this.lazyFetchRequest = category;
      } else {
        this.fetchData(category);
      }
    }

    // Got to the first value of a given attribute and return true if data has changed

  }, {
    key: 'first',
    value: function first(attributeName) {
      var arg = this.args[attributeName];

      if (arg && arg.idx !== 0) {
        arg.idx = 0;
        this.emit('state.change.first', {
          value: arg.values[arg.idx],
          idx: arg.idx,
          name: attributeName,
          instance: this
        });
        return true;
      }

      return false;
    }

    // Got to the last value of a given attribute and return true if data has changed

  }, {
    key: 'last',
    value: function last(attributeName) {
      var arg = this.args[attributeName],
          last = arg.values.length - 1;

      if (arg && arg.idx !== last) {
        arg.idx = last;
        this.emit('state.change.last', {
          value: arg.values[arg.idx],
          idx: arg.idx,
          name: attributeName,
          instance: this
        });
        return true;
      }

      return false;
    }

    // Got to the next value of a given attribute and return true if data has changed

  }, {
    key: 'next',
    value: function next(attributeName) {
      var arg = this.args[attributeName];
      if (arg && arg.delta(arg, +1)) {
        this.emit('state.change.next', {
          delta: 1,
          value: arg.values[arg.idx],
          idx: arg.idx,
          name: attributeName,
          instance: this
        });
        return true;
      }
      return false;
    }

    // Got to the previous value of a given attribute and return true if data has changed

  }, {
    key: 'previous',
    value: function previous(attributeName) {
      var arg = this.args[attributeName];
      if (arg && arg.delta(arg, -1)) {
        this.emit('state.change.previous', {
          delta: -1,
          value: arg.values[arg.idx],
          idx: arg.idx,
          name: attributeName,
          instance: this
        });
        return true;
      }
      return false;
    }

    // Set a value to an argument (must be in values) and return true if data has changed
    // If argument is not in the argument list. This will be added inside the external argument list.

  }, {
    key: 'setValue',
    value: function setValue(attributeName, value) {
      var arg = this.args[attributeName],
          newIdx = arg ? arg.values.indexOf(value) : 0;

      if (arg && newIdx !== -1 && newIdx !== arg.idx) {
        arg.idx = newIdx;
        this.emit('state.change.value', {
          value: arg.values[arg.idx],
          idx: arg.idx,
          name: attributeName,
          instance: this
        });
        return true;
      }

      if (arg === undefined && this.externalArgs[attributeName] !== value) {
        this.externalArgs[attributeName] = value;
        this.emit('state.change.value', {
          value: value,
          name: attributeName,
          external: true,
          instance: this
        });
        return true;
      }

      return false;
    }

    // Set a new index to an argument (must be in values range) and return true if data has changed

  }, {
    key: 'setIndex',
    value: function setIndex(attributeName, idx) {
      var arg = this.args[attributeName];

      if (arg && idx > -1 && idx < arg.values.length && arg.idx !== idx) {
        arg.idx = idx;
        this.emit('state.change.idx', {
          value: arg.values[arg.idx],
          idx: arg.idx,
          name: attributeName,
          instance: this
        });
        return true;
      }

      return false;
    }

    // Return the argument value or null if the argument was not found
    // If argument is not in the argument list.
    // We will also search inside the external argument list.

  }, {
    key: 'getValue',
    value: function getValue(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.values[arg.idx] : this.externalArgs[attributeName];
    }

    // Return the argument values list or null if the argument was not found

  }, {
    key: 'getValues',
    value: function getValues(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.values : null;
    }

    // Return the argument index or null if the argument was not found

  }, {
    key: 'getIndex',
    value: function getIndex(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.idx : null;
    }

    // Return the argument index or null if the argument was not found

  }, {
    key: 'getUiType',
    value: function getUiType(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.ui : null;
    }

    // Return the argument size or null if the argument was not found

  }, {
    key: 'getSize',
    value: function getSize(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.values.length : null;
    }

    // Return the argument label or null if the argument was not found

  }, {
    key: 'label',
    value: function label(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.label : null;
    }

    // Return the argument animation flag or false if the argument was not found

  }, {
    key: 'getAnimationFlag',
    value: function getAnimationFlag(attributeName) {
      var arg = this.args[attributeName];
      return arg ? arg.anime : false;
    }

    // Set the argument animation flag and return true if the value changed

  }, {
    key: 'setAnimationFlag',
    value: function setAnimationFlag(attributeName, state) {
      var arg = this.args[attributeName];

      if (arg && arg.anime !== state) {
        arg.anime = state;
        this.emit('state.change.animation', {
          animation: arg.anim,
          name: arg.name,
          instance: this
        });
        return true;
      }

      return false;
    }

    // Toggle the argument animation flag state and return the current state or
    // null if not found.

  }, {
    key: 'toggleAnimationFlag',
    value: function toggleAnimationFlag(attributeName) {
      var arg = this.args[attributeName];

      if (arg) {
        arg.anime = !arg.anime;
        this.emit('state.change.animation', {
          animation: arg.anim,
          name: arg.name,
          instance: this
        });
        return arg.anime;
      }

      return null;
    }

    // Check if one of the argument is currently active for the animation

  }, {
    key: 'hasAnimationFlag',
    value: function hasAnimationFlag() {
      var _this4 = this;

      var flag = false;
      Object.keys(this.args).forEach(function (key) {
        if (_this4.args[key].anime) {
          flag = true;
        }
      });
      return flag;
    }

    // Return true if an animation is currently running

  }, {
    key: 'isAnimating',
    value: function isAnimating() {
      return this.keepAnimating;
    }

    // Start/Stop an animation

  }, {
    key: 'animate',
    value: function animate(start) {
      var deltaT = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];

      // Update deltaT
      this.deltaT = deltaT;

      if (start !== this.keepAnimating) {
        this.keepAnimating = start;
        this.playNext();
      }
    }

    // Mouse handler if any base on the binding

  }, {
    key: 'getMouseListener',
    value: function getMouseListener() {
      var _this5 = this;

      if (this.mouseListener) {
        return this.mouseListener;
      }

      // Record last action time
      this.lastTime = {};
      this.newMouseTimeout = 250;

      // We need to create a mouse listener
      var self = this,
          actions = {};

      // Create an action map
      Object.keys(this.originalData.arguments).forEach(function (key) {
        var value = _this5.originalData.arguments[key];
        if (value.bind && value.bind.mouse) {
          Object.keys(value.bind.mouse).forEach(function (action) {
            var obj = (0, _omit2.default)(value.bind.mouse[action]);
            obj.name = key;
            obj.lastCoord = 0;
            if (obj.orientation === undefined) {
              obj.orientation = 1;
            }
            if (actions[action]) {
              actions[action].push(obj);
            } else {
              actions[action] = [obj];
            }
          });
        }
      });

      /* eslint-disable complexity */
      function processEvent(event, envelope) {
        var array = actions[event.topic],
            time = (0, _now2.default)(),
            newEvent = self.lastTime[event.topic] + self.newMouseTimeout < time,
            count = array.length,
            changeDetected = false,
            eventHandled = false;

        // Check all associated actions
        while (count--) {
          var item = array[count],
              deltaName = item.coordinate === 0 ? 'deltaX' : 'deltaY';

          if (newEvent) {
            item.lastCoord = 0;
          }

          if (item.modifier & event.modifier || item.modifier === event.modifier) {
            eventHandled = true;
            var delta = event[deltaName] - item.lastCoord;
            self.lastTime[event.topic] = time;

            if (Math.abs(delta) > item.step) {
              item.lastCoord = Number(event[deltaName]);

              if (item.orientation * delta > 0) {
                changeDetected = self.next(item.name) || changeDetected;
              } else {
                changeDetected = self.previous(item.name) || changeDetected;
              }
            }
          }
        }

        if (changeDetected) {
          self.lazyFetchData(); // FIXME category
        }

        return eventHandled;
      }
      /* eslint-enable complexity */

      this.mouseListener = {};
      Object.keys(actions).forEach(function (actionName) {
        _this5.mouseListener[actionName] = processEvent;
        _this5.lastTime[actionName] = (0, _now2.default)();
      });

      return this.mouseListener;
    }

    // Event helpers

  }, {
    key: 'onStateChange',
    value: function onStateChange(callback) {
      return this.on('state.change.*', callback);
    }
  }, {
    key: 'onDataChange',
    value: function onDataChange(callback) {
      return this.on(DEFAULT_KEY_NAME, callback);
    }

    // Return a new instance based on the same metadata and basepath

  }, {
    key: 'clone',
    value: function clone() {
      return new QueryDataModel(this.originalData, this.basepath);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();

      this.explorationSubscription.unsubscribe();
      this.explorationSubscription = null;
    }

    // Data exploration -----------------------------------------------------------

  }, {
    key: 'exploreQuery',
    value: function exploreQuery() {
      var start = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var _this6 = this;

      var fromBeguining = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
      var onDataReady = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      if (fromBeguining) {
        this.exploreState.idxs = this.exploreState.order.map(function (i) {
          return 0;
        });
      } else {
        this.exploreState.idxs = this.exploreState.order.map(function (field) {
          return _this6.getIndex(field);
        });
      }
      this.exploreState.onDataReady = onDataReady;
      this.exploreState.animate = start;

      // Start animation
      if (this.exploreState.animate) {
        this.nextExploration();
      }

      this.emit('state.change.exploration', {
        exploration: this.exploreState,
        instance: this
      });
    }
  }, {
    key: 'nextExploration',
    value: function nextExploration() {
      var _this7 = this;

      if (this.exploreState.animate) {
        // Update internal query
        this.exploreState.order.forEach(function (f, i) {
          _this7.setIndex(f, _this7.exploreState.idxs[i]);
        });

        // Move to next step
        var idxs = this.exploreState.idxs,
            sizes = this.exploreState.sizes;
        var count = idxs.length;

        // May overshoot
        idxs[count - 1]++;

        // Handle overshoot
        while (count--) {
          if (idxs[count] < sizes[count]) {
            // We are good
            continue;
          } else {
            // We need to move the index back up
            if (count > 0) {
              idxs[count] = 0;
              idxs[count - 1]++;
            } else {
              this.exploreState.animate = false;
              this.emit('state.change.exploration', {
                exploration: this.exploreState,
                instance: this
              });
              return this.exploreState.animate; // We are done
            }
          }
        }

        // Trigger the fetchData
        this.lazyFetchData();
      }
      return this.exploreState.animate;
    }
  }, {
    key: 'setCacheSize',
    value: function setCacheSize(sizeBeforeGC) {
      dataManager.cacheSize = sizeBeforeGC;
    }
  }, {
    key: 'getCacheSize',
    value: function getCacheSize() {
      return dataManager.cacheSize;
    }
  }, {
    key: 'getMemoryUsage',
    value: function getMemoryUsage() {
      return dataManager.cacheData.size;
    }
  }, {
    key: 'link',
    value: function link(queryDataModel) {
      var _this8 = this;

      var args = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var fetch = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      return queryDataModel.onStateChange(function (data, envelope) {
        if (data.name !== undefined && data.value !== undefined) {
          if (args === null || args.indexOf(data.name) !== -1) {
            if (_this8.setValue(data.name, data.value) && fetch) {
              _this8.lazyFetchData();
            }
          }
        }
      });
    }
  }]);

  return QueryDataModel;
}();

exports.default = QueryDataModel;


_monologue2.default.mixInto(QueryDataModel);