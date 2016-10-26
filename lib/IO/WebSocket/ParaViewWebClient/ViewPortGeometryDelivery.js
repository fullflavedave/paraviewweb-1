define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMethods;
  /* eslint-disable arrow-body-style */
  /* eslint-disable camelcase */
  function createMethods(session) {
    return {
      getSceneMetaData: function getSceneMetaData() {
        var view = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

        return session.call('viewport.webgl.metadata', [view]);
      },
      getWebGLData: function getWebGLData() {
        var view_id = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
        var object_id = arguments[1];
        var part = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        return session.call('viewport.webgl.data', [view_id, object_id, part]);
      },
      getCachedWebGLData: function getCachedWebGLData(sha) {
        return session.call('viewport.webgl.cached.data', [sha]);
      },
      getSceneMetaDataAllTimesteps: function getSceneMetaDataAllTimesteps() {
        var view = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

        return session.call('viewport.webgl.metadata.alltimesteps', [view]);
      }
    };
  }
});