'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window */

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _merge = require('mout/object/merge');

var _merge2 = _interopRequireDefault(_merge);

var _ProcessLauncher = require('../../Core/ProcessLauncher');

var _ProcessLauncher2 = _interopRequireDefault(_ProcessLauncher);

var _AutobahnConnection = require('../AutobahnConnection');

var _AutobahnConnection2 = _interopRequireDefault(_AutobahnConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONNECTION_READY_TOPIC = 'connection.ready',
    CONNECTION_CLOSE_TOPIC = 'connection.close',
    CONNECTION_ERROR_TOPIC = 'connection.error',
    DEFAULT_SESSION_MANAGER_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/paraview/',
    DEFAULT_SESSION_URL = (window.location.protocol === 'https' ? 'wss' : 'ws') + '://' + window.location.hostname + ':' + window.location.port + '/ws';

function autobahnConnect(self) {
  var wsConnection = new _AutobahnConnection2.default(self.config.sessionURL, self.config.secret, self.config.retry);
  self.subscriptions.push(wsConnection.onConnectionReady(self.readyForwarder));
  self.subscriptions.push(wsConnection.onConnectionClose(self.closeForwarder));
  wsConnection.connect();

  // Add to the garbage collector
  self.gc.push(wsConnection);
}

var SmartConnect = function () {
  function SmartConnect(config) {
    var _this = this;

    _classCallCheck(this, SmartConnect);

    this.config = config;
    this.gc = [];
    this.subscriptions = [];
    this.session = null;

    // Event forwarders
    this.readyForwarder = function (data, envelope) {
      _this.session = data.getSession();
      _this.emit(CONNECTION_READY_TOPIC, data);
    };
    this.errorForwarder = function (data, envelope) {
      _this.emit(CONNECTION_ERROR_TOPIC, data);
    };
    this.closeForwarder = function (data, envelope) {
      _this.emit(CONNECTION_CLOSE_TOPIC, data);
    };
  }

  _createClass(SmartConnect, [{
    key: 'connect',
    value: function connect() {
      var _this2 = this;

      if (this.config.sessionURL) {
        // We have a direct connection URL
        autobahnConnect(this);
      } else {
        // We need to use the Launcher
        var launcher = new _ProcessLauncher2.default(this.config.sessionManagerURL || DEFAULT_SESSION_MANAGER_URL);

        this.subscriptions.push(launcher.onProcessReady(function (data, envelope) {
          _this2.config = (0, _merge2.default)(_this2.config, data);
          autobahnConnect(_this2);
        }));
        this.subscriptions.push(launcher.onError(function (data, envelope) {
          // Try to use standard connection URL
          _this2.config.sessionURL = DEFAULT_SESSION_URL;
          autobahnConnect(_this2);
        }));

        launcher.start(this.config);

        // Add to the garbage collector
        this.gc.push(launcher);
      }
    }
  }, {
    key: 'onConnectionReady',
    value: function onConnectionReady(callback) {
      return this.on(CONNECTION_READY_TOPIC, callback);
    }
  }, {
    key: 'onConnectionClose',
    value: function onConnectionClose(callback) {
      return this.on(CONNECTION_CLOSE_TOPIC, callback);
    }
  }, {
    key: 'onConnectionError',
    value: function onConnectionError(callback) {
      return this.on(CONNECTION_ERROR_TOPIC, callback);
    }
  }, {
    key: 'getSession',
    value: function getSession() {
      return this.session;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      while (this.subscriptions.length) {
        this.subscriptions.pop().unsubscribe();
      }

      if (this.session) {
        this.session.close();
      }
      this.session = null;

      this.readyForwarder = null;
      this.errorForwarder = null;
      this.closeForwarder = null;

      while (this.gc.length) {
        this.gc.pop().destroy();
      }
    }
  }]);

  return SmartConnect;
}();

exports.default = SmartConnect;


_monologue2.default.mixInto(SmartConnect);
