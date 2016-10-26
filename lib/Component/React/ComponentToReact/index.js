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

  exports.default = _react2.default.createClass({

    displayName: 'ComponentToReact',

    propTypes: {
      className: _react2.default.PropTypes.string,
      component: _react2.default.PropTypes.object
    },

    componentDidMount: function componentDidMount() {
      if (this.props.component) {
        this.props.component.setContainer(this.refs.container);
        this.props.component.resize();
      }
    },
    componentDidUpdate: function componentDidUpdate() {
      if (this.props.component) {
        this.props.component.resize();
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.props.component) {
        this.props.component.setContainer(null);
      }
    },
    resize: function resize() {
      if (this.props.component) {
        this.props.component.resize();
      }
    },
    render: function render() {
      return _react2.default.createElement('div', { className: this.props.className, ref: 'container' });
    }
  });
});