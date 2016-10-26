'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _autobahn = require('autobahn');

var _autobahn2 = _interopRequireDefault(_autobahn);

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONNECTION_READY_TOPIC = 'connection.ready',
    CONNECTION_CLOSE_TOPIC = 'connection.close';

function getTransportObject(url) {
  var idx = url.indexOf(':'),
      protocol = url.substring(0, idx);
  if (protocol === 'ws' || protocol === 'wss') {
    return {
      type: 'websocket',
      url: url
    };
  } else if (protocol === 'http' || protocol === 'https') {
    return {
      type: 'longpoll',
      url: url,
      request_timeout: 300000
    };
  }

  throw new Error('Unknown protocol (' + protocol + ') for url (' + url + ').  Unable to create transport object.');
}

var AutobahnConnection = function () {
  function AutobahnConnection(urls) {
    var secret = arguments.length <= 1 || arguments[1] === undefined ? 'vtkweb-secret' : arguments[1];
    var retry = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, AutobahnConnection);

    this.urls = urls;
    this.secret = secret;
    this.connection = null;
    // Should autobahn try to reconnect on error?
    this.retry = retry;
  }

  _createClass(AutobahnConnection, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      var uriList = [].concat(this.urls),
          transports = [];

      for (var i = 0; i < uriList.length; i += 1) {
        var url = uriList[i];
        try {
          var transport = getTransportObject(url);
          transports.push(transport);
        } catch (transportCreateError) {
          console.error(transportCreateError);
        }
      }

      this.connection = new _autobahn2.default.Connection({
        max_retries: 0,
        transports: transports,
        realm: 'vtkweb',
        authmethods: ['wampcra'],
        authid: 'vtkweb',
        onchallenge: function onchallenge(session, method, extra) {
          if (method === 'wampcra') {
            var secretKey = _autobahn2.default.auth_cra.derive_key(_this.secret, 'salt123');
            return _autobahn2.default.auth_cra.sign(secretKey, extra.challenge);
          }

          throw new Error('don\'t know how to authenticate using \'' + method + '\'');
        }
      });

      this.connection.onopen = function (session, details) {
        _this.session = session;
        _this.details = details;
        _this.emit(CONNECTION_READY_TOPIC, _this);
      };

      this.connection.onclose = function () {
        _this.emit(CONNECTION_CLOSE_TOPIC, _this);
        _this.connection = null;
        return !_this.retry; // true => Stop retry
      };

      this.connection.open();
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
    key: 'getSession',
    value: function getSession() {
      return this.session;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var timeout = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

      this.off();
      if (this.session) {
        this.session.call('application.exit.later', [timeout]);
      }
      if (this.connection) {
        this.connection.close();
      }
      this.connection = null;
    }
  }]);

  return AutobahnConnection;
}();

exports.default = AutobahnConnection;


_monologue2.default.mixInto(AutobahnConnection);