define(['exports', './AnnotationStoreProvider', './D3MultiClick', './FieldProvider', './Histogram1DProvider', './Histogram2DProvider', './HistogramBinHoverProvider', './LegendProvider', './MutualInformationProvider', './PartitionProvider', './PersistentStateProvider', './ScoresProvider', './SelectionProvider'], function (exports, _AnnotationStoreProvider, _D3MultiClick, _FieldProvider, _Histogram1DProvider, _Histogram2DProvider, _HistogramBinHoverProvider, _LegendProvider, _MutualInformationProvider, _PartitionProvider, _PersistentStateProvider, _ScoresProvider, _SelectionProvider) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AnnotationStoreProvider2 = _interopRequireDefault(_AnnotationStoreProvider);

  var _D3MultiClick2 = _interopRequireDefault(_D3MultiClick);

  var _FieldProvider2 = _interopRequireDefault(_FieldProvider);

  var _Histogram1DProvider2 = _interopRequireDefault(_Histogram1DProvider);

  var _Histogram2DProvider2 = _interopRequireDefault(_Histogram2DProvider);

  var _HistogramBinHoverProvider2 = _interopRequireDefault(_HistogramBinHoverProvider);

  var _LegendProvider2 = _interopRequireDefault(_LegendProvider);

  var _MutualInformationProvider2 = _interopRequireDefault(_MutualInformationProvider);

  var _PartitionProvider2 = _interopRequireDefault(_PartitionProvider);

  var _PersistentStateProvider2 = _interopRequireDefault(_PersistentStateProvider);

  var _ScoresProvider2 = _interopRequireDefault(_ScoresProvider);

  var _SelectionProvider2 = _interopRequireDefault(_SelectionProvider);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    AnnotationStoreProvider: _AnnotationStoreProvider2.default,
    D3MultiClick: _D3MultiClick2.default,
    FieldProvider: _FieldProvider2.default,
    Histogram1DProvider: _Histogram1DProvider2.default,
    Histogram2DProvider: _Histogram2DProvider2.default,
    HistogramBinHoverProvider: _HistogramBinHoverProvider2.default,
    LegendProvider: _LegendProvider2.default,
    MutualInformationProvider: _MutualInformationProvider2.default,
    PartitionProvider: _PartitionProvider2.default,
    PersistentStateProvider: _PersistentStateProvider2.default,
    ScoresProvider: _ScoresProvider2.default,
    SelectionProvider: _SelectionProvider2.default
  };
});