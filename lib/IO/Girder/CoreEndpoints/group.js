define(['exports'], function (exports) {
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
      updateGroupModerator: function updateGroupModerator(groupId, userId, onOff) {
        var url = '/group/' + groupId + '/moderator?userId=' + userId;
        return onOff ? client._.post(url) : client._.delete(url);
      },
      updateGroupAdmin: function updateGroupAdmin(groupdId, userId, onOff) {
        var url = '/group/' + groupdId + '/admin?userId=' + userId;
        return onOff ? client._.post(url) : client._.delete(url);
      },
      createGroup: function createGroup(group) {
        var expected = ['name', 'description', 'public'];
        var params = filterQuery.apply(undefined, [group].concat(expected));

        var _mustContain = mustContain(params, 'name');

        var missingKeys = _mustContain.missingKeys;
        var promise = _mustContain.promise;


        return missingKeys ? promise : busy(client._.post('/group' + encodeQueryAsString(params)));
      },
      deleteGroup: function deleteGroup(id) {
        return busy(client._.delete('/group/' + id));
      },
      getGroup: function getGroup(id) {
        return busy(client._.get('/group/' + id));
      },
      editGroup: function editGroup() {
        var group = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var expected = ['name', 'description', 'public'];
        var params = filterQuery.apply(undefined, [group].concat(expected));

        var _mustContain2 = mustContain(group, '_id');

        var missingKeys = _mustContain2.missingKeys;
        var promise = _mustContain2.promise;


        return missingKeys ? promise : busy(client._.put('/group/' + group._id + encodeQueryAsString(params)));
      },
      listGroupInvitations: function listGroupInvitations(id) {
        var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var allowed = ['limit', 'offset', 'sort', 'sortdir'],
            params = filterQuery.apply(undefined, [query].concat(allowed));

        return busy(client._.get('/group/' + id + '/invitation', {
          params: params
        }));
      },
      addGroupInvitation: function addGroupInvitation(id) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var allowed = ['userId', 'level', 'quiet'];
        var params = filterQuery.apply(undefined, [options].concat(allowed));

        var _mustContain3 = mustContain(params, 'userId');

        var missingKeys = _mustContain3.missingKeys;
        var promise = _mustContain3.promise;


        return missingKeys ? promise : busy(client._.post('/group/' + id + '/invitation' + encodeQueryAsString(params)));
      },
      listGroupMembers: function listGroupMembers(id) {
        var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var allowed = ['limit', 'offset', 'sort', 'sortdir'],
            params = filterQuery.apply(undefined, [query].concat(allowed));

        return busy(client._.get('/group/' + id + '/member', {
          params: params
        }));
      },
      removeUserFromGroup: function removeUserFromGroup(id, userId) {
        var params = {
          userId: userId
        };
        return busy(client._.delete('/group/' + id + '/member', {
          params: params
        }));
      },
      joinGroup: function joinGroup(id) {
        return busy(client._.post('/group/' + id + '/member'));
      },
      getGroupAccess: function getGroupAccess(id) {
        return busy(client._.get('/group/' + id + '/access'));
      }
    };
  };
});