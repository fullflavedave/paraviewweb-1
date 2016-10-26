define(['exports', './AbstractImageBuilder', './BinaryDataProberImageBuilder', './CompositeImageBuilder', './DataProberImageBuilder', './DepthCompositeImageBuilder', './DepthImageBuilder', './FloatDataImageBuilder', './MagicLensImageBuilder', './MultiColorBySortedCompositeImageBuilder', './PixelOperatorImageBuilder', './QueryDataModelImageBuilder', './SortedCompositeImageBuilder'], function (exports, _AbstractImageBuilder, _BinaryDataProberImageBuilder, _CompositeImageBuilder, _DataProberImageBuilder, _DepthCompositeImageBuilder, _DepthImageBuilder, _FloatDataImageBuilder, _MagicLensImageBuilder, _MultiColorBySortedCompositeImageBuilder, _PixelOperatorImageBuilder, _QueryDataModelImageBuilder, _SortedCompositeImageBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AbstractImageBuilder2 = _interopRequireDefault(_AbstractImageBuilder);

  var _BinaryDataProberImageBuilder2 = _interopRequireDefault(_BinaryDataProberImageBuilder);

  var _CompositeImageBuilder2 = _interopRequireDefault(_CompositeImageBuilder);

  var _DataProberImageBuilder2 = _interopRequireDefault(_DataProberImageBuilder);

  var _DepthCompositeImageBuilder2 = _interopRequireDefault(_DepthCompositeImageBuilder);

  var _DepthImageBuilder2 = _interopRequireDefault(_DepthImageBuilder);

  var _FloatDataImageBuilder2 = _interopRequireDefault(_FloatDataImageBuilder);

  var _MagicLensImageBuilder2 = _interopRequireDefault(_MagicLensImageBuilder);

  var _MultiColorBySortedCompositeImageBuilder2 = _interopRequireDefault(_MultiColorBySortedCompositeImageBuilder);

  var _PixelOperatorImageBuilder2 = _interopRequireDefault(_PixelOperatorImageBuilder);

  var _QueryDataModelImageBuilder2 = _interopRequireDefault(_QueryDataModelImageBuilder);

  var _SortedCompositeImageBuilder2 = _interopRequireDefault(_SortedCompositeImageBuilder);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    AbstractImageBuilder: _AbstractImageBuilder2.default,
    BinaryDataProberImageBuilder: _BinaryDataProberImageBuilder2.default,
    CompositeImageBuilder: _CompositeImageBuilder2.default,
    DataProberImageBuilder: _DataProberImageBuilder2.default,
    DepthCompositeImageBuilder: _DepthCompositeImageBuilder2.default,
    DepthImageBuilder: _DepthImageBuilder2.default,
    FloatDataImageBuilder: _FloatDataImageBuilder2.default,
    MagicLensImageBuilder: _MagicLensImageBuilder2.default,
    MultiColorBySortedCompositeImageBuilder: _MultiColorBySortedCompositeImageBuilder2.default,
    PixelOperatorImageBuilder: _PixelOperatorImageBuilder2.default,
    QueryDataModelImageBuilder: _QueryDataModelImageBuilder2.default,
    SortedCompositeImageBuilder: _SortedCompositeImageBuilder2.default
  };
});