define(['exports', './AnnotationBuilder', './CanvasOffscreenBuffer', './Convert', './ConvertProxyProperty', './Debounce', './ImageExporter', './Loop', './Observable', './PingPong', './SelectionBuilder', './SizeHelper', './UUID', './Validate', './WebGl'], function (exports, _AnnotationBuilder, _CanvasOffscreenBuffer, _Convert, _ConvertProxyProperty, _Debounce, _ImageExporter, _Loop, _Observable, _PingPong, _SelectionBuilder, _SizeHelper, _UUID, _Validate, _WebGl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

  var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

  var _Convert2 = _interopRequireDefault(_Convert);

  var _ConvertProxyProperty2 = _interopRequireDefault(_ConvertProxyProperty);

  var _Debounce2 = _interopRequireDefault(_Debounce);

  var _ImageExporter2 = _interopRequireDefault(_ImageExporter);

  var _Loop2 = _interopRequireDefault(_Loop);

  var _Observable2 = _interopRequireDefault(_Observable);

  var _PingPong2 = _interopRequireDefault(_PingPong);

  var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  var _UUID2 = _interopRequireDefault(_UUID);

  var _Validate2 = _interopRequireDefault(_Validate);

  var _WebGl2 = _interopRequireDefault(_WebGl);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    AnnotationBuilder: _AnnotationBuilder2.default,
    CanvasOffscreenBuffer: _CanvasOffscreenBuffer2.default,
    Convert: _Convert2.default,
    ConvertProxyProperty: _ConvertProxyProperty2.default,
    Debounce: _Debounce2.default,
    ImageExporter: _ImageExporter2.default,
    Loop: _Loop2.default,
    Observable: _Observable2.default,
    PingPong: _PingPong2.default,
    SelectionBuilder: _SelectionBuilder2.default,
    SizeHelper: _SizeHelper2.default,
    UUID: _UUID2.default,
    Validate: _Validate2.default,
    WebGl: _WebGl2.default
  };
});