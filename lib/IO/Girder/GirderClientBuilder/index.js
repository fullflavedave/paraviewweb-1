'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ----------------------------------------------------------------------------
var AUTH_CHANGE_TOPIC = 'girder.auth.change';
var BUSY_TOPIC = 'girder.busy';
var PROGRESS_TOPIC = 'girder.progress';
var EVENT_TOPIC = 'girder.notification';

var Observable = function Observable() {
  _classCallCheck(this, Observable);
};

_monologue2.default.mixInto(Observable);

var loginPromiseBuilder = function loginPromiseBuilder() {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};
var logoutPromiseBuilder = function logoutPromiseBuilder() {
  return new Promise(function (resolve, reject) {
    reject();
  });
};
// ----------------------------------------------------------------------------

function encodeQueryAsString() {
  var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var params = Object.keys(query).map(function (name) {
    return [encodeURIComponent(name), encodeURIComponent(query[name])].join('=');
  });
  return params.length ? '?' + params.join('&') : '';
}

// ----------------------------------------------------------------------------

function filterQuery() {
  var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var out = {};

  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  keys.forEach(function (key) {
    if (query[key] !== undefined && query[key] !== null) {
      out[key] = query[key];
    }
  });
  return out;
}

// ----------------------------------------------------------------------------

function mustContain() {
  var object = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var missingKeys = [],
      promise;

  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }

  keys.forEach(function (key) {
    if (object[key] === undefined) {
      missingKeys.push(key);
    }
  });
  if (missingKeys.length === 0) {
    missingKeys = undefined;
    promise = new Promise(function (resolve, reject) {
      return resolve();
    });
  } else {
    promise = new Promise(function (resolve, reject) {
      return reject('Missing keys ' + missingKeys.join(', '));
    });
  }

  return {
    missingKeys: missingKeys, promise: promise
  };
}

// ----------------------------------------------------------------------------

function build() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? location : arguments[0];

  var userData,
      token,
      loginPromise,
      isAuthenticated = false,
      eventSource = null,
      busyCounter = 0;

  var client = {}; // Must be const otherwise the created closure will fail
  var notification = new Observable();
  var idle = function idle() {
    notification.emit(BUSY_TOPIC, --busyCounter);
  };
  var busy = function busy(promise) {
    notification.emit(BUSY_TOPIC, ++busyCounter);
    promise.then(idle, idle);
    return promise;
  };
  var protocol = config.protocol;
  var hostname = config.hostname;
  var port = config.port;
  var _config$basepath = config.basepath;
  var basepath = _config$basepath === undefined ? '/api/v1' : _config$basepath;
  var baseURL = protocol + '//' + hostname + ':' + port + basepath;
  var connectToNotificationStream = function connectToNotificationStream() {
    if (EventSource) {
      eventSource = new EventSource(baseURL + '/notification/stream');
      eventSource.onmessage = function (e) {
        var parsed = JSON.parse(e.data);
        notification.emit(EVENT_TOPIC, parsed);
      };

      eventSource.onerror = function (e) {
        // Wait 10 seconds if the browser hasn't reconnected then
        // reinitialize.
        setTimeout(function () {
          if (eventSource && eventSource.readyState === 2) {
            connectToNotificationStream();
          } else {
            eventSource = null;
          }
        }, 10000);
      };
    }
  };
  var _extractLocalToken$up = {
    extractLocalToken: function extractLocalToken() {
      try {
        return document.cookie.split('girderToken=')[1].split(';')[0].trim();
      } catch (e) {
        return undefined;
      }
    },
    updateGirderInstance: function updateGirderInstance() {
      var timeout = 60000;
      var headers = {};

      if (token) {
        headers['Girder-Token'] = token;
      }

      client._ = _axios2.default.create({
        baseURL: baseURL, timeout: timeout, headers: headers
      });
    },
    updateAuthenticationState: function updateAuthenticationState(state) {
      if (isAuthenticated !== !!state) {
        // Clear cache data if not logged-in
        if (!state) {
          userData = undefined;
          token = undefined;
          // Update userData for external modules
          client.user = userData;
          client.token = undefined;
        }

        // Update internal state
        isAuthenticated = !!state;
        updateGirderInstance();

        // Broadcast information
        /* eslint-disable babel/new-cap */
        loginPromise = state ? loginPromiseBuilder() : logoutPromiseBuilder();
        /* eslint-enable babel/new-cap */
        notification.emit(AUTH_CHANGE_TOPIC, isAuthenticated);
        if (isAuthenticated && eventSource === null) {
          connectToNotificationStream();
        }
      }
    }
  };
  var extractLocalToken = _extractLocalToken$up.extractLocalToken;
  var updateGirderInstance = _extractLocalToken$up.updateGirderInstance;
  var updateAuthenticationState = _extractLocalToken$up.updateAuthenticationState;
  var progress = function progress(id, current) {
    var total = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    notification.emit(PROGRESS_TOPIC, {
      id: id, current: current, total: total
    });
  };

  // Fill up public object
  var publicObject = {
    login: function login(username, password) {
      var auth = {
        username: username, password: password
      };
      return busy(client._.get('/user/authentication', {
        auth: auth
      }).then(function (resp) {
        token = resp.data.authToken.token;
        userData = resp.data.user;

        // Update userData for external modules
        client.user = userData;
        client.token = token;

        updateAuthenticationState(true);
      }));
    },
    logout: function logout() {
      return busy(client._.delete('/user/authentication').then(function (ok) {
        updateAuthenticationState(false);
        if (document && document.cookie) {
          document.cookie = 'Girder-Token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
      }, function (ko) {
        console.log('loggout error', ko);
      }));
    },
    me: function me() {
      return busy(client._.get('/user/me'));
    },
    isLoggedIn: function isLoggedIn() {
      return loginPromise;
    },
    getLoggedInUser: function getLoggedInUser() {
      return userData;
    },
    onAuthChange: function onAuthChange(callback) {
      return notification.on(AUTH_CHANGE_TOPIC, callback);
    },
    onBusy: function onBusy(callback) {
      return notification.on(BUSY_TOPIC, callback);
    },
    onProgress: function onProgress(callback) {
      return notification.on(PROGRESS_TOPIC, callback);
    },
    onEvent: function onEvent(callback) {
      return notification.on(EVENT_TOPIC, callback);
    },
    destroy: function destroy() {
      notification.off();
    }
  };

  // Try to extract token from
  loginPromise = new Promise(function (accept, reject) {
    token = config.token || extractLocalToken();
    updateGirderInstance();
    if (token) {
      publicObject.me().then(function (resp) {
        userData = resp.data;

        // Update userData for external modules
        client.user = userData;
        client.token = token;
        updateAuthenticationState(true);
        accept();
      }, function (errResp) {
        updateAuthenticationState(false);
        reject();
      });
    } else {
      reject();
    }
  });

  // Expend client
  client.baseURL = baseURL;

  // Add extensions
  var spec = {
    busy: busy,
    client: client,
    encodeQueryAsString: encodeQueryAsString,
    filterQuery: filterQuery,
    mustContain: mustContain,
    notification: notification,
    progress: progress
  };

  function processExtension(ext) {
    if (Array.isArray(ext)) {
      ext.forEach(processExtension);
    } else {
      (function () {
        var obj = ext(spec);
        Object.keys(obj).forEach(function (key) {
          publicObject[key] = obj[key];
        });
      })();
    }
  }

  for (var _len3 = arguments.length, extensions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    extensions[_key3 - 1] = arguments[_key3];
  }

  processExtension(extensions);

  // Return the newly composed object
  return Object.freeze(publicObject);
}

exports.default = {
  build: build
};