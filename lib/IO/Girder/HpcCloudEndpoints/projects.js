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
    listProjects: function listProjects() {
      return busy(client._.get('/projects'));
    },
    createProject: function createProject(project) {
      var expected = ['name', 'type', 'steps', 'metadata'];

      var _mustContain = mustContain.apply(undefined, [project].concat(expected));

      var missingKeys = _mustContain.missingKeys;
      var promise = _mustContain.promise;

      return missingKeys ? promise : busy(client._.post('/projects', project));
    },
    getProject: function getProject(id) {
      return busy(client._.get('/projects/' + id));
    },
    updateProject: function updateProject(project) {
      var expected = ['name', 'description', 'metadata', '_id'];
      var pfiltered = filterQuery.apply(undefined, [project].concat(_toConsumableArray(expected.slice(0, 3))));
      var _mustContain2 = mustContain.apply(undefined, [project].concat(expected));

      var // Remove '_id'
      missingKeys = _mustContain2.missingKeys;
      var promise = _mustContain2.promise;


      return missingKeys ? promise : busy(client._.patch('/projects/' + project._id, pfiltered, {
        headers: headers, transformRequest: transformRequest
      }));
    },
    deleteProject: function deleteProject(id) {
      return busy(client._.delete('/projects/' + id));
    },
    shareProject: function shareProject(id) {
      return busy(client._.put('/projects/' + id + '/share'));
    },


    // List all the simulations associated with a project
    listSimulations: function listSimulations(projectId) {
      return busy(client._.get('/projects/' + projectId + '/simulations'));
    },


    // post /projects/{id}/simulations
    // Create a simulation associated with a project
    createSimulation: function createSimulation(projectId, simualtion) {
      var expected = ['name', 'description', 'steps', 'active', 'disabled'],
          sfiltered = filterQuery.apply(undefined, [simualtion].concat(expected));

      return busy(client._.post('/projects/' + projectId + '/simulations', sfiltered, {
        headers: headers, transformRequest: transformRequest
      }));
    }
  };
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-underscore-dangle */
function transformRequest(data) {
  return JSON.stringify(data);
}

var headers = {
  'Content-Type': 'application/json'
};