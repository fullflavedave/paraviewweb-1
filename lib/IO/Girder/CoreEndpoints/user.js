'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var /* eslint-disable no-underscore-dangle */
  client = _ref.client;
  var filterQuery = _ref.filterQuery;
  var mustContain = _ref.mustContain;
  var busy = _ref.busy;
  var encodeQueryAsString = _ref.encodeQueryAsString;

  return {
    listUsers: function listUsers(query) {
      var params = filterQuery(query, 'text', 'limit', 'offset', 'sort', 'sortdir');
      return busy(client._.get('/user', {
        params: params
      }));
    },
    createUser: function createUser(user) {
      var expected = ['login', 'email', 'firstName', 'lastName', 'password', 'admin'];
      var params = filterQuery.apply(undefined, [user].concat(expected));

      var _mustContain = mustContain.apply(undefined, [user].concat(expected));

      var missingKeys = _mustContain.missingKeys;
      var promise = _mustContain.promise;


      return missingKeys ? promise : busy(client._.post('/user' + encodeQueryAsString(params)));
    },
    changePassword: function changePassword(old, newPassword) {
      var params = {
        old: old, new: newPassword
      };
      return busy(client._.put('/user/password' + encodeQueryAsString(params)));
    },
    resetPassword: function resetPassword(email) {
      var params = {
        email: email
      };
      return busy(client._.delete('/user/password', {
        params: params
      }));
    },
    deleteUser: function deleteUser(id) {
      return busy(client._.delete('/user/' + id));
    },
    getUser: function getUser(id) {
      return busy(client._.get('/user/' + id));
    },
    updateUser: function updateUser(user) {
      var expected = ['email', 'firstName', 'lastName', '_id'];
      var params = filterQuery.apply(undefined, [user].concat(_toConsumableArray(expected.slice(0, 3))));
      var _mustContain2 = mustContain.apply(undefined, [user].concat(expected));

      var // Remove '_id'
      missingKeys = _mustContain2.missingKeys;
      var promise = _mustContain2.promise;


      return missingKeys ? promise : busy(client._.put('/user/' + user._id + encodeQueryAsString(params)));
    }
  };
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }