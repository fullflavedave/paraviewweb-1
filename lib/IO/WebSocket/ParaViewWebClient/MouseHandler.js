'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMethods;
/* eslint-disable arrow-body-style */
function createMethods(session) {
  return {
    interaction: function interaction(event) {
      return session.call('viewport.mouse.interaction', [event]);
    }
  };
}