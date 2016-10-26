'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CompositePipelineWidget = require('PVWStyle/ReactWidgets/CompositePipelineWidget.mcss');

var _CompositePipelineWidget2 = _interopRequireDefault(_CompositePipelineWidget);

var _RootItem = require('./RootItem');

var _RootItem2 = _interopRequireDefault(_RootItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This React component expect the following input properties:
 *   - model:
 *       Expect a CompositePipelineModel instance.
 */
exports.default = _react2.default.createClass({

  displayName: 'CompositePipelineWidget',

  propTypes: {
    model: _react2.default.PropTypes.object.isRequired
  },

  componentDidMount: function componentDidMount() {
    this.attachListener(this.props.model);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var previous = this.props.model,
        next = nextProps.model;

    if (previous !== next) {
      this.detachListener();
      this.attachListener(next);
    }
  },


  // Auto unmount listener
  componentWillUnmount: function componentWillUnmount() {
    this.detachListener();
  },
  attachListener: function attachListener(pipelineModel) {
    var _this = this;

    this.pipelineSubscription = pipelineModel.onChange(function (data, envelope) {
      _this.forceUpdate();
    });
  },
  detachListener: function detachListener() {
    if (this.pipelineSubscription) {
      this.pipelineSubscription.unsubscribe();
      this.pipelineSubscription = null;
    }
  },
  render: function render() {
    var pipelineModel = this.props.model,
        pipelineDescription = pipelineModel.getPipelineDescription();

    return _react2.default.createElement(
      'div',
      { className: _CompositePipelineWidget2.default.container },
      pipelineDescription.map(function (item, idx) {
        return _react2.default.createElement(_RootItem2.default, {
          key: idx,
          item: item,
          layer: item.ids.join(''),
          model: pipelineModel
        });
      })
    );
  }
});