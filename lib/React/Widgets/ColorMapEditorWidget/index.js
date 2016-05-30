'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SvgIconWidget = require('../SvgIconWidget');

var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

var _PieceWiseFunctionEditorWidget = require('../PieceWiseFunctionEditorWidget');

var _PieceWiseFunctionEditorWidget2 = _interopRequireDefault(_PieceWiseFunctionEditorWidget);

var _PresetListWidget = require('../PresetListWidget');

var _PresetListWidget2 = _interopRequireDefault(_PresetListWidget);

var _ColorMapEditorWidget = require('PVWStyle/ReactWidgets/ColorMapEditorWidget.mcss');

var _ColorMapEditorWidget2 = _interopRequireDefault(_ColorMapEditorWidget);

var _Palette = require('../../../../svg/colors/Palette.svg');

var _Palette2 = _interopRequireDefault(_Palette);

var _Opacity = require('../../../../svg/colors/Opacity.svg');

var _Opacity2 = _interopRequireDefault(_Opacity);

var _Time = require('../../../../svg/colors/Time.svg');

var _Time2 = _interopRequireDefault(_Time);

var _DataSet = require('../../../../svg/colors/DataSet.svg');

var _DataSet2 = _interopRequireDefault(_DataSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'ColorMapEditorWidget',

  propTypes: {
    currentOpacityPoints: _react2.default.PropTypes.array,
    currentPreset: _react2.default.PropTypes.string,
    dataRangeMin: _react2.default.PropTypes.number,
    dataRangeMax: _react2.default.PropTypes.number,
    presets: _react2.default.PropTypes.object,
    rangeMin: _react2.default.PropTypes.number,
    rangeMax: _react2.default.PropTypes.number,
    onOpacityTransferFunctionChanged: _react2.default.PropTypes.func,
    onPresetChanged: _react2.default.PropTypes.func,
    onRangeEdited: _react2.default.PropTypes.func,
    onScaleRangeToCurrent: _react2.default.PropTypes.func,
    onScaleRangeOverTime: _react2.default.PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      showOpacityControls: false,
      showPresetSelection: false
    };
  },
  onOpacityTransferFunctionChanged: function onOpacityTransferFunctionChanged(newPoints) {
    if (this.props.onOpacityTransferFunctionChanged) {
      this.props.onOpacityTransferFunctionChanged(newPoints);
    }
  },
  toggleShowOpacityControls: function toggleShowOpacityControls() {
    var newState = { showOpacityControls: !this.state.showOpacityControls };
    if (this.state.showPresetSelection && newState.showOpacityControls) {
      newState.showPresetSelection = false;
    }
    this.setState(newState);
  },
  toggleShowPresetSelection: function toggleShowPresetSelection() {
    var newState = { showPresetSelection: !this.state.showPresetSelection };
    if (this.state.showOpacityControls && newState.showPresetSelection) {
      newState.showOpacityControls = false;
    }
    this.setState(newState);
  },
  rangeMinChanged: function rangeMinChanged(e) {
    var newMin = parseFloat(e.target.value);
    if (this.props.onRangeEdited) {
      this.props.onRangeEdited([newMin, this.props.rangeMax]);
    }
  },
  rangeMaxChanged: function rangeMaxChanged(e) {
    var newMax = parseFloat(e.target.value);
    if (this.props.onRangeEdited) {
      this.props.onRangeEdited([this.props.rangeMin, newMax]);
    }
  },
  presetChanged: function presetChanged(name) {
    if (this.props.onPresetChanged) {
      this.props.onPresetChanged(name);
    }
  },
  render: function render() {
    var presets = this.props.presets;
    var name = this.props.currentPreset;
    return _react2.default.createElement(
      'div',
      { className: _ColorMapEditorWidget2.default.colormapeditor },
      _react2.default.createElement(
        'div',
        { className: _ColorMapEditorWidget2.default.mainControls },
        _react2.default.createElement(_SvgIconWidget2.default, {
          className: _ColorMapEditorWidget2.default.svgIcon,
          icon: _Opacity2.default,
          onClick: this.toggleShowOpacityControls
        }),
        _react2.default.createElement('img', {
          className: _ColorMapEditorWidget2.default.presetImage,
          src: 'data:image/png;base64,' + presets[name],
          alt: this.props.currentPreset
        }),
        _react2.default.createElement(_SvgIconWidget2.default, {
          className: _ColorMapEditorWidget2.default.svgIcon,
          icon: _Palette2.default,
          onClick: this.toggleShowPresetSelection
        })
      ),
      _react2.default.createElement(
        'div',
        { className: _ColorMapEditorWidget2.default.rangeControls },
        _react2.default.createElement('input', {
          className: _ColorMapEditorWidget2.default.minRangeInput,
          type: 'number',
          step: 'any',
          min: this.props.dataRangeMin,
          max: this.props.dataRangeMax,
          value: this.props.rangeMin,
          onChange: this.rangeMinChanged
        }),
        _react2.default.createElement(
          'div',
          { className: _ColorMapEditorWidget2.default.rangeResetButtons },
          _react2.default.createElement(_SvgIconWidget2.default, {
            className: _ColorMapEditorWidget2.default.svgIcon,
            icon: _Time2.default,
            onClick: this.props.onScaleRangeOverTime
          }),
          _react2.default.createElement(_SvgIconWidget2.default, {
            className: _ColorMapEditorWidget2.default.svgIcon,
            icon: _DataSet2.default,
            onClick: this.props.onScaleRangeToCurrent
          })
        ),
        _react2.default.createElement('input', {
          className: _ColorMapEditorWidget2.default.maxRangeInput,
          type: 'number',
          step: 'any',
          min: this.props.dataRangeMin,
          max: this.props.dataRangeMax,
          value: this.props.rangeMax,
          onChange: this.rangeMaxChanged
        })
      ),
      _react2.default.createElement(_PieceWiseFunctionEditorWidget2.default, {
        initialPoints: this.props.currentOpacityPoints,
        ref: 'pieceWiseEditor',
        rangeMin: this.props.rangeMin,
        rangeMax: this.props.rangeMax,
        onChange: this.onOpacityTransferFunctionChanged,
        visible: this.state.showOpacityControls
      }),
      _react2.default.createElement(
        'div',
        { className: _ColorMapEditorWidget2.default.presetList },
        _react2.default.createElement(_PresetListWidget2.default, {
          presets: presets,
          height: '1em',
          visible: this.state.showPresetSelection,
          activeName: name,
          onChange: this.presetChanged
        })
      )
    );
  }
});