'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMethods;
/* eslint-disable arrow-body-style */
function createMethods(session) {
  return {
    listServerDirectory: function listServerDirectory() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? '.' : arguments[0];

      return session.call('file.server.directory.list', [path]);
    }
  };
}