'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PROCESS_READY_TOPIC = 'launcher.process.ready',
    PROCESS_STOPPED_TOPIC = 'launcher.process.stopped',
    CONNECTION_INFO_TOPIC = 'launcher.info.connection',
    ERROR_TOPIC = 'launcher.error';

var connections = [];

var ProcessLauncher = function () {
  function ProcessLauncher(endPoint) {
    _classCallCheck(this, ProcessLauncher);

    this.endPoint = endPoint;
  }

  _createClass(ProcessLauncher, [{
    key: 'start',
    value: function start(config) {
      var _this = this;

      var xhr = new XMLHttpRequest(),
          url = this.endPoint;

      xhr.open('POST', url, true);
      xhr.responseType = 'json';

      xhr.onload = function (e) {
        var response = xhr.response;
        if (xhr.status === 200 && !response.error) {
          // Add connection to our global list
          connections.push(response);
          _this.emit(PROCESS_READY_TOPIC, response);
          return;
        }
        _this.emit(ERROR_TOPIC, response);
      };

      xhr.onerror = function (e) {
        _this.emit(ERROR_TOPIC, xhr.response);
      };

      xhr.send(JSON.stringify(config));
    }
  }, {
    key: 'fetchConnection',
    value: function fetchConnection(sessionId) {
      var _this2 = this;

      var xhr = new XMLHttpRequest(),
          url = [this.endPoint, sessionId].join('/');

      xhr.open('GET', url, true);
      xhr.responseType = 'json';

      xhr.onload = function (e) {
        if (_this2.status === 200) {
          _this2.emit(CONNECTION_INFO_TOPIC, xhr.response);
          return;
        }
        _this2.emit(ERROR_TOPIC, xhr.response);
      };

      xhr.onerror = function (e) {
        _this2.emit(ERROR_TOPIC, xhr.response);
      };

      xhr.send();
    }
  }, {
    key: 'stop',
    value: function stop(connection) {
      var _this3 = this;

      var xhr = new XMLHttpRequest(),
          url = [this.endPoint, connection.id].join('/');

      xhr.open('DELETE', url, true);
      xhr.responseType = 'json';

      xhr.onload = function (e) {
        if (_this3.status === 200) {
          var response = xhr.response;
          // Remove connection from the list
          // FIXME / TODO
          _this3.emit(PROCESS_STOPPED_TOPIC, response);
          return;
        }
        _this3.emit(ERROR_TOPIC, xhr.response);
      };
      xhr.onerror = function (e) {
        _this3.emit(ERROR_TOPIC, xhr.response);
      };
      xhr.send();
    }
  }, {
    key: 'listConnections',
    value: function listConnections() {
      return connections;
    }
  }, {
    key: 'onProcessReady',
    value: function onProcessReady(callback) {
      return this.on(PROCESS_READY_TOPIC, callback);
    }
  }, {
    key: 'onProcessStopped',
    value: function onProcessStopped(callback) {
      return this.on(PROCESS_STOPPED_TOPIC, callback);
    }
  }, {
    key: 'onFetch',
    value: function onFetch(callback) {
      return this.on(CONNECTION_INFO_TOPIC, callback);
    }
  }, {
    key: 'onError',
    value: function onError(callback) {
      return this.on(ERROR_TOPIC, callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      this.endPoint = null;
    }
  }]);

  return ProcessLauncher;
}();

exports.default = ProcessLauncher;

_monologue2.default.mixInto(ProcessLauncher);