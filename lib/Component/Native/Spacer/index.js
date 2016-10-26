define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var NativeSpacerComponent = function () {
    function NativeSpacerComponent() {
      var size = arguments.length <= 0 || arguments[0] === undefined ? '30px' : arguments[0];

      _classCallCheck(this, NativeSpacerComponent);

      this.container = null;
      this.size = size;
      this.spacer = document.createElement('div');
      this.spacer.style.position = 'relative';
      this.spacer.style.width = size;
      this.spacer.style.height = size;
    }

    _createClass(NativeSpacerComponent, [{
      key: 'setContainer',
      value: function setContainer(el) {
        if (this.container && this.container !== el) {
          // Remove us from previous container
          this.container.removeChild(this.spacer);
        }

        this.container = el;
        if (this.container) {
          this.container.appendChild(this.spacer);
        }
      }
    }, {
      key: 'resize',
      value: function resize() {}
    }, {
      key: 'render',
      value: function render() {}
    }, {
      key: 'destroy',
      value: function destroy() {
        this.setContainer(null);
      }
    }]);

    return NativeSpacerComponent;
  }();

  exports.default = NativeSpacerComponent;
});