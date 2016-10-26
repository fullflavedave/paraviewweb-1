define(['react', 'react-dom', '..', '../../../../Common/Misc/SelectionBuilder', '../../../../Common/Misc/AnnotationBuilder', '../../../../InfoViz/Core/LegendProvider', 'babel-polyfill', 'normalize.css'], function (_react, _reactDom, _, _SelectionBuilder, _AnnotationBuilder, _LegendProvider) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _2 = _interopRequireDefault(_);

  var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

  var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

  var _LegendProvider2 = _interopRequireDefault(_LegendProvider);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* global document */


  var scores = [{ name: 'Yes', color: '#00C900', value: 100 }, { name: 'Maybe', color: '#FFFF00', value: 0 }, { name: 'No', color: '#C90000', value: -Number.MAX_VALUE }];

  var rangeSelection = _SelectionBuilder2.default.range({
    pressure: [{ interval: [0, 101.3], endpoints: 'oo', uncertainty: 15 }, { interval: [200, 400], endpoints: '*o', uncertainty: 30 }],
    temperature: [{ interval: [233, Number.MAX_VALUE], endpoints: 'oo', uncertainty: 15 }]
  });

  var partitionSelection = _SelectionBuilder2.default.partition('pressure', [{ value: 90, uncertainty: 0 }, { value: 101.3, uncertainty: 10 }, { value: 200, uncertainty: 40, closeToLeft: true }]);
  var ranges = {
    pressure: [0, 600],
    temperature: [-270, 1000]
  };

  var annotations = [_AnnotationBuilder2.default.annotation(rangeSelection, [0]), _AnnotationBuilder2.default.annotation(partitionSelection, [1, 0, 1, 2]), _AnnotationBuilder2.default.annotation(_SelectionBuilder2.default.convertToRuleSelection(rangeSelection), [1])];
  var legendService = _LegendProvider2.default.newInstance({ legendEntries: ['pressure', 'temperature'] });

  // Get react component
  document.body.style.padding = '10px';

  function render() {
    _reactDom2.default.render(_react2.default.createElement(
      'div',
      null,
      annotations.map(function (annotation, idx) {
        return _react2.default.createElement(
          'div',
          { key: idx },
          _react2.default.createElement(_2.default, {
            scores: scores,
            ranges: ranges,
            annotation: annotation,
            getLegend: legendService.getLegend
            // rationaleOpen={true}
            , onChange: function onChange(newAnnotation, save) {
              annotations[idx] = newAnnotation;
              if (save) {
                console.log('Push annotation', newAnnotation.generation, newAnnotation);
              }
              render();
            }
          }),
          _react2.default.createElement('hr', null)
        );
      })
    ), document.querySelector('.content'));
  }

  render();
});