'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AnnotationStoreProvider = require('./AnnotationStoreProvider');

var _AnnotationStoreProvider2 = _interopRequireDefault(_AnnotationStoreProvider);

var _D3MultiClick = require('./D3MultiClick');

var _D3MultiClick2 = _interopRequireDefault(_D3MultiClick);

var _FieldProvider = require('./FieldProvider');

var _FieldProvider2 = _interopRequireDefault(_FieldProvider);

var _Histogram1DProvider = require('./Histogram1DProvider');

var _Histogram1DProvider2 = _interopRequireDefault(_Histogram1DProvider);

var _Histogram2DProvider = require('./Histogram2DProvider');

var _Histogram2DProvider2 = _interopRequireDefault(_Histogram2DProvider);

var _HistogramBinHoverProvider = require('./HistogramBinHoverProvider');

var _HistogramBinHoverProvider2 = _interopRequireDefault(_HistogramBinHoverProvider);

var _LegendProvider = require('./LegendProvider');

var _LegendProvider2 = _interopRequireDefault(_LegendProvider);

var _MutualInformationProvider = require('./MutualInformationProvider');

var _MutualInformationProvider2 = _interopRequireDefault(_MutualInformationProvider);

var _PartitionProvider = require('./PartitionProvider');

var _PartitionProvider2 = _interopRequireDefault(_PartitionProvider);

var _PersistentStateProvider = require('./PersistentStateProvider');

var _PersistentStateProvider2 = _interopRequireDefault(_PersistentStateProvider);

var _ScoresProvider = require('./ScoresProvider');

var _ScoresProvider2 = _interopRequireDefault(_ScoresProvider);

var _SelectionProvider = require('./SelectionProvider');

var _SelectionProvider2 = _interopRequireDefault(_SelectionProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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