'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CompositePipelineWidget = require('PVWStyle/ReactWidgets/CompositePipelineWidget.mcss');

var _CompositePipelineWidget2 = _interopRequireDefault(_CompositePipelineWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This React component expect the following input properties:
 *   - model:
 *       Expect a LokkupTable instance that you want to render and edit.
 *   - item:
 *       Root of the tree
 */
exports.default = _react2.default.createClass({

  displayName: 'CompositePipelineWidget.ChildItem',

  propTypes: {
    item: _react2.default.PropTypes.object,
    layer: _react2.default.PropTypes.string,
    model: _react2.default.PropTypes.object
  },

  toggleActiveLayer: function toggleActiveLayer(event) {
    this.props.model.toggleLayerActive(this.props.layer);
  },
  updateOpacity: function updateOpacity(e) {
    this.props.model.setOpacity(this.props.layer, e.target.value);
    this.forceUpdate();
  },
  render: function render() {
    var inEditMode = this.props.model.isLayerInEditMode(this.props.layer),
        isActive = this.props.model.isLayerActive(this.props.layer),
        hidden = !isActive && !inEditMode,
        hasOpacity = this.props.model.hasOpacity();

    return _react2.default.createElement(
      'div',
      { className: hidden ? _CompositePipelineWidget2.default.hidden : _CompositePipelineWidget2.default.childItem },
      _react2.default.createElement('i', {
        className: !inEditMode ? _CompositePipelineWidget2.default.deleteButtonOff : isActive ? _CompositePipelineWidget2.default.activeButton : _CompositePipelineWidget2.default.deleteButtonOn,
        onClick: this.toggleActiveLayer
      }),
      _react2.default.createElement(
        'div',
        { className: _CompositePipelineWidget2.default.label },
        this.props.item.name
      ),
      _react2.default.createElement('input', {
        className: hasOpacity ? _CompositePipelineWidget2.default.opacity : _CompositePipelineWidget2.default.hidden,
        type: 'range',
        min: '0',
        max: '100',
        value: this.props.model.getOpacity(this.props.layer),
        onChange: this.updateOpacity
      })
    );
  }
});