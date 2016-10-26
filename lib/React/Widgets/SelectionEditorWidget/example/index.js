define(['react', 'react-dom', '..', '../../../../Common/Misc/SelectionBuilder', '../../../../InfoViz/Core/LegendProvider', 'babel-polyfill', 'normalize.css'], function (_react, _reactDom, _, _SelectionBuilder, _LegendProvider) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _2 = _interopRequireDefault(_);

  var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

  var _LegendProvider2 = _interopRequireDefault(_LegendProvider);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var rangeSelection = _SelectionBuilder2.default.range({
    pressure: [{ interval: [0, 101.3], endpoints: 'oo', uncertainty: 15 }, { interval: [200, 400], endpoints: '*o', uncertainty: 30 }],
    temperature: [{ interval: [233, Number.MAX_VALUE], endpoints: 'oo', uncertainty: 15 }]
  });

  var partitionSelection = _SelectionBuilder2.default.partition('pressure', [{ value: 90, uncertainty: 0 }, { value: 101.3, uncertainty: 10 }, { value: 200, uncertainty: 40, closeToLeft: true }]);
  var ranges = {
    pressure: [0, 600],
    temperature: [-270, 1000]
  };

  var selectionTypes = [rangeSelection, partitionSelection, _SelectionBuilder2.default.convertToRuleSelection(rangeSelection)];
  var legendService = _LegendProvider2.default.newInstance({ legendEntries: ['pressure', 'temperature'] });

  // Get react component
  document.body.style.padding = '10px';

  function render() {
    _reactDom2.default.render(_react2.default.createElement(
      'div',
      null,
      selectionTypes.map(function (selection, idx) {
        return _react2.default.createElement(_2.default, {
          key: idx,
          selection: selection,
          ranges: ranges,
          getLegend: legendService.getLegend,
          onChange: function onChange(newSelection, save) {
            selectionTypes[idx] = newSelection;
            if (save) {
              console.log('Push selection', newSelection.generation, newSelection);
            }
            render();
          }
        });
      })
    ), document.querySelector('.content'));
  }

  render();
});