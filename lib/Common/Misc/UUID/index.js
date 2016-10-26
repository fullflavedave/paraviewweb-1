define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.generateUUID = generateUUID;
  /**
   * The following method was adapted from code found here:
   *
   *    http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   */

  /* global window */
  /* eslint-disable no-bitwise */

  function generateUUID() {
    var d = Date.now();
    if (window.performance && typeof window.performance.now === 'function') {
      d += window.performance.now(); // use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  }

  exports.default = {
    generateUUID: generateUUID
  };
});