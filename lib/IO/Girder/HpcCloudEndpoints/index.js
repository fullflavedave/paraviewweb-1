'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aws = require('./aws');

var _aws2 = _interopRequireDefault(_aws);

var _clusters = require('./clusters');

var _clusters2 = _interopRequireDefault(_clusters);

var _jobs = require('./jobs');

var _jobs2 = _interopRequireDefault(_jobs);

var _projects = require('./projects');

var _projects2 = _interopRequireDefault(_projects);

var _simulations = require('./simulations');

var _simulations2 = _interopRequireDefault(_simulations);

var _taskflows = require('./taskflows');

var _taskflows2 = _interopRequireDefault(_taskflows);

var _tasks = require('./tasks');

var _tasks2 = _interopRequireDefault(_tasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_aws2.default, _clusters2.default, _jobs2.default, _projects2.default, _simulations2.default, _taskflows2.default, _tasks2.default];