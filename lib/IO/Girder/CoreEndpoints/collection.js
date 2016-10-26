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
      listCollections: function listCollections() {
        var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var expected = ['text', 'limit', 'offset', 'sort', 'sortdir'],
            params = filterQuery.apply(undefined, [query].concat(expected));

        return client._.get('/collection', { params: params });
      },
      createCollection: function createCollection(collection) {
        var expected = ['name', 'description', 'public'];
        var params = filterQuery.apply(undefined, [collection].concat(expected));

        var _mustContain = mustContain.apply(undefined, [params].concat(expected));

        var missingKeys = _mustContain.missingKeys;
        var promise = _mustContain.promise;


        return missingKeys ? promise : busy(client._.post('/collection' + encodeQueryAsString(params)));
      },
      deleteCollection: function deleteCollection(id) {
        return busy(client._.delete('/collection/' + id));
      },
      getCollection: function getCollection(id) {
        return busy(client._.get('/collection/' + id));
      },
      editCollection: function editCollection() {
        var collection = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var expected = ['name', 'description'];
        var params = filterQuery.apply(undefined, [collection].concat(expected));

        var _mustContain2 = mustContain(collection, '_id');

        var missingKeys = _mustContain2.missingKeys;
        var promise = _mustContain2.promise;


        return missingKeys ? promise : busy(client._.put('/collection/' + collection._id + encodeQueryAsString(params)));
      },
      getCollectionAccess: function getCollectionAccess(id) {
        return busy(client._.get('/collection/' + id + '/access'));
      },
      editCollectionAccess: function editCollectionAccess(collection) {
        var expected = ['access', 'public'];
        var params = filterQuery.apply(undefined, [collection].concat(expected));

        var _mustContain3 = mustContain(collection, '_id');

        var missingKeys = _mustContain3.missingKeys;
        var promise = _mustContain3.promise;


        return missingKeys ? promise : busy(client._.put('/collection/' + collection._id + '/access' + encodeQueryAsString(params)));
      }
    };
  };
});