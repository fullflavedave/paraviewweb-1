define(['exports', 'PVWStyle/ComponentNative/Composite.mcss'], function (exports, _Composite) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Composite2 = _interopRequireDefault(_Composite);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var NativeCompositeComponent = function () {
    function NativeCompositeComponent(el) {
      _classCallCheck(this, NativeCompositeComponent);

      this.container = null;
      this.viewports = [];
      this.styles = [];
      this.setContainer(el);
    }

    _createClass(NativeCompositeComponent, [{
      key: 'addViewport',
      value: function addViewport(viewport) {
        var expand = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        this.viewports.push(viewport);
        var css = expand ? _Composite2.default.viewport : _Composite2.default.fixViewport;
        this.styles.push(css);

        if (this.container) {
          var subElem = document.createElement('div');
          subElem.classList.add(css);
          this.container.appendChild(subElem);
          viewport.setContainer(subElem);
        }
      }
    }, {
      key: 'clearViewports',
      value: function clearViewports() {
        while (this.viewports.length) {
          this.viewports.pop().setContainer(null);
          this.styles.pop();
        }
      }
    }, {
      key: 'setContainer',
      value: function setContainer(el) {
        var _this = this;

        if (this.container && this.container !== el) {
          // Remove us from previous container
          this.container.classList.remove(_Composite2.default.container);
          this.viewports.forEach(function (viewport) {
            return viewport.setContainer(null);
          });
          while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
          }
        }

        this.container = el;
        if (this.container) {
          this.container.classList.add(_Composite2.default.container);
          this.viewports.forEach(function (viewport, idx) {
            var subElem = document.createElement('div');
            subElem.classList.add(_this.styles[idx]);
            _this.container.appendChild(subElem);
            viewport.setContainer(subElem);
          });
        }
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.viewports.forEach(function (viewport) {
          return viewport.resize();
        });
      }
    }, {
      key: 'render',
      value: function render() {
        this.viewports.forEach(function (viewport) {
          return viewport.render();
        });
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.clearViewports();
        this.setContainer(null);
      }
    }]);

    return NativeCompositeComponent;
  }();

  exports.default = NativeCompositeComponent;
});