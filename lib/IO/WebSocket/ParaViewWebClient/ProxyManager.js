define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMethods;
  /* eslint-disable arrow-body-style */
  function createMethods(session) {
    return {
      create: function create(functionName) {
        var parentId = arguments.length <= 1 || arguments[1] === undefined ? '0' : arguments[1];

        return session.call('pv.proxy.manager.create', [functionName, parentId]);
      },
      open: function open(relativePath) {
        return session.call('pv.proxy.manager.create.reader', [relativePath]);
      },
      get: function get(proxyId) {
        var ui = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        return session.call('pv.proxy.manager.get', [proxyId, ui]);
      },
      findProxyId: function findProxyId(groupName, proxyName) {
        return session.call('pv.proxy.manager.find.id', [groupName, proxyName]);
      },
      update: function update(propsList) {
        return session.call('pv.proxy.manager.update', [propsList]);
      },
      delete: function _delete(proxyId) {
        return session.call('pv.proxy.manager.delete', [proxyId]);
      },
      list: function list() {
        var viewId = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

        return session.call('pv.proxy.manager.list', [viewId]);
      },
      available: function available() {
        var type = arguments.length <= 0 || arguments[0] === undefined ? 'sources' : arguments[0];

        return session.call('pv.proxy.manager.available', [type]);
      },
      availableSources: function availableSources() {
        return session.call('pv.proxy.manager.available', ['sources']);
      },
      availableFilters: function availableFilters() {
        return session.call('pv.proxy.manager.available', ['filters']);
      }
    };
  }
});