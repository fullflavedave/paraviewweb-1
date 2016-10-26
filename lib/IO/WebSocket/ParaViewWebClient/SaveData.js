define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMethods;
  /* eslint-disable arrow-body-style */
  function createMethods(session) {
    return {
      saveData: function saveData(filePath) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return session.call('pv.data.save', [filePath, options]);
      }
    };
  }
});