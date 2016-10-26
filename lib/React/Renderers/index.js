'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GeometryRenderer = require('./GeometryRenderer');

var _GeometryRenderer2 = _interopRequireDefault(_GeometryRenderer);

var _ImageRenderer = require('./ImageRenderer');

var _ImageRenderer2 = _interopRequireDefault(_ImageRenderer);

var _MultiLayoutRenderer = require('./MultiLayoutRenderer');

var _MultiLayoutRenderer2 = _interopRequireDefault(_MultiLayoutRenderer);

var _PlotlyRenderer = require('./PlotlyRenderer');

var _PlotlyRenderer2 = _interopRequireDefault(_PlotlyRenderer);

var _VtkRenderer = require('./VtkRenderer');

var _VtkRenderer2 = _interopRequireDefault(_VtkRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  GeometryRenderer: _GeometryRenderer2.default,
  ImageRenderer: _ImageRenderer2.default,
  MultiLayoutRenderer: _MultiLayoutRenderer2.default,
  PlotlyRenderer: _PlotlyRenderer2.default,
  VtkRenderer: _VtkRenderer2.default
};