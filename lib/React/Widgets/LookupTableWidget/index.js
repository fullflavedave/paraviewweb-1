'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ColorPickerWidget = require('../ColorPickerWidget');

var _ColorPickerWidget2 = _interopRequireDefault(_ColorPickerWidget);

var _NumberInputWidget = require('../NumberInputWidget');

var _NumberInputWidget2 = _interopRequireDefault(_NumberInputWidget);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _LookupTableWidget = require('PVWStyle/ReactWidgets/LookupTableWidget.mcss');

var _LookupTableWidget2 = _interopRequireDefault(_LookupTableWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STYLE = {
  range: {
    none: {
      display: 'flex'
    },
    edit: {
      display: 'flex'
    },
    preset: {
      display: 'none'
    }
  },
  editContent: {
    none: {
      display: 'none'
    },
    edit: {
      display: 'flex'
    },
    preset: {
      display: 'none'
    }
  },
  presets: {
    none: {
      display: 'none'
    },
    edit: {
      display: 'none'
    },
    preset: {
      display: 'flex'
    }
  }
};

/**
 * This React component expect the following input properties:
 *   - lut:
 *       Expect a LokkupTable instance that you want to render and edit.
 *
 *   - originalRange:
 *       Expect the data range to use for the lookup table in case of reset.
 *
 *   - inverse:
 *       Expect a boolean. If true the control point will be display using the
 *       inverse of the actual color. Otherwise a white or black line will be used
 *       depending on which one provide the best contrast for that scalar value.
 *
 *   - lutManager:
 *       Expect a reference to the lookup table manager to use.
 *
 */
exports.default = _react2.default.createClass({

  displayName: 'LookupTableWidget',

  propTypes: {
    inverse: _react2.default.PropTypes.bool,
    lookupTable: _react2.default.PropTypes.object.isRequired,
    lookupTableManager: _react2.default.PropTypes.object,
    originalRange: _react2.default.PropTypes.array
  },

  getInitialState: function getInitialState() {
    return {
      mode: 'none',
      activePreset: this.props.lookupTable.getPresets()[0],
      currentControlPointIndex: 0,
      internal_lut: false,
      originalRange: this.props.originalRange
    };
  },
  componentWillMount: function componentWillMount() {
    this.attachListener(this.props.lookupTable);
  },
  componentDidMount: function componentDidMount() {
    var canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
    this.props.lookupTable.drawToCanvas(canvas);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.lookupTable !== this.props.lookupTable) {
      this.removeListener();
      this.attachListener(nextProps.lookupTable);
    }
    if (this.props.originalRange[0] !== nextProps.originalRange[0] || this.props.originalRange[1] !== nextProps.originalRange[1]) {
      this.setState({ originalRange: nextProps.originalRange });
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (!this.state.internal_lut) {
      var canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
      this.props.lookupTable.drawToCanvas(canvas);

      if (this.state.mode === 'edit') {
        // Draw control point
        var ctx = canvas.getContext('2d'),
            x = Math.floor(this.props.lookupTable.getControlPoint(this.state.currentControlPointIndex).x * this.props.lookupTable.colorTableSize),
            imageData = ctx.getImageData(0, 0, this.props.lookupTable.colorTableSize, 1);

        var color = imageData.data[x * 4] + imageData.data[x * 4 + 1] + imageData.data[x * 4 + 2] > 3 * 255 / 2 ? 0 : 255;
        imageData.data[x * 4 + 0] = this.props.inverse ? (imageData.data[x * 4 + 0] + 128) % 256 : color;
        imageData.data[x * 4 + 1] = this.props.inverse ? (imageData.data[x * 4 + 1] + 128) % 256 : color;
        imageData.data[x * 4 + 2] = this.props.inverse ? (imageData.data[x * 4 + 2] + 128) % 256 : color;

        ctx.putImageData(imageData, 0, 0);
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.removeListener();
  },
  setPreset: function setPreset(event) {
    this.props.lookupTable.setPreset(event.target.dataset.name);
    this.togglePresetMode();
  },
  updateScalarRange: function updateScalarRange() {
    var minValue = _reactDom2.default.findDOMNode(this.refs.min).value,
        maxValue = _reactDom2.default.findDOMNode(this.refs.max).value;
    this.props.lookupTable.setScalarRange(minValue, minValue === maxValue ? maxValue + 1 : maxValue);
    this.forceUpdate();
  },
  addControlPoint: function addControlPoint() {
    var newIdx = this.props.lookupTable.addControlPoint({
      x: 0.5,
      r: 0,
      g: 0,
      b: 0
    });
    this.setState({ currentControlPointIndex: newIdx });
  },
  deleteControlPoint: function deleteControlPoint() {
    if (this.props.lookupTable.removeControlPoint(this.state.currentControlPointIndex)) {
      this.forceUpdate();
    }
  },
  nextControlPoint: function nextControlPoint() {
    var newIdx = this.state.currentControlPointIndex + 1;

    if (newIdx < this.props.lookupTable.getNumberOfControlPoints()) {
      this.setState({ currentControlPointIndex: newIdx });
    }
  },
  previousControlPoint: function previousControlPoint() {
    var newIdx = this.state.currentControlPointIndex - 1;

    if (newIdx > -1) {
      this.setState({ currentControlPointIndex: newIdx });
    }
  },
  updateScalar: function updateScalar(newVal) {
    var scalarRange = this.props.lookupTable.getScalarRange(),
        xValue = (newVal - scalarRange[0]) / (scalarRange[1] - scalarRange[0]),
        controlPoint = this.props.lookupTable.getControlPoint(this.state.currentControlPointIndex);

    var newIdx = this.props.lookupTable.updateControlPoint(this.state.currentControlPointIndex, {
      x: xValue,
      r: controlPoint.r,
      g: controlPoint.g,
      b: controlPoint.b
    });
    this.setState({ currentControlPointIndex: newIdx });
    this.forceUpdate();
  },
  updateRGB: function updateRGB(rgb) {
    var controlPoint = this.props.lookupTable.getControlPoint(this.state.currentControlPointIndex);

    var newIdx = this.props.lookupTable.updateControlPoint(this.state.currentControlPointIndex, {
      x: controlPoint.x,
      r: rgb[0] / 255,
      g: rgb[1] / 255,
      b: rgb[2] / 255
    });
    this.setState({ currentControlPointIndex: newIdx });
  },
  toggleEditMode: function toggleEditMode() {
    if (this.state.mode === 'none' || this.state.mode !== 'edit') {
      this.setState({ mode: 'edit', internal_lut: false });
    } else {
      this.setState({ mode: 'none', internal_lut: false });
    }
  },
  togglePresetMode: function togglePresetMode() {
    if (this.state.mode === 'none' || this.state.mode !== 'preset') {
      this.deltaPreset(0); // Render preset
      this.setState({ mode: 'preset', internal_lut: true });
    } else {
      this.setState({ mode: 'none', internal_lut: false });
    }
  },
  attachListener: function attachListener(lut) {
    var _this = this;

    this.subscription = lut.onChange(function (data, envelope) {
      _this.forceUpdate();
    });
  },
  removeListener: function removeListener() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  },
  updateOriginalRange: function updateOriginalRange(min, max) {
    console.log('Someone asked LookupTableWidget to update original range to [' + min + ', ' + max + ']');
    this.setState({ originalRange: [min, max] });
  },
  resetRange: function resetRange() {
    var range = this.state.originalRange;
    var currentRange = this.props.lookupTable.getScalarRange();
    console.log('LookupTableWidget current range: [' + currentRange[0] + ', ' + currentRange[1] + '], new range: [' + range[0] + ', ' + range[1] + ']');
    this.props.lookupTable.setScalarRange(range[0], range[1]);
  },
  changePreset: function changePreset(event) {
    var delta = event.detail || event.deltaY || event.deltaX;
    event.preventDefault();
    this.deltaPreset(delta);
  },
  nextPreset: function nextPreset() {
    this.deltaPreset(1);
  },
  previousPreset: function previousPreset() {
    this.deltaPreset(-1);
  },
  deltaPreset: function deltaPreset(delta) {
    var presets = this.props.lookupTable.getPresets(),
        currentIdx = presets.indexOf(this.state.activePreset),
        newPreset = null;

    currentIdx += delta === 0 ? 0 : delta < 0 ? -1 : 1;
    if (currentIdx < 0 || currentIdx === presets.length) {
      return;
    }

    newPreset = presets[currentIdx];
    if (this.props.lookupTableManager) {
      var lut = this.props.lookupTableManager.getLookupTable('__internal');
      if (!lut) {
        lut = this.props.lookupTableManager.addLookupTable('__internal', [0, 1], newPreset);
      } else {
        lut.setPreset(newPreset);
      }
      lut.drawToCanvas(_reactDom2.default.findDOMNode(this.refs.canvas));
    }
    this.setState({ activePreset: newPreset });
  },
  render: function render() {
    var _this2 = this;

    var scalarRange = this.props.lookupTable.getScalarRange(),
        controlPoint = this.props.lookupTable.getControlPoint(this.state.currentControlPointIndex),
        controlPointValue = controlPoint.x * (scalarRange[1] - scalarRange[0]) + scalarRange[0],
        color = [Math.floor(255 * controlPoint.r), Math.floor(255 * controlPoint.g), Math.floor(255 * controlPoint.b)];

    return _react2.default.createElement(
      'div',
      { className: _LookupTableWidget2.default.container },
      _react2.default.createElement(
        'div',
        { className: _LookupTableWidget2.default.line },
        _react2.default.createElement('i', {
          className: _LookupTableWidget2.default.editButton,
          onClick: this.toggleEditMode
        }),
        _react2.default.createElement('canvas', {
          ref: 'canvas',
          className: _LookupTableWidget2.default.canvas,
          width: this.props.lookupTable.colorTableSize * this.props.lookupTable.scale,
          height: '1'
        }),
        _react2.default.createElement('i', {
          className: _LookupTableWidget2.default.presetButton,
          onClick: this.togglePresetMode
        })
      ),
      _react2.default.createElement(
        'div',
        { className: _LookupTableWidget2.default.range, style: STYLE.range[this.state.mode] },
        _react2.default.createElement(_NumberInputWidget2.default, {
          ref: 'min',
          className: _LookupTableWidget2.default.input,
          value: this.props.lookupTable.getScalarRange()[0],
          onChange: this.updateScalarRange
        }),
        _react2.default.createElement('i', {
          onClick: this.resetRange,
          className: _LookupTableWidget2.default.resetRangeButton
        }),
        _react2.default.createElement(_NumberInputWidget2.default, {
          ref: 'max',
          className: _LookupTableWidget2.default.inputRight,
          value: this.props.lookupTable.getScalarRange()[1],
          onChange: this.updateScalarRange
        })
      ),
      _react2.default.createElement(
        'div',
        { className: _LookupTableWidget2.default.editContent, style: STYLE.editContent[this.state.mode] },
        _react2.default.createElement(
          'div',
          { className: _LookupTableWidget2.default.line },
          _react2.default.createElement('i', {
            onClick: this.previousControlPoint,
            className: _LookupTableWidget2.default.previousButton
          }),
          _react2.default.createElement(
            'div',
            { className: _LookupTableWidget2.default.label },
            this.state.currentControlPointIndex + 1,
            ' / ',
            this.props.lookupTable.getNumberOfControlPoints()
          ),
          _react2.default.createElement('i', {
            onClick: this.nextControlPoint,
            className: _LookupTableWidget2.default.nextButton
          }),
          _react2.default.createElement('i', {
            onClick: this.addControlPoint,
            className: _LookupTableWidget2.default.addButton
          }),
          _react2.default.createElement(_NumberInputWidget2.default, {
            ref: 'x',
            className: _LookupTableWidget2.default.inputRight,
            value: controlPointValue,
            onChange: this.updateScalar
          }),
          _react2.default.createElement('i', {
            onClick: this.deleteControlPoint,
            className: _LookupTableWidget2.default.deleteButton
          })
        ),
        _react2.default.createElement(_ColorPickerWidget2.default, { color: color, onChange: this.updateRGB })
      ),
      _react2.default.createElement(
        'div',
        { className: _LookupTableWidget2.default.presets, style: STYLE.presets[this.state.mode] },
        _react2.default.createElement('i', {
          onClick: this.previousPreset,
          className: this.state.activePreset === this.props.lookupTable.getPresets()[0] ? _LookupTableWidget2.default.disablePreviousButton : _LookupTableWidget2.default.previousButton
        }),
        this.props.lookupTable.getPresets().map(function (preset) {
          return _react2.default.createElement(
            'div',
            {
              onClick: _this2.setPreset,
              onScroll: _this2.changePreset,
              onWheel: _this2.changePreset,
              className: _this2.state.activePreset === preset ? _LookupTableWidget2.default.preset : _LookupTableWidget2.default.hiddenPreset,
              'data-name': preset,
              key: preset
            },
            preset
          );
        }),
        _react2.default.createElement('i', {
          onClick: this.nextPreset,
          className: this.state.activePreset === this.props.lookupTable.getPresets()[this.props.lookupTable.getPresets().length - 1] ? _LookupTableWidget2.default.disableNextButton : _LookupTableWidget2.default.nextButton
        })
      )
    );
  }
});