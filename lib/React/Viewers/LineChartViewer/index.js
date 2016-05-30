'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _equals = require('mout/src/object/equals');

var _equals2 = _interopRequireDefault(_equals);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _LineChartViewer = require('PVWStyle/ReactViewers/LineChartViewer.mcss');

var _LineChartViewer2 = _interopRequireDefault(_LineChartViewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function interpolate(values, xRatio) {
  var size = values.length,
      idx = size * xRatio,
      a = values[Math.floor(idx)],
      b = values[Math.ceil(idx)],
      ratio = idx - Math.floor(idx);
  return ((b - a) * ratio + a).toFixed(5);
}

/**
 * This React component expect the following input properties:
 */
exports.default = _react2.default.createClass({

  displayName: 'LineChartViewer',

  propTypes: {
    colors: _react2.default.PropTypes.array,
    cursor: _react2.default.PropTypes.number,
    data: _react2.default.PropTypes.any.isRequired,
    height: _react2.default.PropTypes.number,
    legend: _react2.default.PropTypes.bool,
    width: _react2.default.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      colors: ['#e1002a', '#417dc0', '#1d9a57', '#e9bc2f', '#9b3880'],
      height: 200,
      legend: false,
      width: 200
    };
  },
  getInitialState: function getInitialState() {
    return {
      fieldsColors: {},
      height: this.props.height / 2,
      legend: this.props.legend,
      width: this.props.width / 2
    };
  },
  componentWillMount: function componentWillMount() {
    this.xPosition = 0;
    // Listen to window resize
    this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);

    // Make sure we monitor window size if it is not already the case
    _SizeHelper2.default.startListening();
  },
  componentDidMount: function componentDidMount() {
    this.updateDimensions();
    // this.drawChart();
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    this.drawChart();
  },
  componentWillUnmount: function componentWillUnmount() {
    // Remove window listener
    if (this.sizeSubscription) {
      this.sizeSubscription.unsubscribe();
      this.sizeSubscription = null;
    }
  },
  onMove: function onMove(event) {
    this.xPosition = event.clientX - (event.target.getClientRects()[0].x || event.target.getClientRects()[0].left);

    // Update fields values

    if (this.isMounted() && this.state.legend) {
      this.drawChart();
    }
  },
  updateDimensions: function updateDimensions() {
    this.xPosition = 0;

    var el = _reactDom2.default.findDOMNode(this).parentNode,
        elSize = _SizeHelper2.default.getSize(el);

    if (el && (this.state.width !== elSize.clientWidth || this.state.height !== elSize.clientHeight)) {
      this.setState({
        width: elSize.clientWidth,
        height: elSize.clientHeight
      });
      return true;
    }
    return false;
  },
  toggleLegend: function toggleLegend() {
    this.setState({ legend: !this.state.legend });
  },
  drawChart: function drawChart() {
    if (!this.props.data) {
      return;
    }

    var ctx = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d'),
        fields = this.props.data.fields,
        size = fields.length,
        fieldsColors = {},
        ratio = this.xPosition / ctx.canvas.width;

    ctx.canvas.width = this.state.width;
    ctx.canvas.height = this.state.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var idx = 0; idx < size; ++idx) {
      this.drawField(ctx, idx, fields[idx].data, fields[idx].range);
      fieldsColors[fields[idx].name] = this.props.colors[idx];
      if (this.refs.hasOwnProperty(fields[idx].name)) {
        _reactDom2.default.findDOMNode(this.refs[fields[idx].name]).innerHTML = interpolate(fields[idx].data, ratio);
      }
    }

    if (!(0, _equals2.default)(this.state.fieldsColors, fieldsColors)) {
      this.setState({ fieldsColors: fieldsColors });
    }

    // Draw cursor
    if (this.state.legend) {
      _reactDom2.default.findDOMNode(this.refs.xValueLabel).innerHTML = ((this.props.data.xRange[1] - this.props.data.xRange[0]) * ratio + this.props.data.xRange[0]).toFixed(5);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(this.xPosition, 0);
      ctx.lineTo(this.xPosition, ctx.canvas.height);
      ctx.stroke();
    }

    if (this.props.cursor !== undefined) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#0000FF';
      ctx.moveTo(this.props.cursor * ctx.canvas.width, 0);
      ctx.lineTo(this.props.cursor * ctx.canvas.width, ctx.canvas.height);
      ctx.stroke();
    }
  },
  drawField: function drawField(ctx, fieldIndex, values, range) {
    var min = Number.MAX_VALUE,
        max = Number.MIN_VALUE,
        width = ctx.canvas.width,
        height = ctx.canvas.height,
        size = values.length,
        count = values.length,
        xValues = new Uint16Array(count);

    // Compute xValues and min/max
    while (count--) {
      var value = values[count];
      min = Math.min(min, value);
      max = Math.max(max, value);
      xValues[count] = Math.floor(width * (count / size));
    }

    // Update range if any provided
    if (range) {
      min = range[0];
      max = range[1];
    }

    var scaleY = height / (max - min);

    function getY(idx) {
      var value = values[idx];
      value = value > min ? value < max ? value : max : min;
      return height - Math.floor((value - min) * scaleY);
    }

    // Draw line
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.props.colors[fieldIndex];
    ctx.moveTo(xValues[0], getY(0));
    for (var idx = 1; idx < size; idx++) {
      if (isNaN(values[idx])) {
        if (idx + 1 < size && !isNaN(values[idx + 1])) {
          ctx.moveTo(xValues[idx + 1], getY(idx + 1));
        }
      } else {
        ctx.lineTo(xValues[idx], getY(idx));
      }
    }
    ctx.stroke();

    return [min, max];
  },
  render: function render() {
    var _this = this;

    var legend = [];

    Object.keys(this.state.fieldsColors).forEach(function (name) {
      var color = _this.state.fieldsColors[name];
      legend.push(_react2.default.createElement(
        'li',
        { className: _LineChartViewer2.default.legendItem, key: name },
        _react2.default.createElement('i', { className: _LineChartViewer2.default.legendItemColor, style: { color: color } }),
        _react2.default.createElement(
          'b',
          null,
          name
        ),
        _react2.default.createElement('span', { className: _LineChartViewer2.default.legendItemValue, ref: name })
      ));
    });

    return _react2.default.createElement(
      'div',
      { className: _LineChartViewer2.default.container },
      _react2.default.createElement('canvas', {
        className: _LineChartViewer2.default.canvas,
        ref: 'canvas',
        onMouseMove: this.onMove,
        width: this.state.width,
        height: this.state.height
      }),
      _react2.default.createElement(
        'div',
        { className: this.state.legend ? _LineChartViewer2.default.legend : _LineChartViewer2.default.hidden },
        _react2.default.createElement(
          'div',
          { className: _LineChartViewer2.default.legendBar },
          _react2.default.createElement('span', { className: _LineChartViewer2.default.legendText, ref: 'xValueLabel' }),
          _react2.default.createElement('i', { className: _LineChartViewer2.default.toggleLegendButton, onClick: this.toggleLegend })
        ),
        _react2.default.createElement(
          'ul',
          { className: _LineChartViewer2.default.legendContent },
          legend
        )
      ),
      _react2.default.createElement(
        'div',
        { className: this.state.legend ? _LineChartViewer2.default.hidden : _LineChartViewer2.default.legend, onClick: this.toggleLegend },
        _react2.default.createElement(
          'div',
          { className: _LineChartViewer2.default.legendButtons },
          _react2.default.createElement('i', { className: _LineChartViewer2.default.toggleLegendButton })
        )
      )
    );
  }
});