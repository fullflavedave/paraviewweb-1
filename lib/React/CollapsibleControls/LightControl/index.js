'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LightControl = require('PVWStyle/ReactCollapsibleControls/LightControl.mcss');

var _LightControl2 = _interopRequireDefault(_LightControl);

var _CollapsibleWidget = require('../../Widgets/CollapsibleWidget');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

var _Coordinate2DWidget = require('../../Widgets/Coordinate2DWidget');

var _Coordinate2DWidget2 = _interopRequireDefault(_Coordinate2DWidget);

var _ToggleIconButtonWidget = require('../../Widgets/ToggleIconButtonWidget');

var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

var _NumberInputWidget = require('../../Widgets/NumberInputWidget');

var _NumberInputWidget2 = _interopRequireDefault(_NumberInputWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'LightControl',

  propTypes: {
    light: _react2.default.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return this.props.light.getLightProperties().lightTerms;
  },
  onLightTermsChange: function onLightTermsChange(newVal, name) {
    var _this = this;

    var newState = {};
    newState[name] = newVal;
    this.setState(newState);
    setImmediate(function () {
      _this.props.light.setLightProperties({
        lightTerms: newState
      });
    });
  },
  onLightPositionChange: function onLightPositionChange(event) {
    this.props.light.setLightProperties({
      lightPosition: event
    });
  },
  toggleLight: function toggleLight(enabled) {
    this.props.light.setLightingEnabled(enabled);
  },
  render: function render() {
    var lightButton = _react2.default.createElement(_ToggleIconButtonWidget2.default, { key: 'enable-light-button', onChange: this.toggleLight, value: this.props.light.getLightingEnabled() });
    return _react2.default.createElement(
      _CollapsibleWidget2.default,
      { title: 'Light Properties', subtitle: lightButton, activeSubTitle: true },
      _react2.default.createElement(
        'section',
        { className: _LightControl2.default.container },
        _react2.default.createElement(_Coordinate2DWidget2.default, { onChange: this.onLightPositionChange, width: 114, height: 114, hideXY: true }),
        _react2.default.createElement(
          'section',
          { className: _LightControl2.default.controls },
          _react2.default.createElement(
            'div',
            { className: _LightControl2.default.inputRow },
            _react2.default.createElement(
              'label',
              null,
              'Ambient'
            ),
            _react2.default.createElement(_NumberInputWidget2.default, {
              className: _LightControl2.default.property, step: 0.05, min: 0.0, max: 1.0,
              key: 'ka', value: this.state.ka, name: 'ka', onChange: this.onLightTermsChange
            })
          ),
          _react2.default.createElement(
            'div',
            { className: _LightControl2.default.inputRow },
            _react2.default.createElement(
              'label',
              null,
              'Diffuse'
            ),
            _react2.default.createElement(_NumberInputWidget2.default, {
              className: _LightControl2.default.property, step: 0.05, min: 0.0, max: 1.0,
              key: 'kd', value: this.state.kd, name: 'kd', onChange: this.onLightTermsChange
            })
          ),
          _react2.default.createElement(
            'div',
            { className: _LightControl2.default.inputRow },
            _react2.default.createElement(
              'label',
              null,
              'Specular'
            ),
            _react2.default.createElement(_NumberInputWidget2.default, {
              className: _LightControl2.default.property, step: 0.05, min: 0.0, max: 1.0,
              key: 'ks', value: this.state.ks, name: 'ks', onChange: this.onLightTermsChange
            })
          ),
          _react2.default.createElement(
            'div',
            { className: _LightControl2.default.inputRow },
            _react2.default.createElement(
              'label',
              null,
              'Alpha'
            ),
            _react2.default.createElement(_NumberInputWidget2.default, {
              className: _LightControl2.default.property, step: 1, min: 0.0, max: 100,
              key: 'alpha', value: this.state.alpha, name: 'alpha', onChange: this.onLightTermsChange
            })
          )
        )
      )
    );
  }
});