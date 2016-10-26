define(['exports', 'mout/src/array/equals', 'react', 'PVWStyle/ReactWidgets/EqualizerWidget.mcss', '../../../Interaction/Core/MouseHandler', '../../../Common/Misc/SizeHelper'], function (exports, _equals, _react, _EqualizerWidget, _MouseHandler, _SizeHelper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _equals2 = _interopRequireDefault(_equals);

  var _react2 = _interopRequireDefault(_react);

  var _EqualizerWidget2 = _interopRequireDefault(_EqualizerWidget);

  var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'EqualizerWidget',

    propTypes: {
      colors: _react2.default.PropTypes.array,
      height: _react2.default.PropTypes.number,
      layers: _react2.default.PropTypes.array,
      onChange: _react2.default.PropTypes.func,
      spacing: _react2.default.PropTypes.number,
      stroke: _react2.default.PropTypes.string,
      width: _react2.default.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
      return {
        layers: [1, 1, 1, 1, 1, 1, 1],
        colors: ['#0000ff', '#ffffff', '#ff0000'],
        stroke: '#000000',
        height: 120,
        width: 300,
        spacing: 2
      };
    },
    getInitialState: function getInitialState() {
      return {
        layers: this.props.layers,
        width: this.props.width,
        height: this.props.height
      };
    },
    componentWillMount: function componentWillMount() {
      // Listen to window resize
      this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);

      // Make sure we monitor window size if it is not already the case
      _SizeHelper2.default.startListening();
    },
    componentDidMount: function componentDidMount() {
      this.updateDimensions();
      this.draw();
      this.mouseHandler = new _MouseHandler2.default(this.canvas);
      this.mouseHandler.attach({
        click: this.clicked,
        drag: this.clicked
      });
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var layers = nextProps.layers;

      if (!(0, _equals2.default)(this.state.layers, layers)) {
        this.setState({ layers: layers });
      }
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
      this.draw();
    },
    componentWillUnmount: function componentWillUnmount() {
      this.mouseHandler.destroy();
      // Remove window listener
      if (this.sizeSubscription) {
        this.sizeSubscription.unsubscribe();
        this.sizeSubscription = null;
      }
    },
    updateDimensions: function updateDimensions() {
      var el = this.rootContainer.parentNode,
          innerWidth = _SizeHelper2.default.getSize(el, true).clientWidth;

      if (el && innerWidth && this.state.width !== innerWidth) {
        this.setState({ width: innerWidth });
        return true;
      }
      return false;
    },
    draw: function draw() {
      var ctx = this.canvas.getContext('2d');
      ctx.strokeStyle = this.props.stroke;
      ctx.lineWidth = '1';

      var array = this.state.layers,
          width = this.state.width,
          height = this.state.height,
          size = array.length,
          spacing = this.props.spacing,
          layerWidth = Math.floor((width - 5 * spacing) / size - spacing),
          maxLayerHeight = height - 4 * spacing,
          layerStep = layerWidth + (width - layerWidth * array.length - 2 * spacing) / (array.length + 1);

      ctx.clearRect(0, 0, this.state.width, this.state.height);

      ctx.beginPath();
      ctx.rect(spacing, spacing, width - 2 * spacing, height - 2 * spacing);
      ctx.stroke();

      for (var i = 0; i < size; i++) {
        var layerHeight = array[i] * maxLayerHeight;

        ctx.fillStyle = this.props.colors[i % this.props.colors.length];
        ctx.fillRect(layerStep * i + 2 * spacing, height - layerHeight - 2 * spacing, layerWidth, layerHeight);

        ctx.beginPath();
        ctx.rect(layerStep * i + 2 * spacing, height - layerHeight - 2 * spacing, layerWidth, layerHeight);
        ctx.stroke();
      }

      // Draw Grid
      // var yStep = maxLayerHeight / 10;
      // ctx.fillStyle = '#ffffff';
      // for(var i = 0; i < 9; i++) {
      //   ctx.beginPath();
      //   ctx.fillRect(spacing*1.5, (1+i)*yStep + 2 * spacing, width - 3.5 * spacing, 1);
      //   ctx.stroke();
      // }
    },
    clicked: function clicked(e) {
      var rect = this.canvas.getClientRects()[0],
          x = e.pointers[0].clientX - rect.left - 2 * this.props.spacing,
          y = e.pointers[0].clientY - rect.top - 2 * this.props.spacing,
          effectiveHeight = rect.height - 4 * this.props.spacing,
          idx = Math.min(this.state.layers.length - 1, Math.floor(x / (rect.width - 4 * this.props.spacing) * this.state.layers.length)),
          opacity = 1.0 - y / effectiveHeight,
          layers = [].concat(this.state.layers);

      opacity = opacity > 1.0 ? 1.0 : opacity;
      opacity = opacity < 0.0 ? 0.0 : opacity;
      layers[idx] = opacity;

      this.setState({ layers: layers });
      if (this.props.onChange) {
        this.props.onChange(layers);
      }
      this.draw();
    },
    render: function render() {
      var _this = this;

      return _react2.default.createElement(
        'div',
        { className: _EqualizerWidget2.default.container, ref: function ref(c) {
            return _this.rootContainer = c;
          } },
        _react2.default.createElement('canvas', {
          className: _EqualizerWidget2.default.canvas,
          ref: function ref(c) {
            _this.canvas = c;
          },
          width: this.state.width,
          height: this.state.height
        })
      );
    }
  });
});