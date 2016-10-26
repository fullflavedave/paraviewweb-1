'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _contains = require('mout/src/array/contains');

var _contains2 = _interopRequireDefault(_contains);

var _rgbdCompositor = require('./rgbd-compositor');

var _rgbdCompositor2 = _interopRequireDefault(_rgbdCompositor);

var _sxyzLightCompositor = require('./sxyz-light-compositor');

var _sxyzLightCompositor2 = _interopRequireDefault(_sxyzLightCompositor);

var _rawRgbdCompositor = require('./raw-rgbd-compositor');

var _rawRgbdCompositor2 = _interopRequireDefault(_rawRgbdCompositor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CompositorMap = {
  rgbd: _rgbdCompositor2.default,
  'sxyz-light': _sxyzLightCompositor2.default,
  'raw-rgbd': _rawRgbdCompositor2.default
};

function createCompositor(dataType, options) {
  var instance = null;
  Object.keys(CompositorMap).forEach(function (type) {
    if (!instance && (0, _contains2.default)(dataType, type)) {
      instance = new CompositorMap[type](options);
    }
  });
  if (!instance) {
    console.error('No compositor found for type', dataType);
  }
  return instance;
}

exports.default = {
  createCompositor: createCompositor
};