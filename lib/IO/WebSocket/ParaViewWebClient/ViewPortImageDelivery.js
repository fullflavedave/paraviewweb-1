'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMethods;
/* eslint-disable arrow-body-style */
function createMethods(session) {
  return {
    stillRender: function stillRender() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? { size: [400, 400], view: -1 } : arguments[0];

      return session.call('viewport.image.render', [options]);
    }
  };
}