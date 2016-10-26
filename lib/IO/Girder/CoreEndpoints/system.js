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
      deleteSetting: function deleteSetting(key) {
        return busy(client._.delete('/system/setting' + encodeQueryAsString({ key: key })));
      },
      getSettings: function getSettings(settings) {
        var expected = ['key', 'list', 'default'],
            params = filterQuery.apply(undefined, [settings].concat(expected));

        return busy(client._.get('/system/setting', {
          params: params
        }));
      },
      setSettings: function setSettings(keyValueMap) {
        var list = Object.keys(keyValueMap).map(function (key) {
          var value = keyValueMap[key];
          return {
            key: key, value: value
          };
        });

        return busy(client._.put('/system/setting' + encodeQueryAsString({ list: list })));
      },
      getServerVersion: function getServerVersion() {
        return busy(client._.get('/system/version'));
      },
      listUnfinishedUpload: function listUnfinishedUpload() {
        var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var allowed = ['uploadId', 'userId', 'parentId', 'assetstoreId', 'minimumAge', 'includeUntracked', 'limit', 'offset', 'sort', 'sortdir'],
            params = filterQuery.apply(undefined, [query].concat(allowed));

        return busy(client._.get('/system/uploads', {
          params: params
        }));
      },
      removeUnfinishedUpload: function removeUnfinishedUpload() {
        var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var allowed = ['uploadId', 'userId', 'parentId', 'assetstoreId', 'minimumAge', 'includeUntracked'],
            params = filterQuery.apply(undefined, [query].concat(allowed));

        return busy(client._.delete('/system/uploads' + encodeQueryAsString(params)));
      },
      listPlugins: function listPlugins() {
        return busy(client._.get('/system/plugins'));
      },
      setActivePlugins: function setActivePlugins(plugins) {
        return busy(client._.put('/system/plugins' + encodeQueryAsString({ plugins: plugins })));
      }
    };
  };
});