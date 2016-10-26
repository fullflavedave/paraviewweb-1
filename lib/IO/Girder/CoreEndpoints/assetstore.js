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
    listAssetStores: function listAssetStores() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var expected = ['limit', 'offset', 'sort', 'sortdir'],
          params = filterQuery.apply(undefined, [query].concat(expected));

      return client._.get('/assetstore', {
        params: params
      });
    },
    createAssetStore: function createAssetStore(assetstore) {
      var required = ['name', 'type'];
      var possible = ['root', 'db', 'bucket', 'prefix', 'accessKeyId', 'secretKey', 'service'];
      var params = filterQuery.apply(undefined, [assetstore].concat(_toConsumableArray([].concat(required, possible))));

      var _mustContain = mustContain.apply(undefined, [assetstore].concat(required));

      var missingKeys = _mustContain.missingKeys;
      var promise = _mustContain.promise;


      return missingKeys ? promise : busy(client._.post('/assetstore' + encodeQueryAsString(params)));
    },
    updateAssetStore: function updateAssetStore(assetstore) {
      var expected = ['name', 'root', 'db', 'current', '_id'],
          params = filterQuery(assetstore, expected.slice(0, expected.length - 1)); // Remove 'id'

      return client._.put('/assetstore/' + assetstore._id, {
        params: params
      });
    },
    deleteAssetStore: function deleteAssetStore(id) {
      return client._.delete('/assetstore/' + id);
    }
  };
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }