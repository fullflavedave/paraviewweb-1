define(['exports', './CollapsibleControls', './Containers', './Properties', './Renderers', './Viewers', './Widgets'], function (exports, _CollapsibleControls, _Containers, _Properties, _Renderers, _Viewers, _Widgets) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _CollapsibleControls2 = _interopRequireDefault(_CollapsibleControls);

  var _Containers2 = _interopRequireDefault(_Containers);

  var _Properties2 = _interopRequireDefault(_Properties);

  var _Renderers2 = _interopRequireDefault(_Renderers);

  var _Viewers2 = _interopRequireDefault(_Viewers);

  var _Widgets2 = _interopRequireDefault(_Widgets);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    CollapsibleControls: _CollapsibleControls2.default,
    Containers: _Containers2.default,
    Properties: _Properties2.default,
    Renderers: _Renderers2.default,
    Viewers: _Viewers2.default,
    Widgets: _Widgets2.default
  };
});