"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var /* eslint-disable no-underscore-dangle */
  client = _ref.client;
  var filterQuery = _ref.filterQuery;
  var mustContain = _ref.mustContain;
  var busy = _ref.busy;

  return {
    getTask: function getTask(id) {
      return busy(client._.get("/tasks/" + id));
    },
    updateTask: function updateTask(id, updates) {
      return busy(client._.patch("/tasks/" + id, updates));
    },
    getTaskLog: function getTaskLog(id) {
      return busy(client._.get("/tasks/" + id + "/log"));
    },
    getTaskStatus: function getTaskStatus(id) {
      return busy(client._.get("/tasks/" + id + "/status"));
    }
  };
};