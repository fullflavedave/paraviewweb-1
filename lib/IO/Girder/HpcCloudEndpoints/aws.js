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
    listAWSProfiles: function listAWSProfiles() {
      return getUnauthenticatedPromise(client) || busy(client._.get('/user/' + client.user._id + '/aws/profiles'));
    },
    createAWSProfile: function createAWSProfile(awsProfile) {
      return getUnauthenticatedPromise(client) || busy(client._.post('/user/' + client.user._id + '/aws/profiles', awsProfile, {
        headers: headers, transformRequest: transformRequest
      }));
    },
    updateAWSProfile: function updateAWSProfile(awsProfile) {
      return getUnauthenticatedPromise(client) || busy(client._.patch('/user/' + client.user._id + '/aws/profiles/' + awsProfile._id, awsProfile, {
        headers: headers, transformRequest: transformRequest
      }));
    },
    listAWSRunningInstances: function listAWSRunningInstances(id) {
      return getUnauthenticatedPromise(client) || busy(client._.get('/user/' + client.user._id + '/aws/profiles/' + id + '/runninginstances'));
    },
    getAWSMaxInstances: function getAWSMaxInstances(id) {
      return getUnauthenticatedPromise(client) || busy(client._.get('/user/' + client.user._id + '/aws/profiles/' + id + '/maxinstances'));
    },
    deleteAWSProfile: function deleteAWSProfile(id) {
      return getUnauthenticatedPromise(client) || busy(client._.delete('/user/' + client.user._id + '/aws/profiles/' + id));
    }
  };
};

/* eslint-disable no-underscore-dangle */
function transformRequest(data) {
  return JSON.stringify(data);
}

var headers = {
  'Content-Type': 'application/json'
};

function getUnauthenticatedPromise(client) {
  if (client.user) {
    return null;
  }

  return new Promise(function (ok, ko) {
    return ko({
      data: {
        message: 'Must be logged in.'
      }
    });
  });
}