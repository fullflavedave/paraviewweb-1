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
    downloadItem: function downloadItem(id, offset, endByte, contentDisposition) {
      var params = { offset: offset, endByte: endByte, contentDisposition: contentDisposition };
      Object.keys(params).forEach(function (key) {
        if (params[key] === null) {
          delete params[key];
        }
      });
      return busy(client._.get('/item/' + id + '/download' + encodeQueryAsString(params)));
    },
    updateItemMetadata: function updateItemMetadata(id) {
      var metadata = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return busy(client._.put('/item/' + id + '/metadata', metadata, {
        transformRequest: jsonToString
      }));
    },


    // query = { folderId, text, limit, offset, sort, sortdir }
    listItems: function listItems() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var allowed = ['folderId', 'text', 'limit', 'offset', 'sort', 'sortdir'],
          params = filterQuery.apply(undefined, [query].concat(allowed));

      return busy(client._.get('/item' + encodeQueryAsString(params)));
    },
    createItem: function createItem(folderId, name) {
      var description = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      var params = {
        folderId: folderId, name: name, description: description
      };
      return busy(client._.post('/item' + encodeQueryAsString(params)));
    },


    // query = { limit, offset, sort }
    listFiles: function listFiles(id, query) {
      var allowed = ['limit', 'offset', 'sort'],
          params = filterQuery.apply(undefined, [query].concat(allowed));

      if (!id) {
        return new Promise(function (resolve, reject) {
          return reject('No argument id provided');
        });
      }

      return busy(client._.get('/item/' + id + '/files' + encodeQueryAsString(params)));
    },
    getItemRootPath: function getItemRootPath(id) {
      return busy(client._.get('/item/' + id + '/rootpath'));
    },
    getItem: function getItem(id) {
      return busy(client._.get('/item/' + id));
    },
    deleteItem: function deleteItem(id) {
      return busy(client._.delete('/item/' + id));
    },


    // item = { id, folderId, name, description }
    editItem: function editItem(item) {
      var expected = ['folderId', 'name', 'description'];
      var params = filterQuery.apply(undefined, [item].concat(expected));

      var _mustContain = mustContain(params, '_id');

      var missingKeys = _mustContain.missingKeys;
      var promise = _mustContain.promise;


      return missingKeys ? promise : busy(client._.put('/item/' + item._id + encodeQueryAsString(params)));
    },


    // destinationItem = { folderId, name, description }
    copyItem: function copyItem(id, destinationItem) {
      var expected = ['folderId', 'name', 'description'];
      var params = filterQuery.apply(undefined, [destinationItem].concat(expected));

      var _mustContain2 = mustContain(params, 'folderId');

      var missingKeys = _mustContain2.missingKeys;
      var promise = _mustContain2.promise;


      return missingKeys ? promise : busy(client._.post('/item/' + id + '/copy' + encodeQueryAsString(params)));
    }
  };
};

/* eslint-disable no-underscore-dangle */
function jsonToString(data) {
  return JSON.stringify(data);
}