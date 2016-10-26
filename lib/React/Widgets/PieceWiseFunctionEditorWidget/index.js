define(['exports', 'react', 'mout/src/lang/deepEquals', 'PVWStyle/ReactWidgets/PieceWiseFunctionEditorWidget.mcss', '../../../NativeUI/Canvas/LinearPieceWiseEditor', '../SvgIconWidget', '../../../Common/Misc/SizeHelper', '../../../../svg/colors/Plus.svg', '../../../../svg/colors/Trash.svg'], function (exports, _react, _deepEquals, _PieceWiseFunctionEditorWidget, _LinearPieceWiseEditor, _SvgIconWidget, _SizeHelper, _Plus, _Trash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _deepEquals2 = _interopRequireDefault(_deepEquals);

  var _PieceWiseFunctionEditorWidget2 = _interopRequireDefault(_PieceWiseFunctionEditorWidget);

  var _LinearPieceWiseEditor2 = _interopRequireDefault(_LinearPieceWiseEditor);

  var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  var _Plus2 = _interopRequireDefault(_Plus);

  var _Trash2 = _interopRequireDefault(_Trash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'PieceWiseFunctionEditorWidget',

    propTypes: {
      points: _react2.default.PropTypes.array,
      rangeMin: _react2.default.PropTypes.number,
      rangeMax: _react2.default.PropTypes.number,
      onChange: _react2.default.PropTypes.func,
      onEditModeChange: _react2.default.PropTypes.func,
      height: _react2.default.PropTypes.number,
      width: _react2.default.PropTypes.number,
      hidePointControl: _react2.default.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
      return {
        height: 200,
        width: -1,
        points: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      };
    },
    getInitialState: function getInitialState() {
      return {
        height: this.props.height,
        width: this.props.width,
        activePoint: -1
      };
    },
    componentDidMount: function componentDidMount() {
      var canvas = this.canvas;
      this.editor = new _LinearPieceWiseEditor2.default(canvas);

      this.editor.setControlPoints(this.props.points);
      this.editor.render();
      this.editor.onChange(this.updatePoints);
      this.editor.onEditModeChange(this.props.onEditModeChange);

      if (this.props.width === -1 || this.props.height === -1) {
        this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);
        _SizeHelper2.default.startListening();
        this.updateDimensions();
      }
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
      var newState = {};
      if (!(0, _deepEquals2.default)(newProps.points, this.props.points)) {
        this.editor.setControlPoints(newProps.points, this.editor.activeIndex);
        if (this.state.activePoint >= newProps.points.length) {
          newState.activePoint = -1;
        }
      }
      if (newProps.width !== this.props.width) {
        newState.width = newProps.width;
      }
      if (newProps.height !== this.props.height) {
        newState.height = newProps.height;
      }
      if (this.props.width === -1 || this.props.height === -1) {
        this.updateDimensions();
      }
      this.setState(newState);
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
      if (this.state.width !== prevState.width || this.state.height !== prevState.height) {
        this.editor.render();
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.sizeSubscription) {
        this.sizeSubscription.unsubscribe();
        this.sizeSubscription = null;
        this.editor.destroy(); // Remove subscriptions
        this.editor = null;
      }
    },
    updateDimensions: function updateDimensions() {
      var _sizeHelper$getSize = _SizeHelper2.default.getSize(this.rootContainer, true);

      var clientWidth = _sizeHelper$getSize.clientWidth;
      var clientHeight = _sizeHelper$getSize.clientHeight;

      if (this.props.width === -1) {
        this.setState({ width: clientWidth });
      }
      if (this.props.height === -1) {
        this.setState({ height: clientHeight });
      }
    },
    updatePoints: function updatePoints(newPoints, envelope) {
      var activePoint = this.editor.activeIndex;
      this.setState({ activePoint: activePoint });
      var dataPoints = this.props.points.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y,
          x2: pt.x2 || 0.5,
          y2: pt.y2 || 0.5
        };
      });
      var newDataPoints = newPoints.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y,
          x2: pt.x2 || 0.5,
          y2: pt.y2 || 0.5
        };
      });
      this.oldPoints = dataPoints;
      if (this.props.onChange) {
        this.props.onChange(newDataPoints);
      }
    },
    updateActivePointDataValue: function updateActivePointDataValue(e) {
      if (this.state.activePoint === -1) {
        return;
      }
      var value = parseFloat(e.target.value);
      var points = this.props.points.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y,
          x2: pt.x2 || 0.5,
          y2: pt.y2 || 0.5
        };
      });
      points[this.state.activePoint].x = (value - this.props.rangeMin) / (this.props.rangeMax - this.props.rangeMin);
      this.editor.setControlPoints(points, this.state.activePoint);
    },
    updateActivePointOpacity: function updateActivePointOpacity(e) {
      if (this.state.activePoint === -1) {
        return;
      }
      var value = parseFloat(e.target.value);
      var points = this.props.points.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y,
          x2: pt.x2 || 0.5,
          y2: pt.y2 || 0.5
        };
      });
      points[this.state.activePoint].y = value;
      this.editor.setControlPoints(points, this.state.activePoint);
    },
    addPoint: function addPoint(e) {
      var points = this.props.points.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y,
          x2: pt.x2 || 0.5,
          y2: pt.y2 || 0.5
        };
      });
      points.push({
        x: 0.5,
        y: 0.5,
        x2: 0.5,
        y2: 0.5
      });
      this.editor.setControlPoints(points, points.length - 1);
    },
    removePoint: function removePoint(e) {
      if (this.state.activePoint === -1) {
        return;
      }
      var points = this.props.points.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y,
          x2: pt.x2 || 0.5,
          y2: pt.y2 || 0.5
        };
      });
      points.splice(this.state.activePoint, 1);
      this.editor.setActivePoint(-1);
      this.editor.setControlPoints(points);
    },
    render: function render() {
      var _this = this;

      var activePointDataValue = (this.state.activePoint !== -1 ? this.props.points[this.state.activePoint].x : 0.5) * (this.props.rangeMax - this.props.rangeMin) + this.props.rangeMin;
      var activePointOpacity = this.state.activePoint !== -1 ? this.props.points[this.state.activePoint].y : 0.5;
      return _react2.default.createElement(
        'div',
        { className: _PieceWiseFunctionEditorWidget2.default.pieceWiseFunctionEditorWidget, ref: function ref(c) {
            return _this.rootContainer = c;
          } },
        _react2.default.createElement('canvas', {
          className: _PieceWiseFunctionEditorWidget2.default.canvas,
          width: this.state.width,
          height: this.state.height,
          ref: function ref(c) {
            _this.canvas = c;
          }
        }),
        this.props.hidePointControl ? null : _react2.default.createElement(
          'div',
          { className: _PieceWiseFunctionEditorWidget2.default.pointControls },
          _react2.default.createElement(
            'div',
            { className: _PieceWiseFunctionEditorWidget2.default.pointInfo },
            _react2.default.createElement(
              'div',
              { className: _PieceWiseFunctionEditorWidget2.default.line },
              _react2.default.createElement(
                'label',
                null,
                'Data'
              ),
              _react2.default.createElement('input', {
                className: _PieceWiseFunctionEditorWidget2.default.input,
                type: 'number',
                step: 'any',
                min: this.props.rangeMin,
                max: this.props.rangeMax,
                value: activePointDataValue,
                onChange: this.updateActivePointDataValue
              })
            ),
            _react2.default.createElement(
              'div',
              { className: _PieceWiseFunctionEditorWidget2.default.line },
              _react2.default.createElement(
                'label',
                null,
                'Opacity'
              ),
              _react2.default.createElement('input', {
                className: _PieceWiseFunctionEditorWidget2.default.input,
                type: 'number',
                step: 0.01,
                min: 0,
                max: 1,
                value: Math.floor(100 * activePointOpacity) / 100,
                onChange: this.updateActivePointOpacity
              })
            )
          ),
          _react2.default.createElement(_SvgIconWidget2.default, { className: _PieceWiseFunctionEditorWidget2.default.svgIcon, icon: _Plus2.default, onClick: this.addPoint }),
          _react2.default.createElement(_SvgIconWidget2.default, { className: _PieceWiseFunctionEditorWidget2.default.svgIcon, icon: _Trash2.default, onClick: this.removePoint })
        )
      );
    }
  });
});