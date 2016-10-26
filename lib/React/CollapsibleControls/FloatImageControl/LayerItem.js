'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FloatImageControl = require('PVWStyle/ReactCollapsibleControls/FloatImageControl.mcss');

var _FloatImageControl2 = _interopRequireDefault(_FloatImageControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'FloatImageControl.LayerItem',

  propTypes: {
    item: _react2.default.PropTypes.object.isRequired,
    model: _react2.default.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      change: false,
      dropDown: false
    };
  },
  toggleMesh: function toggleMesh() {
    if (this.props.item.hasMesh) {
      this.props.model.updateMaskLayerVisibility(this.props.item.name, !this.props.item.meshActive);
      this.setState({ change: !this.state.change });
    }
  },
  toggleVisibility: function toggleVisibility() {
    this.props.model.updateLayerVisibility(this.props.item.name, !this.props.item.active);
    this.setState({ change: !this.state.change });
  },
  toggleDropDown: function toggleDropDown() {
    if (this.props.item.arrays.length > 1) {
      this.setState({ dropDown: !this.state.dropDown });
    }
  },
  updateColorBy: function updateColorBy(event) {
    this.props.model.updateLayerColorBy(this.props.item.name, event.target.dataset.color);
    this.toggleDropDown();
  },
  render: function render() {
    var layer = this.props.item,
        visible = layer.active,
        meshVisible = layer.meshActive,
        meshAvailable = layer.hasMesh,
        hasDropDown = layer.arrays.length > 1;

    return _react2.default.createElement(
      'div',
      { className: _FloatImageControl2.default.item },
      _react2.default.createElement(
        'div',
        { className: _FloatImageControl2.default.sceneLabel },
        layer.name
      ),
      _react2.default.createElement(
        'div',
        { className: _FloatImageControl2.default.sceneActions },
        _react2.default.createElement('i', {
          className: meshAvailable ? meshVisible ? _FloatImageControl2.default.meshButtonOn : _FloatImageControl2.default.meshButtonOff : _FloatImageControl2.default.hidden,
          onClick: this.toggleMesh
        }),
        _react2.default.createElement('i', {
          className: visible ? _FloatImageControl2.default.visibleButtonOn : _FloatImageControl2.default.visibleButtonOff,
          onClick: this.toggleVisibility
        }),
        _react2.default.createElement('i', {
          className: hasDropDown ? _FloatImageControl2.default.dropDownButtonOn : _FloatImageControl2.default.dropDownButtonOff,
          onClick: this.toggleDropDown
        }),
        _react2.default.createElement(
          'div',
          {
            onClick: this.updateColorBy,
            className: this.state.dropDown ? _FloatImageControl2.default.menu : _FloatImageControl2.default.hidden
          },
          layer.arrays.map(function (color) {
            return _react2.default.createElement(
              'div',
              {
                key: color,
                'data-color': color,
                className: color === layer.array ? _FloatImageControl2.default.selectedMenuItem : _FloatImageControl2.default.menuItem
              },
              color
            );
          })
        )
      )
    );
  }
});