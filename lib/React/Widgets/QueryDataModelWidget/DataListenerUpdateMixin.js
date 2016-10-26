define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    // Callback for data handler

    dataListenerCallback: function dataListenerCallback(data, envelope) {
      this.forceUpdate();
    }
  };
});