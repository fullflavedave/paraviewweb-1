define(['../../../../Common/Misc/SizeHelper', '../../../../../src/Common/Core/CompositeClosureHelper', '../../../../../src/InfoViz/Core/FieldProvider', '../../../../../src/InfoViz/Core/LegendProvider', '../../../../../src/InfoViz/Core/Histogram1DProvider', '../../../../../src/InfoViz/Core/HistogramBinHoverProvider', '../../../../../src/InfoViz/Core/PartitionProvider', '../../../../../src/InfoViz/Core/ScoresProvider', '../../../../../src/InfoViz/Core/SelectionProvider', '../../../Native/HistogramSelector', '../../../Native/FieldSelector', './state.json', 'normalize.css', 'babel-polyfill'], function (_SizeHelper, _CompositeClosureHelper, _FieldProvider, _LegendProvider, _Histogram1DProvider, _HistogramBinHoverProvider, _PartitionProvider, _ScoresProvider, _SelectionProvider, _HistogramSelector, _FieldSelector, _state) {
  'use strict';

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _FieldProvider2 = _interopRequireDefault(_FieldProvider);

  var _LegendProvider2 = _interopRequireDefault(_LegendProvider);

  var _Histogram1DProvider2 = _interopRequireDefault(_Histogram1DProvider);

  var _HistogramBinHoverProvider2 = _interopRequireDefault(_HistogramBinHoverProvider);

  var _PartitionProvider2 = _interopRequireDefault(_PartitionProvider);

  var _ScoresProvider2 = _interopRequireDefault(_ScoresProvider);

  var _SelectionProvider2 = _interopRequireDefault(_SelectionProvider);

  var _HistogramSelector2 = _interopRequireDefault(_HistogramSelector);

  var _FieldSelector2 = _interopRequireDefault(_FieldSelector);

  var _state2 = _interopRequireDefault(_state);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var bodyElt = document.querySelector('body');
  // '100vh' is 100% of the current screen height
  var defaultHeight = '100vh';

  var histogramSelectorContainer = document.createElement('div');
  histogramSelectorContainer.style.position = 'relative';
  histogramSelectorContainer.style.width = '58%';
  histogramSelectorContainer.style.height = defaultHeight;
  histogramSelectorContainer.style.float = 'left';
  bodyElt.appendChild(histogramSelectorContainer);

  var fieldSelectorContainer = document.createElement('div');
  fieldSelectorContainer.style.position = 'relative';
  fieldSelectorContainer.style.width = '42%';
  fieldSelectorContainer.style.height = defaultHeight;
  fieldSelectorContainer.style.float = 'left';
  fieldSelectorContainer.style['font-size'] = '10pt';
  bodyElt.appendChild(fieldSelectorContainer);

  var provider = _CompositeClosureHelper2.default.newInstance(function (publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, initialValues);
    _FieldProvider2.default.extend(publicAPI, model, initialValues);
    _Histogram1DProvider2.default.extend(publicAPI, model, initialValues);
    _HistogramBinHoverProvider2.default.extend(publicAPI, model);
    _LegendProvider2.default.extend(publicAPI, model, initialValues);
    _PartitionProvider2.default.extend(publicAPI, model, initialValues);
    _ScoresProvider2.default.extend(publicAPI, model, initialValues);
    _SelectionProvider2.default.extend(publicAPI, model, initialValues);
  })(_state2.default);

  // set provider behaviors
  provider.setFieldsSorted(true);
  provider.getFieldNames().forEach(function (name) {
    provider.addLegendEntry(name);
  });
  provider.assignLegend(['colors', 'shapes']);

  // activate scoring gui
  var scores = [{ name: 'No', color: '#FDAE61', value: -1 }, { name: 'Maybe', color: '#FFFFBF', value: 0 }, { name: 'Yes', color: '#A6D96A', value: 1 }];
  provider.setScores(scores);
  provider.setDefaultScore(1);

  // Create histogram selector
  var histogramSelector = _HistogramSelector2.default.newInstance({
    provider: provider,
    container: histogramSelectorContainer
  });
  // set a target number per row.
  // defaultScore: 1,
  histogramSelector.requestNumBoxesPerRow(4);
  // Or show a single variable as the focus, possibly disabling switching to other vars.
  // histogramSelector.displaySingleHistogram(provider.getFieldNames()[5], true);
  // and maybe set a scoring annotation:
  // histogramSelector.setDefaultScorePartition(provider.getFieldNames()[5]);
  // test reset:
  // window.setTimeout(() => {
  //   histogramSelector.requestNumBoxesPerRow(4);
  // }, 5000);

  // Create field selector
  var fieldSelector = _FieldSelector2.default.newInstance({ provider: provider, container: fieldSelectorContainer });

  // Listen to window resize
  _SizeHelper2.default.onSizeChange(function () {
    histogramSelector.resize();
    fieldSelector.resize();
  });
  _SizeHelper2.default.startListening();

  _SizeHelper2.default.triggerChange();
});