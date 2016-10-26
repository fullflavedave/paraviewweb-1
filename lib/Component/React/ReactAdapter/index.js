define(['exports', 'react', 'react-dom'], function (exports, _react, _reactDom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

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

  var ReactContainer = function () {
    function ReactContainer(reactClass, reactProps) {
      _classCallCheck(this, ReactContainer);

      this.props = reactProps;
      this.reactClass = reactClass;
      this.container = null;
      this.component = null;
    }

    _createClass(ReactContainer, [{
      key: 'setContainer',
      value: function setContainer(el) {
        if (this.container && this.container !== el) {
          _reactDom2.default.unmountComponentAtNode(this.container);
          this.component = null;
        }
        this.container = el;
        if (this.container) {
          var View = this.reactClass;
          this.component = _reactDom2.default.render(_react2.default.createElement(View, this.props), this.container);
        }
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.render();
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.component) {
          this.component.forceUpdate();
        } else if (this.container) {
          var View = this.reactClass;
          _reactDom2.default.render(_react2.default.createElement(View, this.props), this.container);
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.setContainer(null);
        this.reactClass = null;
        this.props = null;
        this.component = null;
      }
    }]);

    return ReactContainer;
  }();

  exports.default = ReactContainer;
});