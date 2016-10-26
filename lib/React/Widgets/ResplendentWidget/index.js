define(['exports', 'react'], function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  exports.default = _react2.default.createClass({
    displayName: 'ResplendentWidget',

    propTypes: {
      args: _react2.default.PropTypes.array,
      component: _react2.default.PropTypes.func.isRequired
    },

    getDefaultProps: function getDefaultProps() {
      return {
        args: []
      };
    },
    componentDidMount: function componentDidMount() {
      var Class = this.props.component;
      if (Class) {
        // Instantiate the resplendent component with the specified args.
        this.resp = new (Function.prototype.bind.apply(Class, [null].concat([this._elt], _toConsumableArray(this.props.args))))();
        this.resp.render();
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.resp && this.resp.destroy) {
        this.resp.destroy();
      }
      this.resp = null;
    },
    applyRef: function applyRef(elt) {
      this._elt = elt;
      return elt;
    },
    render: function render() {
      return _react2.default.createElement('div', { ref: this.applyRef });
    }
  });
});