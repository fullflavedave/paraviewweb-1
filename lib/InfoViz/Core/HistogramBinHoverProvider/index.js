define(['exports', '../../../Common/Core/CompositeClosureHelper'], function (exports, _CompositeClosureHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.extend = extend;

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // ----------------------------------------------------------------------------
  // Histogram Bin Hover Provider
  // ----------------------------------------------------------------------------

  function histogramBinHoverProvider(publicAPI, model) {
    if (!model.hoverState) {
      model.hoverState = {};
    }

    publicAPI.setHoverState = function (hoverState) {
      model.hoverState = hoverState;
      publicAPI.fireHoverBinChange(model.hoverState);
    };
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {};

  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, 'HistogramBinHoverProvider');
    _CompositeClosureHelper2.default.event(publicAPI, model, 'HoverBinChange');

    histogramBinHoverProvider(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});