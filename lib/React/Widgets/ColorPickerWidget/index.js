'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _defaultSwatches = require('./defaultSwatches.png');

var _defaultSwatches2 = _interopRequireDefault(_defaultSwatches);

var _ColorPickerWidget = require('PVWStyle/ReactWidgets/ColorPickerWidget.mcss');

var _ColorPickerWidget2 = _interopRequireDefault(_ColorPickerWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This React component expect the following input properties:
 *   - color:
 *       Expect an array [r,g,b] of the initial color to show.
 *       Default value is [0,0,0].
 *       Each color channel must be a number between 0 and 1.
 *   - onChange:
 *       Expect a callback function which will receive a color array [r, g, b]
 *       as argument each time the user pick a different color.
 *   - swatch:
 *       Image URL that should be used for color picking.
 *       Default value is a base64 encoded swatch.
 */
exports.default = _react2.default.createClass({

  displayName: 'ColorPickerWidget',

  propTypes: {
    color: _react2.default.PropTypes.array,
    onChange: _react2.default.PropTypes.func,
    swatch: _react2.default.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return { color: [0, 0, 0], swatch: _defaultSwatches2.default };
  },
  getInitialState: function getInitialState() {
    this.image = new Image();
    this.image.src = this.props.swatch;
    return {
      swatch: this.props.swatch,
      color: this.props.color,
      preview: false,
      originalColor: [this.props.color[0], this.props.color[1], this.props.color[2]]
    };
  },
  componentDidMount: function componentDidMount() {
    var ctx = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d');
    ctx.fillStyle = 'rgb(' + this.state.originalColor.join(',') + ')';
    ctx.fillRect(0, 0, 1, 1);
  },


  // FIXME need to do that properly if possible?
  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevProps.color[0] !== this.props.color[0] || prevProps.color[1] !== this.props.color[1] || prevProps.color[2] !== this.props.color[2]) {
      this.setState({ originalColor: this.props.color });
    }
    if (!this.state.preview) {
      var ctx = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d');
      ctx.fillStyle = 'rgb(' + this.state.originalColor.join(',') + ')';
      ctx.fillRect(0, 0, 1, 1);
    }
  },

  /* eslint-enable react/no-did-update-set-state */

  showColor: function showColor(event) {
    var color = this.state.originalColor,
        ctx = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d');
    event.preventDefault();

    if (event.type === 'mouseleave') {
      ctx.fillStyle = 'rgb(' + color.join(',') + ')';
      ctx.fillRect(0, 0, 1, 1);

      this.setState({ color: [color[0], color[1], color[2]], preview: false });

      return;
    }

    var img = _reactDom2.default.findDOMNode(this.refs.swatch),
        rect = img.getBoundingClientRect();

    var scale = this.image.width / rect.width,
        x = scale * (event.pageX - rect.left),
        y = scale * (event.pageY - rect.top);

    ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);

    // Update state base on the event type
    color = ctx.getImageData(0, 0, 1, 1).data;

    if (event.type === 'click') {
      this.setState({ color: [color[0], color[1], color[2]], preview: false });
      if (this.props.onChange) {
        this.props.onChange(color);
      }
    } else {
      this.setState({ color: [color[0], color[1], color[2]], preview: true });
    }
  },
  rgbColorChange: function rgbColorChange(event) {
    var color = this.state.color,
        value = event.target.value,
        idx = Number(event.target.dataset.colorIdx);

    color[idx] = value;

    var ctx = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d');
    ctx.fillStyle = 'rgb(' + color.join(',') + ')';
    ctx.fillRect(0, 0, 1, 1);

    this.setState({ color: [color[0], color[1], color[2]], preview: false });

    if (this.props.onChange) {
      this.props.onChange(color);
    }
  },
  updateColor: function updateColor(color) {
    this.setState({ originalColor: color });
  },
  updateSwatch: function updateSwatch(url) {
    this.image.src = url;
    this.setState({ swatch: url });
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: _ColorPickerWidget2.default.container },
      _react2.default.createElement(
        'div',
        { className: _ColorPickerWidget2.default.activeColor },
        _react2.default.createElement('canvas', {
          className: _ColorPickerWidget2.default.colorCanvas,
          ref: 'canvas',
          width: '1',
          height: '1'
        }),
        _react2.default.createElement('input', {
          className: _ColorPickerWidget2.default.colorRGB,
          type: 'number',
          min: '0',
          max: '255',
          value: this.state.color[0],
          'data-color-idx': '0',
          onChange: this.rgbColorChange
        }),
        _react2.default.createElement('input', {
          className: _ColorPickerWidget2.default.colorRGB,
          type: 'number',
          min: '0',
          max: '255',
          value: this.state.color[1],
          'data-color-idx': '1',
          onChange: this.rgbColorChange
        }),
        _react2.default.createElement('input', {
          className: _ColorPickerWidget2.default.colorRGB,
          type: 'number',
          min: '0',
          max: '255',
          value: this.state.color[2],
          'data-color-idx': '2',
          onChange: this.rgbColorChange
        })
      ),
      _react2.default.createElement(
        'div',
        { className: _ColorPickerWidget2.default.swatch },
        _react2.default.createElement('img', {
          alt: 'swatch',
          ref: 'swatch',
          className: _ColorPickerWidget2.default.swatchImage,
          width: '100%',
          src: this.state.swatch,
          onClick: this.showColor,
          onMouseMove: this.showColor,
          onMouseLeave: this.showColor
        })
      )
    );
  }
});