'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _style = require('./style.mcss');

var _style2 = _interopRequireDefault(_style);

var _paraview = require('../../../../../svg/paraview.svg');

var _paraview2 = _interopRequireDefault(_paraview);

var _paraviewweb = require('../../../../../svg/paraviewweb.svg');

var _paraviewweb2 = _interopRequireDefault(_paraviewweb);

var _functionGaussian = require('../../../../../svg/function-gaussian.svg');

var _functionGaussian2 = _interopRequireDefault(_functionGaussian);

var _functionLinear = require('../../../../../svg/function-linear.svg');

var _functionLinear2 = _interopRequireDefault(_functionLinear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = document.querySelector('.content');

_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(_2.default, { width: '30px', height: '30px' }),
  _react2.default.createElement(_2.default, { className: _style2.default.smallIcon, icon: _paraview2.default }),
  _react2.default.createElement(_2.default, { className: _style2.default.mediumIcon, icon: _paraviewweb2.default }),
  _react2.default.createElement(_2.default, { className: _style2.default.bigIcon, icon: _functionGaussian2.default }),
  _react2.default.createElement(_2.default, { className: _style2.default.redIcon, icon: _functionLinear2.default })
), container);

document.body.style.margin = '10px';