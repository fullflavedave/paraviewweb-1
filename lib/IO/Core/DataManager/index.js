define(['exports', 'monologue.js', './request', './pattern'], function (exports, _monologue, _request, _pattern) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _monologue2 = _interopRequireDefault(_monologue);

  var _request2 = _interopRequireDefault(_request);

  var _pattern2 = _interopRequireDefault(_pattern);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var typeFnMap = {
    json: _request2.default.fetchJSON,
    text: _request2.default.fetchTxt,
    blob: _request2.default.fetchBlob,
    arraybuffer: _request2.default.fetchArray,
    array: _request2.default.fetchArray
  };

  // Internal helper that return the current time
  function ts() {
    return new Date().getTime();
  }

  function updateDataSize(data) {
    if (data.type === 'json') {
      data.size = JSON.stringify(data.data).length;
    } else if (data.type === 'blob') {
      data.size = data.data.size;
    } else {
      data.size = data.data.length;
    }
    return data.size;
  }

  // Should use converter
  // flipArrayEndianness = function(array) {
  //   var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
  //   for (var i=0; i<array.byteLength; i+=array.BYTES_PER_ELEMENT) {
  //     for (var j=i+array.BYTES_PER_ELEMENT-1, k=i; j>k; j--, k++) {
  //       var tmp = u8[k];
  //       u8[k] = u8[j];
  //       u8[j] = tmp;
  //     }
  //   }
  //   return array;
  // }

  var DataManager = function () {
    function DataManager() {
      var cacheSize = arguments.length <= 0 || arguments[0] === undefined ? 1000000000 : arguments[0];

      _classCallCheck(this, DataManager);

      this.pattern = new _pattern2.default();
      this.keyToTypeMap = {};
      this.cacheSize = cacheSize;
      this.cacheData = {
        cache: {},
        modified: 0,
        ts: 0,
        size: 0
      };
    }

    _createClass(DataManager, [{
      key: 'destroy',
      value: function destroy() {
        this.off();
        this.clear();
      }
    }, {
      key: 'fetch',
      value: function fetch(key, options) {
        var _this = this;

        var notificationTopic = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        var url = options ? this.pattern.getValue(key, options) : key,
            dataCached = this.cacheData.cache[url];

        if (dataCached) {
          if (!dataCached.pending) {
            this.cacheData.ts = dataCached.ts = ts();

            // Trigger the event after the return
            setTimeout(function () {
              var array = dataCached.keysToNotify || [key],
                  count = array.length;

              delete dataCached.keysToNotify;

              while (count) {
                count -= 1;
                _this.emit(array[count], dataCached);
              }

              if (notificationTopic) {
                _this.emit(notificationTopic, dataCached);
              }
            }, 0);
          } else {
            dataCached.keysToNotify.push(key);
            if (notificationTopic) {
              dataCached.keysToNotify.push(notificationTopic);
            }
          }
        } else {
          (function () {
            // Run Garbage collector to free memory if need be
            _this.gc();

            // Prevent double fetch
            _this.cacheData.cache[url] = {
              pending: true,
              keysToNotify: [key]
            };

            if (notificationTopic) {
              _this.cacheData.cache[url].keysToNotify.push(notificationTopic);
            }

            // Need to fetch the data on the web
            var self = _this,
                typeFnMime = _this.keyToTypeMap[key],
                type = typeFnMime[0],
                fn = typeFnMime[1],
                mimeType = typeFnMime[2],
                callback = function callback(error, data) {
              if (error) {
                delete self.cacheData.cache[url];
                self.emit(key, {
                  error: error,
                  data: {
                    key: key, options: options, url: url, typeFnMime: typeFnMime
                  }
                });
                return;
              }

              dataCached = {
                data: data,
                type: type,
                requestedURL: url,
                pending: false
              };

              // Handle internal url for image blob
              if (mimeType && mimeType.indexOf('image') !== -1) {
                dataCached.url = window.URL.createObjectURL(data);
              }

              // Update memory usage
              self.cacheData.size += updateDataSize(dataCached);

              // Update ts
              self.cacheData.modified = self.cacheData.ts = dataCached.ts = ts();

              // Trigger the event
              var array = self.cacheData.cache[url].keysToNotify;
              var count = array.length;

              // Store it in the cache
              self.cacheData.cache[url] = dataCached;

              while (count) {
                count -= 1;
                self.emit(array[count], dataCached);
              }
            };

            if (mimeType) {
              fn(url, mimeType, callback);
            } else {
              fn(url, callback);
            }
          })();
        }

        return url;
      }
    }, {
      key: 'fetchURL',
      value: function fetchURL(url, type, mimeType) {
        var notificationTopic = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        this.keyToTypeMap[url] = [type, typeFnMap[type], mimeType];
        return this.fetch(url, null, notificationTopic);
      }
    }, {
      key: 'get',
      value: function get(url, freeCache) {
        var dataObj = this.cacheData.cache[url];
        if (freeCache) {
          this.free(url);
        }
        return dataObj;
      }
    }, {
      key: 'free',
      value: function free(url) {
        var dataCached = this.cacheData.cache[url];
        if (dataCached && dataCached.url) {
          window.URL.revokeObjectURL(dataCached.url);
          delete dataCached.url;
        }

        delete this.cacheData.cache[url];
        this.off(url);
      }
    }, {
      key: 'registerURL',
      value: function registerURL(key, filePattern, type, mimeType) {
        this.pattern.registerPattern(key, filePattern);
        this.keyToTypeMap[key] = [type, typeFnMap[type], mimeType];
      }
    }, {
      key: 'unregisterURL',
      value: function unregisterURL(key) {
        this.pattern.unregisterPattern(key);
        delete this.keyToTypeMap[key];
        this.off(key);
      }
    }, {
      key: 'clear',
      value: function clear() {
        var urlToDelete = [];
        Object.keys(this.cacheData.cache).forEach(function (url) {
          urlToDelete.push(url);
        });

        var count = urlToDelete.length;
        while (count) {
          count -= 1;
          this.free(urlToDelete[count]);
        }
        this.cacheData.size = 0;
      }
    }, {
      key: 'gc',
      value: function gc() {
        if (this.cacheData.size > this.cacheSize) {
          console.log('Free cache memory', this.cacheData.size);
          this.clear();
        }
      }
    }, {
      key: 'setCacheSize',
      value: function setCacheSize(sizeBeforeGC) {
        this.cacheSize = sizeBeforeGC;
      }
    }, {
      key: 'getCacheSize',
      value: function getCacheSize() {
        return this.cacheSize;
      }
    }, {
      key: 'getMemoryUsage',
      value: function getMemoryUsage() {
        return this.cacheData.size;
      }
    }]);

    return DataManager;
  }();

  exports.default = DataManager;


  _monologue2.default.mixInto(DataManager);
});