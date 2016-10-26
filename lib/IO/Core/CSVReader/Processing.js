"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
 * Given a categorical array, return two new arrays, the first containing the
 * unique values, the second containing the counts.
 */
function uniqueValues(categorical) {
  var countMap = {};
  categorical.forEach(function (val) {
    if (!(val in countMap)) {
      countMap[val] = 0;
    }
    countMap[val] += 1;
  });
  var uniques = [];
  var counts = [];
  Object.keys(countMap).forEach(function (uniqueVal) {
    uniques.push(uniqueVal);
    counts.push(countMap[uniqueVal]);
  });
  return [uniques, counts];
}

/*
 * Given two parallel arrays, one categorical, one numeric, return two new arrays.
 * The first returned array contains the unique values from the categorical input,
 * while the second returned array contains averages from the numeric input
 * over each category.
 */
function averageValues(categorical, numeric) {
  var sumMap = {};

  var _uniqueValues = uniqueValues(categorical);

  var _uniqueValues2 = _slicedToArray(_uniqueValues, 2);

  var uniques = _uniqueValues2[0];
  var counts = _uniqueValues2[1];

  for (var i = 0; i < uniques.length; ++i) {
    sumMap[uniques[i]] = {
      sum: 0,
      count: counts[i]
    };
  }
  for (var j = 0; j < numeric.length; ++j) {
    sumMap[categorical[j]].sum += parseFloat(numeric[j]);
  }
  var u = [];
  var a = [];
  Object.keys(sumMap).forEach(function (uniqueKey) {
    u.push(uniqueKey);
    a.push(sumMap[uniqueKey].sum / sumMap[uniqueKey].count);
  });
  return [u, a];
}

exports.uniqueValues = uniqueValues;
exports.averageValues = averageValues;