'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = PieChart;

var _Processing = require('../../../IO/Core/CSVReader/Processing');

var operations = {
  Count: _Processing.uniqueValues,
  Average: _Processing.averageValues
};

function PieChart(chartState, csvReader, arraysInfo) {
  var arrayNames = Object.keys(arraysInfo);
  if (!chartState.labels) {
    chartState.labels = arrayNames[0];
  }

  if (!chartState.values) {
    chartState.values = arrayNames[arrayNames.length >= 2 ? 1 : 0];
  }

  if (!chartState.operation) {
    chartState.operation = 'Average';
  }

  var opMethod = operations[chartState.operation];

  var _opMethod = opMethod(csvReader.getColumn(chartState.labels), csvReader.getColumn(chartState.values));

  var _opMethod2 = _slicedToArray(_opMethod, 2);

  var labels = _opMethod2[0];
  var values = _opMethod2[1];

  return [{
    labels: labels,
    values: values,
    type: 'pie'
  }];
}