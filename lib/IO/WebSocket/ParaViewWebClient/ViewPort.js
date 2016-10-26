'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMethods;
/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
function createMethods(session) {
  return {
    resetCamera: function resetCamera() {
      var view = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

      return session.call('viewport.camera.reset', [view]);
    },
    updateOrientationAxesVisibility: function updateOrientationAxesVisibility() {
      var view = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
      var showAxis = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      return session.call('viewport.axes.orientation.visibility.update', [view, showAxis]);
    },
    updateCenterAxesVisibility: function updateCenterAxesVisibility() {
      var view = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
      var showAxis = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      return session.call('viewport.axes.center.visibility.update', [view, showAxis]);
    },
    updateCamera: function updateCamera() {
      var view_id = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
      var focal_point = arguments.length <= 1 || arguments[1] === undefined ? [0, 0, 0] : arguments[1];
      var view_up = arguments.length <= 2 || arguments[2] === undefined ? [0, 1, 0] : arguments[2];
      var position = arguments.length <= 3 || arguments[3] === undefined ? [0, 0, 1] : arguments[3];

      return session.call('viewport.camera.update', [view_id, focal_point, view_up, position]);
    },
    getCamera: function getCamera() {
      var view_id = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

      return session.call('viewport.camera.get', [view_id]);
    },
    updateSize: function updateSize() {
      var view_id = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
      var width = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
      var height = arguments.length <= 2 || arguments[2] === undefined ? 500 : arguments[2];

      return session.call('viewport.size.update', [view_id, width, height]);
    }
  };
}