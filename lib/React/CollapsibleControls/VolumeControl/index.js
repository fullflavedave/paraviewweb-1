'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CollapsibleWidget = require('../../Widgets/CollapsibleWidget');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

var _EqualizerWidget = require('../../Widgets/EqualizerWidget');

var _EqualizerWidget2 = _interopRequireDefault(_EqualizerWidget);

var _ToggleIconButtonWidget = require('../../Widgets/ToggleIconButtonWidget');

var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

var _LookupTableWidget = require('../../Widgets/LookupTableWidget');

var _LookupTableWidget2 = _interopRequireDefault(_LookupTableWidget);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _VolumeControl = require('PVWStyle/ReactCollapsibleControls/VolumeControl.mcss');

var _VolumeControl2 = _interopRequireDefault(_VolumeControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'VolumeControl',

  propTypes: {
    computation: _react2.default.PropTypes.object.isRequired,
    equalizer: _react2.default.PropTypes.object.isRequired,
    intensity: _react2.default.PropTypes.object,
    lookupTable: _react2.default.PropTypes.object.isRequired
  },

  componentWillMount: function componentWillMount() {
    var _this = this;

    this.equalizerSubscription = this.props.equalizer.onChange(function () {
      _this.forceUpdate();
    });
    this.intensitySubscription = this.props.intensity.onChange(function () {
      _this.forceUpdate();
    });
    this.computationSubscription = this.props.intensity.onChange(function () {
      _this.forceUpdate();
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.equalizerSubscription) {
      this.equalizerSubscription.unsubscribe();
      this.equalizerSubscription = null;
    }
    if (this.intensitySubscription) {
      this.intensitySubscription.unsubscribe();
      this.intensitySubscription = null;
    }
    if (this.computationSubscription) {
      this.computationSubscription.unsubscribe();
      this.computationSubscription = null;
    }
  },
  render: function render() {
    var equalizer = this.props.equalizer,
        lut = this.props.lookupTable,
        intensityButton = _react2.default.createElement(_ToggleIconButtonWidget2.default, {
      key: 'toggle-intensity',
      onChange: this.props.intensity.toggleState,
      value: this.props.intensity.getState()
    }),
        resetOpacityButton = _react2.default.createElement(_ToggleIconButtonWidget2.default, {
      key: 'reset',
      icon: _VolumeControl2.default.undoIcon,
      toggle: false,
      onChange: this.props.equalizer.resetOpacities,
      value: true
    }),
        cpuGpuButton = _react2.default.createElement(_ToggleIconButtonWidget2.default, {
      key: 'toggle-gpu',
      icon: _VolumeControl2.default.mobileIcon,
      onChange: this.props.computation.toggleState,
      value: !this.props.computation.getState()
    });

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _CollapsibleWidget2.default,
        {
          title: 'LookupTable',
          key: 'LookupTableWidget_parent',
          subtitle: intensityButton
        },
        _react2.default.createElement(_LookupTableWidget2.default, {
          key: 'LookupTableWidget',
          ref: 'LookupTableWidget',
          originalRange: lut.originalRange,
          lookupTable: lut.lookupTable,
          lookupTableManager: lut.lookupTableManager
        })
      ),
      _react2.default.createElement(
        _CollapsibleWidget2.default,
        { title: 'Opacity Control', subtitle: [cpuGpuButton, resetOpacityButton] },
        _react2.default.createElement(_EqualizerWidget2.default, {
          ref: 'EqualizerWidget',
          key: 'Equalizer',
          layers: equalizer.getOpacities(),
          onChange: equalizer.updateOpacities,
          colors: equalizer.getColors(),
          spacing: 5
        })
      )
    );
  }
});