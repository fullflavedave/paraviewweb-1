'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CompositePipelineWidget = require('PVWStyle/ReactWidgets/CompositePipelineWidget.mcss');

var _CompositePipelineWidget2 = _interopRequireDefault(_CompositePipelineWidget);

var _ChildItem = require('./ChildItem');

var _ChildItem2 = _interopRequireDefault(_ChildItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This React component expect the following input properties:
 *   - model:
 *       Expect a LokkupTable instance that you want to render and edit.
 *   - item:
 *       Root of the tree
 *   - layer:
 *       Layer id.
 */
exports.default = _react2.default.createClass({

  displayName: 'CompositePipelineWidget.RootItem',

  propTypes: {
    item: _react2.default.PropTypes.object,
    layer: _react2.default.PropTypes.string,
    model: _react2.default.PropTypes.object
  },

  getInitialState: function getInitialState() {
    return {
      dropDown: false
    };
  },
  toggleVisibility: function toggleVisibility() {
    this.props.model.toggleLayerVisible(this.props.layer);
  },
  toggleDropDown: function toggleDropDown() {
    if (this.props.model.getColor(this.props.layer).length > 1) {
      this.setState({
        dropDown: !this.state.dropDown
      });
    }
  },
  updateColorBy: function updateColorBy(event) {
    this.props.model.setActiveColor(this.props.layer, event.target.dataset.color);
    this.toggleDropDown();
  },
  toggleEditMode: function toggleEditMode() {
    this.props.model.toggleEditMode(this.props.layer);
  },
  updateOpacity: function updateOpacity(e) {
    this.props.model.setOpacity(this.props.layer, e.target.value);
    this.forceUpdate();
  },
  render: function render() {
    var model = this.props.model,
        layer = this.props.layer,
        visible = model.isLayerVisible(this.props.layer),
        children = this.props.item.children || [],
        inEditMode = this.props.model.isLayerInEditMode(this.props.layer),
        hasChildren = children.length > 0,
        hasOpacity = model.hasOpacity(),
        hasDropDown = this.props.model.getColor(this.props.layer).length > 1,
        editButton = hasChildren ? _react2.default.createElement('i', { className: inEditMode ? _CompositePipelineWidget2.default.editButtonOn : _CompositePipelineWidget2.default.editButtonOff, onClick: this.toggleEditMode }) : '';

    return _react2.default.createElement(
      'div',
      { className: _CompositePipelineWidget2.default.section },
      _react2.default.createElement(
        'div',
        { className: _CompositePipelineWidget2.default.item },
        _react2.default.createElement(
          'div',
          { className: _CompositePipelineWidget2.default.label },
          this.props.item.name
        ),
        _react2.default.createElement(
          'div',
          { className: _CompositePipelineWidget2.default.actions },
          editButton,
          _react2.default.createElement('i', {
            className: visible ? _CompositePipelineWidget2.default.visibleButtonOn : _CompositePipelineWidget2.default.visibleButtonOff,
            onClick: this.toggleVisibility
          }),
          _react2.default.createElement('i', {
            className: hasDropDown ? _CompositePipelineWidget2.default.dropDownButtonOn : _CompositePipelineWidget2.default.dropDownButtonOff,
            onClick: this.toggleDropDown
          }),
          _react2.default.createElement(
            'div',
            {
              onClick: this.updateColorBy,
              className: this.state.dropDown ? _CompositePipelineWidget2.default.menu : _CompositePipelineWidget2.default.hidden
            },
            model.getColor(layer).map(function (color) {
              return _react2.default.createElement(
                'div',
                {
                  key: color, 'data-color': color,
                  className: model.isActiveColor(layer, color) ? _CompositePipelineWidget2.default.selectedMenuItem : _CompositePipelineWidget2.default.menuItem
                },
                model.getColorToLabel(color)
              );
            })
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: hasOpacity && !hasChildren ? _CompositePipelineWidget2.default.item : _CompositePipelineWidget2.default.hidden },
        _react2.default.createElement('input', {
          className: _CompositePipelineWidget2.default.opacity,
          type: 'range',
          min: '0',
          max: '100',
          value: model.getOpacity(layer),
          onChange: this.updateOpacity
        })
      ),
      _react2.default.createElement(
        'div',
        { className: _CompositePipelineWidget2.default.children },
        children.map(function (item, idx) {
          return _react2.default.createElement(_ChildItem2.default, { key: idx, item: item, layer: item.ids.join(''), model: model });
        })
      )
    );
  }
});