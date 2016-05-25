'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CoreEndpoints = require('./CoreEndpoints');

var _CoreEndpoints2 = _interopRequireDefault(_CoreEndpoints);

var _GirderClientBuilder = require('./GirderClientBuilder');

var _GirderClientBuilder2 = _interopRequireDefault(_GirderClientBuilder);

var _HpcCloudEndpoints = require('./HpcCloudEndpoints');

var _HpcCloudEndpoints2 = _interopRequireDefault(_HpcCloudEndpoints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  CoreEndpoints: _CoreEndpoints2.default,
  GirderClientBuilder: _GirderClientBuilder2.default,
  HpcCloudEndpoints: _HpcCloudEndpoints2.default
};