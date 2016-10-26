define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMethods;
  /* eslint-disable arrow-body-style */
  function createMethods(session) {
    return {
      storeKeyPair: function storeKeyPair(key, value) {
        return session.call('pv.keyvaluepair.store', [key, value]);
      },
      retrieveKeyPair: function retrieveKeyPair(key) {
        return session.call('pv.keyvaluepair.retrieve', [key]);
      }
    };
  }
});