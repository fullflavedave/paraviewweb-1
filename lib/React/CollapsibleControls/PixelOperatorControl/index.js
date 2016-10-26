'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CollapsibleWidget = require('../../Widgets/CollapsibleWidget');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

var _TextInputWidget = require('../../Widgets/TextInputWidget');

var _TextInputWidget2 = _interopRequireDefault(_TextInputWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'PixelOperatorControl',

  propTypes: {
    operator: _react2.default.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      operation: this.props.operator.getOperation()
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.state.operation !== nextProps.operator.getOperation()) {
      this.setState({
        operation: nextProps.operator.getOperation()
      });
    }
  },
  updateOperation: function updateOperation(operation) {
    this.setState({
      operation: operation
    });
    this.props.operator.setOperation(operation);
  },
  render: function render() {
    return _react2.default.createElement(
      _CollapsibleWidget2.default,
      { title: 'Pixel Operation' },
      _react2.default.createElement(_TextInputWidget2.default, { value: this.state.operation, onChange: this.updateOperation })
    );
  }
});