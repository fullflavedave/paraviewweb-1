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
      downloadResources: function downloadResources(resourceList) {
        var withMetadata = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var params = {
          resourceList: JSON.toString(resourceList),
          withMetadata: withMetadata
        };

        return busy(client._.get('/resource/download', {
          params: params
        }));
      },
      searchResources: function searchResources(query, types) {
        var params = {
          q: JSON.toString(query),
          types: JSON.toString(types)
        };
        return busy(client._.get('/resource/search', {
          params: params
        }));
      },
      deleteResources: function deleteResources(resourceList) {
        var params = {
          resources: JSON.toString(resourceList)
        };
        return busy(client._.delete('/resource', {
          params: params
        }));
      }
    };
  };
});