define(['exports', './CollapsibleControlFactory', './FloatImageControl', './LightControl', './LookupTableManagerControl', './MultiViewControl', './PixelOperatorControl', './ProbeControl', './QueryDataModelControl', './TimeFloatImageControl', './VolumeControl'], function (exports, _CollapsibleControlFactory, _FloatImageControl, _LightControl, _LookupTableManagerControl, _MultiViewControl, _PixelOperatorControl, _ProbeControl, _QueryDataModelControl, _TimeFloatImageControl, _VolumeControl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _CollapsibleControlFactory2 = _interopRequireDefault(_CollapsibleControlFactory);

  var _FloatImageControl2 = _interopRequireDefault(_FloatImageControl);

  var _LightControl2 = _interopRequireDefault(_LightControl);

  var _LookupTableManagerControl2 = _interopRequireDefault(_LookupTableManagerControl);

  var _MultiViewControl2 = _interopRequireDefault(_MultiViewControl);

  var _PixelOperatorControl2 = _interopRequireDefault(_PixelOperatorControl);

  var _ProbeControl2 = _interopRequireDefault(_ProbeControl);

  var _QueryDataModelControl2 = _interopRequireDefault(_QueryDataModelControl);

  var _TimeFloatImageControl2 = _interopRequireDefault(_TimeFloatImageControl);

  var _VolumeControl2 = _interopRequireDefault(_VolumeControl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    CollapsibleControlFactory: _CollapsibleControlFactory2.default,
    FloatImageControl: _FloatImageControl2.default,
    LightControl: _LightControl2.default,
    LookupTableManagerControl: _LookupTableManagerControl2.default,
    MultiViewControl: _MultiViewControl2.default,
    PixelOperatorControl: _PixelOperatorControl2.default,
    ProbeControl: _ProbeControl2.default,
    QueryDataModelControl: _QueryDataModelControl2.default,
    TimeFloatImageControl: _TimeFloatImageControl2.default,
    VolumeControl: _VolumeControl2.default
  };
});