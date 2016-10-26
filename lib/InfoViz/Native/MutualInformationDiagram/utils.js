'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constantMatrix = constantMatrix;
exports.zeros = zeros;
exports.downsample = downsample;
exports.freqToProb = freqToProb;
exports.flattenMatrix = flattenMatrix;
exports.quantile = quantile;
exports.matrixFind = matrixFind;
exports.matrixSubset = matrixSubset;
exports.matrixChoose = matrixChoose;
exports.topProb = topProb;
exports.topPmi = topPmi;
exports.topBinProb = topBinProb;
exports.topBinPmi = topBinPmi;
exports.calculateAngleAndRadius = calculateAngleAndRadius;
// -----------------------------------------------------------------------------------
// -- Private utility methods for dealing with joint (2d) probability distributions --
// -----------------------------------------------------------------------------------

function constantMatrix(ii, jj, entry) {
  var arr = [];
  for (var i = 0; i < ii; ++i) {
    arr.push([]);
    for (var j = 0; j < jj; ++j) {
      arr[i].push(null);
    }
  }
  return arr;
}

function zeros(ii, jj) {
  return constantMatrix(ii, jj, 0);
}

function downsample(src, nn, swap) {
  var hsz = src ? src.length : 0;
  var arr;
  if (hsz === 0) {
    return [];
  }

  if (nn < 1) {
    return [];
  }

  // assert(hsz === src[0].length);
  var tn = 1;
  while (tn < nn && tn < hsz) {
    tn *= 2;
  }

  var stride = hsz / tn;

  if (stride === 1 && !swap) {
    arr = src;
  } else {
    arr = zeros(tn, tn);
    for (var i = 0; i < hsz; ++i) {
      for (var j = 0; j < hsz; ++j) {
        arr[Math.floor(i / stride)][Math.floor(j / stride)] += src[i][j];
      }
    }
  }

  if (swap) {
    for (var _i = 0; _i < tn; ++_i) {
      for (var _j = _i + 1; _j < tn; ++_j) {
        var tmp = arr[_i][_j];
        arr[_i][_j] = arr[_j][_i];
        arr[_j][_i] = tmp;
      }
    }
  }

  return arr;
}

function freqToProb(src) {
  var hsz = src ? src.length : 0;
  if (hsz === 0) {
    return [];
  }

  // assert(hsz === src[0].length);

  var total = 0;
  for (var i = 0; i < hsz; ++i) {
    for (var j = 0; j < hsz; ++j) {
      total += src[i][j];
    }
  }
  var pAB = zeros(hsz, hsz);
  var pA = zeros(hsz, 1);
  var pB = zeros(1, hsz);
  var pmi = constantMatrix(hsz, hsz, null);
  for (var _i2 = 0; _i2 < hsz; ++_i2) {
    for (var _j2 = 0; _j2 < hsz; ++_j2) {
      var p = src[_i2][_j2] / total;
      pAB[_i2][_j2] = p;
      pA[_i2][0] += p;
      pB[0][_j2] += p;
    }
  }

  for (var _i3 = 0; _i3 < hsz; ++_i3) {
    for (var _j3 = 0; _j3 < hsz; ++_j3) {
      var pj = pAB[_i3][_j3];
      if (pj > 0) {
        pmi[_i3][_j3] = -1 * Math.log(pj / pA[_i3][0] / pB[0][_j3]) / Math.log(pj);
      }
    }
  }

  return { pAB: pAB, pA: pA, pB: pB, cardinality: total, pmi: pmi };
}

function flattenMatrix(x) {
  return x.reduce(function (a, b) {
    return a.concat(b);
  });
}

function quantile(xx, qq) {
  var xs = flattenMatrix(xx).sort(function (a, b) {
    return a - b;
  });
  return (xs[Math.floor(xs.length * qq)] + xs[Math.ceil(xs.length * qq)]) / 2;
}

function matrixFind(xx, condition) {
  if (!xx || xx.length < 1) {
    return [];
  }

  var nn = xx[0].length;

  var xf = flattenMatrix(xx).reduce(function (a, b, i) {
    return condition(b, i) ? a.concat([[Math.floor(i / nn), i % nn]]) : a;
  }, []);
  return xf;
}

function matrixSubset(mat, isRow, idx) {
  if (isRow) {
    return [mat[idx]]; // return a "new" matrix that has only one row.
  }
  return mat.map(function (row) {
    return [row[idx]];
  });
}

function matrixChoose(xx, idxs) {
  return idxs.reduce(function (a, b) {
    return a.concat(xx[b[0]][b[1]]);
  }, []);
}

function topProb(dd, qq) {
  var qval = quantile(dd.pAB, qq);
  var idxs = matrixFind(dd.pAB, function (d) {
    return d > qval;
  });
  return {
    pAB: matrixChoose(dd.pAB, idxs),
    pmi: matrixChoose(dd.pmi, idxs),
    idx: idxs
  };
}

function topPmi(dd, qq) {
  var apmi = dd.pmi.map(function (row) {
    return row.map(function (v) {
      return Math.abs(v);
    });
  });
  var qval = quantile(apmi, qq);
  var idxs = matrixFind(apmi, function (d) {
    return d > qval;
  });
  return {
    pAB: matrixChoose(dd.pAB, idxs),
    pmi: matrixChoose(dd.pmi, idxs),
    idx: idxs
  };
}

// Return the bins most probably linked to the given bin (above the \a qq quantile line of probability).
function topBinProb(dd, isA, bin, qq) {
  var subset = matrixSubset(dd.pAB, !isA, bin);
  var qval = quantile(subset, qq);
  var idxs = matrixFind(subset, function (d) {
    return d > qval;
  });

  console.log('binprob, isA:', isA, ' bin:', bin, ' idxs:', idxs, ' midx: ', idxs.map(function (d) {
    return !isA ? [bin, d[1]] : [bin, d[0]];
  }), ' subset: ', subset);

  return {
    pAB: matrixChoose(subset, idxs),
    pmi: matrixChoose(matrixSubset(dd.pmi, !isA, bin), idxs),
    idx: idxs.map(function (d) {
      return !isA ? [bin, d[1]] : [bin, d[0]];
    })
  };
}

function topBinPmi(dd, isA, bin, qq) {
  var subset = matrixSubset(dd.pmi, !isA, bin);
  var apmi = subset.map(function (row) {
    return row.map(function (v) {
      return Math.abs(v);
    });
  });
  var qval = quantile(apmi, qq);
  var idxs = matrixFind(apmi, function (d) {
    return d > qval;
  });

  return {
    pAB: matrixChoose(matrixSubset(dd.pAB, !isA, bin), idxs),
    pmi: matrixChoose(subset, idxs),
    idx: idxs.map(function (d) {
      return !isA ? [bin, d[1]] : [bin, d[0]];
    })
  };
}

function calculateAngleAndRadius(coords, containerDims) {
  var width = containerDims[0];
  var height = containerDims[1];
  var x = coords[0] - width / 2;
  var y = height - coords[1] - height / 2;
  // Need straight up in screen space to have angle 0, adjust atan2 args accordingly
  var arctangent = -Math.atan2(-x, y);
  if (arctangent < 0) {
    arctangent = Math.PI + (Math.PI + arctangent);
  }
  return [arctangent, Math.sqrt(x * x + y * y)];
}

exports.default = {
  calculateAngleAndRadius: calculateAngleAndRadius,
  constantMatrix: constantMatrix,
  downsample: downsample,
  flattenMatrix: flattenMatrix,
  freqToProb: freqToProb,
  matrixChoose: matrixChoose,
  matrixFind: matrixFind,
  matrixSubset: matrixSubset,
  quantile: quantile,
  topBinPmi: topBinPmi,
  topBinProb: topBinProb,
  topPmi: topPmi,
  topProb: topProb,
  zeros: zeros
};