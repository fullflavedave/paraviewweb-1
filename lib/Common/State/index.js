define(['exports', './EqualizerState', './PipelineState', './ToggleState'], function (exports, _EqualizerState, _PipelineState, _ToggleState) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _EqualizerState2 = _interopRequireDefault(_EqualizerState);

  var _PipelineState2 = _interopRequireDefault(_PipelineState);

  var _ToggleState2 = _interopRequireDefault(_ToggleState);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    EqualizerState: _EqualizerState2.default,
    PipelineState: _PipelineState2.default,
    ToggleState: _ToggleState2.default
  };
});