'use strict';

require('normalize.css');

require('babel-polyfill');

var _SizeHelper = require('../../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _ParallelCoordinates = require('../../../Native/ParallelCoordinates');

var _ParallelCoordinates2 = _interopRequireDefault(_ParallelCoordinates);

var _FieldSelector = require('../../../Native/FieldSelector');

var _FieldSelector2 = _interopRequireDefault(_FieldSelector);

var _CompositeClosureHelper = require('../../../../../src/Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

var _FieldProvider = require('../../../../../src/InfoViz/Core/FieldProvider');

var _FieldProvider2 = _interopRequireDefault(_FieldProvider);

var _Histogram1DProvider = require('../../../../../src/InfoViz/Core/Histogram1DProvider');

var _Histogram1DProvider2 = _interopRequireDefault(_Histogram1DProvider);

var _Histogram2DProvider = require('../../../../../src/InfoViz/Core/Histogram2DProvider');

var _Histogram2DProvider2 = _interopRequireDefault(_Histogram2DProvider);

var _LegendProvider = require('../../../../../src/InfoViz/Core/LegendProvider');

var _LegendProvider2 = _interopRequireDefault(_LegendProvider);

var _HistogramBinHoverProvider = require('../../../../../src/InfoViz/Core/HistogramBinHoverProvider');

var _HistogramBinHoverProvider2 = _interopRequireDefault(_HistogramBinHoverProvider);

var _state = require('./state.json');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import MutualInformationProvider from '../../../../../src/InfoViz/Core/MutualInformationProvider';


var bodyElt = document.querySelector('body');

var parallelCoordinatesContainer = document.createElement('div');
parallelCoordinatesContainer.style.position = 'relative';
parallelCoordinatesContainer.style.width = '60%';
parallelCoordinatesContainer.style.height = '250px';
parallelCoordinatesContainer.style.float = 'left';
bodyElt.appendChild(parallelCoordinatesContainer);

var fieldSelectorContainer = document.createElement('div');
fieldSelectorContainer.style.position = 'relative';
fieldSelectorContainer.style.width = '40%';
fieldSelectorContainer.style.height = '250px';
fieldSelectorContainer.style.float = 'left';
bodyElt.appendChild(fieldSelectorContainer);

var provider = _CompositeClosureHelper2.default.newInstance(function (publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, initialValues);
  _FieldProvider2.default.extend(publicAPI, model, initialValues);
  _Histogram1DProvider2.default.extend(publicAPI, model, initialValues);
  _Histogram2DProvider2.default.extend(publicAPI, model, initialValues);
  _HistogramBinHoverProvider2.default.extend(publicAPI, model);
  _LegendProvider2.default.extend(publicAPI, model, initialValues);
  // MutualInformationProvider.extend(publicAPI, model, initialValues);
})(_state2.default);

// set provider behaviors
provider.setFieldsSorted(true);
provider.getFieldNames().forEach(function (name) {
  provider.addLegendEntry(name);
});
provider.assignLegend(['colors', 'shapes']);

// Create parallel coordinates
var parallelCoordinates = _ParallelCoordinates2.default.newInstance({ provider: provider, container: parallelCoordinatesContainer });

// Create field selector
var fieldSelector = _FieldSelector2.default.newInstance({ provider: provider, container: fieldSelectorContainer });

// Listen to window resize
_SizeHelper2.default.onSizeChange(function () {
  parallelCoordinates.resize();
  fieldSelector.resize();
});
_SizeHelper2.default.startListening();

_SizeHelper2.default.triggerChange();