'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var client = _ref.client;
  var filterQuery = _ref.filterQuery;
  var mustContain = _ref.mustContain;
  var busy = _ref.busy;

  return {
    getSimulation: function getSimulation(id) {
      return busy(client._.get('/simulations/' + id));
    },
    editSimulation: function editSimulation(simulation) {
      var expected = ['name', 'description', 'active', 'disabled', 'metadata', 'steps', '_id'],
          sfiltered = filterQuery.apply(undefined, [simulation].concat(_toConsumableArray(expected.slice(0, 6)))); // Remove '_id'

      return busy(client._.patch('/simulations/' + simulation._id, sfiltered, {
        headers: headers, transformRequest: transformRequest
      }));
    },
    deleteSimulation: function deleteSimulation(id) {
      return busy(client._.delete('/simulations/' + id));
    },
    cloneSimulation: function cloneSimulation(id, _ref2) {
      var _ref2$name = _ref2.name;
      var name = _ref2$name === undefined ? 'Cloned simulation' : _ref2$name;

      return busy(client._.post('/simulations/' + id + '/clone'), {
        name: name
      }, {
        headers: headers, transformRequest: transformRequest
      });
    },
    downloadSimulation: function downloadSimulation(id) {
      return busy(client._.get('/simulations/' + id + '/download'));
    },
    getSimulationStep: function getSimulationStep(id, name) {
      return busy(client._.get('/simulations/' + id + '/steps/' + name));
    },
    updateSimulationStep: function updateSimulationStep(id, name, step) {
      return busy(client._.patch('/simulations/' + id + '/steps/' + name, step, {
        headers: headers, transformRequest: transformRequest
      }));
    }
  };
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-underscore-dangle */
/*
    get /simulations/{id}
        Get a simulation

    patch /simulations/{id}
        Update a simulation

    delete /simulations/{id}
        Delete a simulation

    post /simulations/{id}/clone
        Clone a simulation

    get /simulations/{id}/download
        Download all the asset associated with a simulation

    get /simulations/{id}/steps/{stepName}
        Get a particular step in a simulation

    patch /simulations/{id}/steps/{stepName}
        Update a particular step in a simulation
*/

function transformRequest(data) {
  return JSON.stringify(data);
}

var headers = {
  'Content-Type': 'application/json'
};