'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global document */

var _ToggleControl = require('PVWStyle/ComponentNative/ToggleControl.mcss');

var _ToggleControl2 = _interopRequireDefault(_ToggleControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SELECTOR_BUTTON_CLASS = _ToggleControl2.default.jsControlButton;

var CompositeControlContainer = function () {
  function CompositeControlContainer(mainViewport, controlViewport) {
    var _this = this;

    var width = arguments.length <= 2 || arguments[2] === undefined ? 350 : arguments[2];

    _classCallCheck(this, CompositeControlContainer);

    this.container = null;
    this.controlVisible = false;
    this.mainViewport = mainViewport;
    this.controlViewport = controlViewport;
    this.targetWidth = width;

    this.toggleControl = function () {
      _this.controlVisible = !_this.controlVisible;
      if (_this.container) {
        _this.container.querySelector('.' + _ToggleControl2.default.jsControlContent).style.display = _this.controlVisible ? 'flex' : 'none';
        setImmediate(function () {
          return _this.resize();
        });
      }
    };
  }

  _createClass(CompositeControlContainer, [{
    key: 'setContainer',
    value: function setContainer(el) {
      if (this.container && this.container !== el) {
        // Remove listener
        var button = this.container.querySelector('.' + SELECTOR_BUTTON_CLASS);
        if (button) {
          button.removeEventListener('click', this.toggleControl);
        }

        this.mainViewport.setContainer(null);
        this.controlViewport.setContainer(null);

        // Remove us from previous container
        while (this.container.firstChild) {
          this.container.removeChild(this.container.firstChild);
        }
      }

      this.container = el;
      if (this.container) {
        var mainContainer = document.createElement('div');
        mainContainer.classList.add(_ToggleControl2.default.container);
        this.container.appendChild(mainContainer);
        this.mainViewport.setContainer(mainContainer);

        var controlContainer = document.createElement('div');
        controlContainer.classList.add(_ToggleControl2.default.control);
        controlContainer.innerHTML = '<div><i class="' + _ToggleControl2.default.toggleControlButton + '"></i></div><div class="' + _ToggleControl2.default.controlContent + '"></div>';
        this.container.appendChild(controlContainer);

        this.controlViewport.setContainer(controlContainer.querySelector('.' + _ToggleControl2.default.jsControlContent));

        // Add button listener
        var _button = controlContainer.querySelector('.' + SELECTOR_BUTTON_CLASS);
        if (_button) {
          _button.addEventListener('click', this.toggleControl);
        }

        this.resize();
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      if (!this.container) {
        return;
      }

      var controlDiv = this.container.querySelector('.' + _ToggleControl2.default.jsControlContent);
      var rect = this.container.getClientRects()[0];

      if (rect) {
        var height = rect.height;
        var width = rect.width;

        var controlWidth = width < this.targetWidth + 20 ? width - 20 : this.targetWidth;

        controlDiv.style.width = controlWidth + 'px';
        controlDiv.style.height = height - 45 + 'px';

        this.mainViewport.resize();
        this.controlViewport.resize();

        this.render();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.mainViewport.render();
      this.controlViewport.render();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.setContainer(null);
      this.mainViewport.destroy();
      this.controlViewport.destroy();
      this.mainViewport = null;
      this.controlViewport = null;
    }
  }]);

  return CompositeControlContainer;
}();

exports.default = CompositeControlContainer;