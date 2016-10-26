define(['exports', 'react', 'PVWStyle/ReactWidgets/ColorByWidget.mcss', '../PresetListWidget', '../ScalarRangeWidget', '../PieceWiseFunctionEditorWidget'], function (exports, _react, _ColorByWidget, _PresetListWidget, _ScalarRangeWidget, _PieceWiseFunctionEditorWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ColorByWidget2 = _interopRequireDefault(_ColorByWidget);

  var _PresetListWidget2 = _interopRequireDefault(_PresetListWidget);

  var _ScalarRangeWidget2 = _interopRequireDefault(_ScalarRangeWidget);

  var _PieceWiseFunctionEditorWidget2 = _interopRequireDefault(_PieceWiseFunctionEditorWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'ColorByWidget',

    propTypes: {
      className: _react2.default.PropTypes.string,
      max: _react2.default.PropTypes.number,
      min: _react2.default.PropTypes.number,
      onChange: _react2.default.PropTypes.func,
      presets: _react2.default.PropTypes.object,
      representation: _react2.default.PropTypes.object,
      scalarBar: _react2.default.PropTypes.string,
      source: _react2.default.PropTypes.object,
      visible: _react2.default.PropTypes.bool,
      hidePointControl: _react2.default.PropTypes.bool,
      opacityPoints: _react2.default.PropTypes.array,
      onOpacityPointsChange: _react2.default.PropTypes.func,
      onOpacityEditModeChange: _react2.default.PropTypes.func,
      opacityEditorSize: _react2.default.PropTypes.array
    },

    getInitialState: function getInitialState() {
      return {
        activeAdvanceView: '0'
      };
    },
    updatePreset: function updatePreset(name) {
      if (this.props.onChange) {
        this.props.onChange({
          type: 'updatePreset',
          representation: this.props.representation.id,
          preset: name
        });
      }
    },
    updateRange: function updateRange(options) {
      options.proxyId = this.props.source.id;
      if (this.props.onChange) {
        this.props.onChange({
          type: 'updateScalarRange',
          options: options
        });
      }
    },
    updateActiveView: function updateActiveView(event) {
      var activeAdvanceView = event.target.dataset.idx;
      this.setState({ activeAdvanceView: activeAdvanceView });
    },
    render: function render() {
      return _react2.default.createElement(
        'div',
        { className: this.props.visible ? _ColorByWidget2.default.advancedView : _ColorByWidget2.default.hidden },
        _react2.default.createElement(
          'div',
          { className: _ColorByWidget2.default.advancedViewControl },
          _react2.default.createElement('i', {
            'data-idx': '0',
            onClick: this.updateActiveView,
            className: this.state.activeAdvanceView === '0' ? _ColorByWidget2.default.activePresetIcon : _ColorByWidget2.default.presetIcon
          }),
          _react2.default.createElement('i', {
            'data-idx': '1',
            onClick: this.updateActiveView,
            className: this.state.activeAdvanceView === '1' ? _ColorByWidget2.default.activeRangeIcon : _ColorByWidget2.default.rangeIcon
          }),
          _react2.default.createElement('i', {
            'data-idx': '2',
            onClick: this.updateActiveView,
            className: this.state.activeAdvanceView === '2' ? _ColorByWidget2.default.activeOpacityIcon : _ColorByWidget2.default.opacityIcon
          })
        ),
        _react2.default.createElement(
          'div',
          { className: _ColorByWidget2.default.advancedViewContent },
          _react2.default.createElement(_PresetListWidget2.default, {
            visible: this.state.activeAdvanceView === '0',
            onChange: this.updatePreset,
            presets: this.props.presets
          }),
          _react2.default.createElement(_ScalarRangeWidget2.default, {
            visible: this.state.activeAdvanceView === '1',
            min: this.props.min,
            max: this.props.max,
            onApply: this.updateRange
          }),
          this.state.activeAdvanceView === '2' ? _react2.default.createElement(_PieceWiseFunctionEditorWidget2.default, {
            points: this.props.opacityPoints,
            rangeMin: this.props.min,
            rangeMax: this.props.max,
            onChange: this.props.onOpacityPointsChange,
            onEditModeChange: this.props.onOpacityEditModeChange,
            height: this.props.opacityEditorSize[1],
            width: this.props.opacityEditorSize[0],
            hidePointControl: this.props.hidePointControl
          }) : null
        )
      );
    }
  });
});