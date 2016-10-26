"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
// ----------------------------------------------------------------------------
// count
// ----------------------------------------------------------------------------
//
// ===> SET
//
//  const payload = {
//    type: 'count',
//    data: {
//       annotationInfo: {
//         annotationGeneration: 1,
//         selectionGeneration: 1,
//       },
//       count: 20,
//       role: {
//         selected: true,
//         score: 0,
//       },
//    },
//  }
//
// ===> GET
//
//  const query = {
//    type: 'count',
//  }
//
// const response = [
//   {
//   },
// ];
//
// ===> NOTIFICATION
//
// request = {
//   type: 'count',
//   variables: [],
//   metadata: {},
// }
//
// const notification = {
// };
//
// ----------------------------------------------------------------------------

function keep(id) {
  return function (item) {
    return item.annotationInfo.annotationGeneration === id;
  };
}

function sortByScore(a, b) {
  return a.role.score - b.role.score;
}

function set(model, payload) {
  var annotationGeneration = payload.data.annotationInfo.annotationGeneration;

  model.count = (model.count || []).filter(keep(annotationGeneration)).concat(payload.data);
  model.count.sort(sortByScore);
  model.count = model.count.filter(function (item, idx, array) {
    return !idx || array[idx - 1].role.score !== item.role.score;
  });
}

// ----------------------------------------------------------------------------

function get(model, query) {
  return model.count;
}

// ----------------------------------------------------------------------------

function getNotificationData(model, request) {
  return get(model);
}

// ----------------------------------------------------------------------------

exports.default = {
  set: set,
  get: get,
  getNotificationData: getNotificationData
};