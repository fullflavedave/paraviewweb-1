'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _histogram2d = require('./histogram2d');

var _histogram2d2 = _interopRequireDefault(_histogram2d);

var _counts = require('./counts');

var _counts2 = _interopRequireDefault(_counts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataMapping = {
  histogram2d: _histogram2d2.default,
  counts: _counts2.default
};

// ----------------------------------------------------------------------------

function getHandler(type) {
  var handler = dataMapping[type];
  if (handler) {
    return handler;
  }

  throw new Error('No set handler for ' + type);
}

function set(model, data) {
  return getHandler(data.type).set(model, data);
}

function get(model, data) {
  return getHandler(data.type).get(model, data);
}

function getNotificationData(model, request) {
  return getHandler(request.type).getNotificationData(model, request);
}

exports.default = {
  set: set,
  get: get,
  getNotificationData: getNotificationData
};