define(['exports', './FieldSelector', './HistogramSelector', './MutualInformationDiagram', './ParallelCoordinates'], function (exports, _FieldSelector, _HistogramSelector, _MutualInformationDiagram, _ParallelCoordinates) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _FieldSelector2 = _interopRequireDefault(_FieldSelector);

  var _HistogramSelector2 = _interopRequireDefault(_HistogramSelector);

  var _MutualInformationDiagram2 = _interopRequireDefault(_MutualInformationDiagram);

  var _ParallelCoordinates2 = _interopRequireDefault(_ParallelCoordinates);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    FieldSelector: _FieldSelector2.default,
    HistogramSelector: _HistogramSelector2.default,
    MutualInformationDiagram: _MutualInformationDiagram2.default,
    ParallelCoordinates: _ParallelCoordinates2.default
  };
});