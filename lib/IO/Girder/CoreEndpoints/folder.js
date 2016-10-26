define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (_ref) {
    var client = _ref.client;
    var filterQuery = _ref.filterQuery;
    var mustContain = _ref.mustContain;
    var busy = _ref.busy;
    var encodeQueryAsString = _ref.encodeQueryAsString;

    return {
      listFolders: function listFolders() {
        var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var allowed = ['parentType', 'parentId', 'text', 'limit', 'offset', 'sort', 'sortdir'],
            params = filterQuery.apply(undefined, [query].concat(allowed));

        return busy(client._.get('/folder', { params: params }));
      },
      createFolder: function createFolder(folder) {
        var allowed = ['parentType', 'parentId', 'name', 'description', 'public'];
        var params = filterQuery.apply(undefined, [folder].concat(allowed));

        var _mustContain = mustContain(folder, 'parentType', 'parentId', 'name');

        var missingKeys = _mustContain.missingKeys;
        var promise = _mustContain.promise;


        return missingKeys ? promise : busy(client._.post('/folder' + encodeQueryAsString(params)));
      },
      editFolderMetaData: function editFolderMetaData(id, metadata) {
        return busy(client._.put('/folder/' + id, metadata, {
          transformRequest: jsonToString
        }));
      },
      deleteFolder: function deleteFolder(id) {
        return busy(client._.delete('/folder/' + id));
      },
      getFolder: function getFolder(id) {
        return busy(client._.get('/folder/' + id));
      },
      editFolder: function editFolder(folder) {
        var allowed = ['parentType', 'parentId', 'name', 'description'];
        var params = filterQuery.apply(undefined, [folder].concat(allowed));

        var _mustContain2 = mustContain(folder, '_id');

        var missingKeys = _mustContain2.missingKeys;
        var promise = _mustContain2.promise;


        return missingKeys ? promise : busy(client._.put('/folder/' + folder._id + encodeQueryAsString(params)));
      },
      downloadFolder: function downloadFolder(id) {
        return busy(client._.get('/folder/' + id + '/download'));
      },
      getFolderAccess: function getFolderAccess(id) {
        return busy(client._.get('/folder/' + id + '/access'));
      },
      editFolderAccess: function editFolderAccess(folder) {
        var allowed = ['access', 'public'];
        var params = filterQuery.apply(undefined, [folder].concat(allowed));

        var _mustContain3 = mustContain(folder, '_id');

        var missingKeys = _mustContain3.missingKeys;
        var promise = _mustContain3.promise;


        return missingKeys ? promise : busy(client._.put('/folder/' + folder._id + '/access' + encodeQueryAsString(params)));
      }
    };
  };

  /* eslint-disable no-underscore-dangle */
  function jsonToString(data) {
    return JSON.stringify(data);
  }
});