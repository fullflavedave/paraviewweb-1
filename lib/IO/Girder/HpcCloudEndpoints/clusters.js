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

    // get /clusters
    //     Search for clusters with certain properties

    listClusters: function listClusters(params) {
      if (Object.keys(params).length) {
        return busy(client._.get('/clusters', { params: params }));
      }
      return busy(client._.get('/clusters'));
    },


    // post /clusters
    //     Create a cluster
    createCluster: function createCluster(cluster) {
      return busy(client._.post('/clusters', cluster, {
        transformRequest: transformRequest, headers: headers
      }));
    },


    // get /clusters/{id}
    //     Get a cluster
    getCluster: function getCluster(id) {
      return busy(client._.get('/clusters/' + id));
    },


    // patch /clusters/{id}
    //     Update the cluster
    updateCluster: function updateCluster(cluster) {
      var editableCluster = (0, _deepClone2.default)(cluster);
      var expected = ['name', 'type', 'config', '_id'];
      var cfiltered = filterQuery.apply(undefined, [editableCluster].concat(_toConsumableArray(expected.slice(0, 3))));

      var _mustContain = mustContain.apply(undefined, [cluster].concat(expected));

      var missingKeys = _mustContain.missingKeys;
      var promise = _mustContain.promise;

      // Remove read only fields if any

      if (editableCluster.config.ssh && editableCluster.config.ssh.user) {
        delete editableCluster.config.ssh.user;
      }
      if (editableCluster.config.host) {
        delete editableCluster.config.host;
      }

      return missingKeys ? promise : busy(client._.patch('/clusters/' + cluster._id, cfiltered, {
        transformRequest: transformRequest, headers: headers
      }));
    },


    // delete /clusters/{id}
    //     Delete a cluster and its configuration
    deleteCluster: function deleteCluster(id) {
      return busy(client._.delete('/clusters/' + id));
    },


    // put /clusters/{id}/job/{jobId}/submit
    //     Submit a job to the cluster
    submitJob: function submitJob(clusterId, jobId) {
      return busy(client._.put('/clusters/' + clusterId + '/job/' + jobId + '/submit'));
    },


    // get /clusters/{id}/log
    //     Get log entries for cluster
    getClusterLogs: function getClusterLogs(taskId) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (offset) {
        return busy(client._.get('/clusters/' + taskId + '/log?offset=' + offset));
      }
      return busy(client._.get('/clusters/' + taskId + '/log'));
    },


    // PUT /clusters/{id}/provision Provision a cluster with ansible
    provisionCluster: function provisionCluster(id, params) {
      return busy(client._.put('/clusters/' + id + '/provision', params));
    },


    // put /clusters/{id}/start
    //     Start a cluster (ec2 only)
    startCluster: function startCluster(id) {
      return busy(client._.put('/clusters/' + id + '/start'));
    },


    // get /clusters/{id}/status
    //     Get the clusters current state
    getClusterStatus: function getClusterStatus(id) {
      return busy(client._.get('/clusters/' + id + '/status'));
    },


    // put /clusters/{id}/terminate
    //     Terminate a cluster
    terminateCluster: function terminateCluster(id) {
      return busy(client._.put('/clusters/' + id + '/terminate'));
    }
  };
};

var _deepClone = require('mout/src/lang/deepClone');

var _deepClone2 = _interopRequireDefault(_deepClone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-underscore-dangle */


function transformRequest(data) {
  return JSON.stringify(data);
}

var headers = {
  'Content-Type': 'application/json'
};