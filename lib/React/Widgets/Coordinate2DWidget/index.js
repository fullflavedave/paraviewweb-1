define(['exports', 'mout/src/object/equals', 'react', 'PVWStyle/ReactWidgets/Coordinate2DWidget.mcss', '../../../Interaction/Core/MouseHandler'], function (exports, _equals, _react, _Coordinate2DWidget, _MouseHandler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _equals2 = _interopRequireDefault(_equals);

  var _react2 = _interopRequireDefault(_react);

  var _Coordinate2DWidget2 = _interopRequireDefault(_Coordinate2DWidget);

  var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'Coordinate2DWidget',

    propTypes: {
      height: _react2.default.PropTypes.number,
      hideXY: _react2.default.PropTypes.bool,
      onChange: _react2.default.PropTypes.func,
      width: _react2.default.PropTypes.number,
      x: _react2.default.PropTypes.number,
      y: _react2.default.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
      return {
        width: 50,
        height: 50,
        x: 0,
        y: 0
      };
    },
    getInitialState: function getInitialState() {
      return {
        x: this.props.x,
        y: this.props.y
      };
    },
    componentDidMount: function componentDidMount() {
      this.drawControl();
      this.mouseHandler = new _MouseHandler2.default(this.canvas);
      this.mouseHandler.attach({
        click: this.pointerAction,
        mousedown: this.pointerAction,
        mouseup: this.pointerAction,
        drag: this.pointerAction
      });
    },
    componentDidUpdate: function componentDidUpdate(nextProps, nextState) {
      this.drawControl();
    },
    componentWillUnmount: function componentWillUnmount() {
      this.mouseHandler.destroy();
    },
    coordinates: function coordinates() {
      return { x: this.state.x, y: this.state.y };
    },
    updateCoordinates: function updateCoordinates(coords) {
      var _this = this;

      var newCoords = {},
          newVals = false;

      ['x', 'y'].forEach(function (el) {
        if ({}.hasOwnProperty.call(coords, el)) {
          newCoords[el] = _this.limitValue(parseFloat(coords[el]));
          newVals = true;
        }
      });

      if (newVals) {
        this.setState(newCoords);
      }
    },
    limitValue: function limitValue(val) {
      return Math.max(-1.0, Math.min(val, 1.0));
    },


    // no need to limit the values, for updateX/Y, the input already does that.
    updateX: function updateX(e) {
      var newVal = parseFloat(e.target.value);
      this.setState({ x: newVal });
    },
    updateY: function updateY(e) {
      var newVal = parseFloat(e.target.value);
      this.setState({ y: newVal });
    },


    // covers clicks, mouseup/down, and drag.
    pointerAction: function pointerAction(e) {
      var rect = this.canvas.getBoundingClientRect();
      var x = e.pointers[0].clientX - rect.left - this.props.width / 2,
          y = -(e.pointers[0].clientY - rect.top - this.props.height / 2);
      this.setState({
        x: this.limitValue(x / (this.props.width / 2)),
        y: this.limitValue(y / (this.props.height / 2))
      });
    },
    drawControl: function drawControl() {
      var ctx = this.canvas.getContext('2d'),
          height = ctx.canvas.height,
          width = ctx.canvas.width;

      // clear
      ctx.clearRect(0, 0, width, height);

      // draw a lightgrey center plus
      this.drawPlus('lightgrey');

      // draw a plus at {this.state.x, this.state.y},

      // convert the values to canvas coords before hand.
      this.drawPlus('black', {
        x: this.state.x * (this.props.width / 2),
        y: -this.state.y * (this.props.height / 2)
      });

      if (this.props.onChange) {
        var currentState = {
          x: this.state.x,
          y: this.state.y
        };
        if (!(0, _equals2.default)(currentState, this.lastSharedState)) {
          this.lastSharedState = currentState;
          this.props.onChange(this.lastSharedState);
        }
      }
    },
    drawPlus: function drawPlus(color, location_) {
      var ctx = this.canvas.getContext('2d');
      var height = ctx.canvas.height;
      var width = ctx.canvas.width;
      var lineLen = 5;
      var location = location_;

      if (location === undefined) {
        location = {
          x: width / 2,
          y: height / 2
        };
      } else {
        location.x += this.props.width / 2;
        location.y += this.props.height / 2;
      }

      // style
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      // vert
      ctx.moveTo(location.x, location.y - lineLen);
      ctx.lineTo(location.x, location.y + lineLen);
      ctx.stroke();

      // horiz
      ctx.moveTo(location.x - lineLen, location.y);
      ctx.lineTo(location.x + lineLen, location.y);
      ctx.stroke();
    },
    render: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'section',
        { className: _Coordinate2DWidget2.default.container },
        _react2.default.createElement('canvas', {
          ref: function ref(c) {
            _this2.canvas = c;
          },
          className: _Coordinate2DWidget2.default.canvas,
          width: this.props.width,
          height: this.props.height
        }),
        _react2.default.createElement(
          'section',
          { className: this.props.hideXY ? _Coordinate2DWidget2.default.hidden : _Coordinate2DWidget2.default.inputContainer },
          _react2.default.createElement(
            'label',
            { className: _Coordinate2DWidget2.default.inputLabel },
            ' x: '
          ),
          _react2.default.createElement('input', {
            className: _Coordinate2DWidget2.default.input,
            type: 'number',
            onChange: this.updateX,
            min: '-1.0', max: '1.0', step: '0.01', value: this.state.x
          }),
          _react2.default.createElement('br', null),
          _react2.default.createElement(
            'label',
            { className: _Coordinate2DWidget2.default.inputLabel },
            ' y: '
          ),
          _react2.default.createElement('input', {
            className: _Coordinate2DWidget2.default.input,
            type: 'number',
            onChange: this.updateY,
            min: '-1.0', max: '1.0', step: '0.01', value: this.state.y
          })
        )
      );
    }
  });
});