'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this */

var NativeBackgroundColorComponent = function () {
  function NativeBackgroundColorComponent(color, el) {
    _classCallCheck(this, NativeBackgroundColorComponent);

    this.color = color;
    this.setContainer(el);
    this.previousColor = '';
  }

  /*
   * We must not mess with the position properties of the style on the container
   * we are given, or we will break the workbench layout functionality!  Setting the
   * background color is fine, however, as long as we don't use the setAttribute()
   * approach to this.  Also, we could always create our own container
   * within the element we are given, and we can do whatever we want with that.
   */

  _createClass(NativeBackgroundColorComponent, [{
    key: 'setContainer',
    value: function setContainer(el) {
      if (this.el) {
        this.el.style['background-color'] = this.previousColor;
      }

      this.el = el;

      if (el) {
        this.previousColor = this.el.style['background-color'];
        this.el.style['background-color'] = this.color;
      }
    }
  }, {
    key: 'render',
    value: function render() {}
  }, {
    key: 'resize',
    value: function resize() {}
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);

  return NativeBackgroundColorComponent;
}();

exports.default = NativeBackgroundColorComponent;