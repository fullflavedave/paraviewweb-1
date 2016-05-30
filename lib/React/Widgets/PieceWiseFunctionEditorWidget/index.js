'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LinearPieceWiseEditor = require('../../../NativeUI/Canvas/LinearPieceWiseEditor');

var _LinearPieceWiseEditor2 = _interopRequireDefault(_LinearPieceWiseEditor);

var _SvgIconWidget = require('../SvgIconWidget');

var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _deepEquals = require('mout/src/lang/deepEquals');

var _deepEquals2 = _interopRequireDefault(_deepEquals);

var _deepClone = require('mout/src/lang/deepClone');

var _deepClone2 = _interopRequireDefault(_deepClone);

var _PieceWiseFunctionEditorWidget = require('PVWStyle/ReactWidgets/PieceWiseFunctionEditorWidget.mcss');

var _PieceWiseFunctionEditorWidget2 = _interopRequireDefault(_PieceWiseFunctionEditorWidget);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _Plus = require('../../../../svg/colors/Plus.svg');

var _Plus2 = _interopRequireDefault(_Plus);

var _Trash = require('../../../../svg/colors/Trash.svg');

var _Trash2 = _interopRequireDefault(_Trash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// In javascript, you can't return an object from an => function like this:
// x => { property: x }.  But ESLint doesn't allow this:
// x => { return { property: x }; } since it says all one line returning =>
// functions should not include the outer {} or return keyword.  This is
// a function to allow this syntax: x => makeESLintHappy({ property: x })
function makeESLintHappy(x) {
  return x;
}

exports.default = _react2.default.createClass({

  displayName: 'PieceWiseFunctionEditorWidget',

  propTypes: {
    initialPoints: _react2.default.PropTypes.array,
    rangeMin: _react2.default.PropTypes.number,
    rangeMax: _react2.default.PropTypes.number,
    onChange: _react2.default.PropTypes.func,
    visible: _react2.default.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    var _this = this;

    var controlPoints = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    if (this.props.initialPoints) {
      controlPoints = this.props.initialPoints.map(function (pt) {
        return makeESLintHappy({
          x: (pt.x - _this.props.rangeMin) / (_this.props.rangeMax - _this.props.rangeMin),
          y: pt.y
        });
      });
    }
    return {
      activePoint: 0,
      width: -1,
      height: 300,
      points: controlPoints
    };
  },
  componentWillMount: function componentWillMount() {
    if (this.props.visible) {
      this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);
      _SizeHelper2.default.startListening();
    }
  },
  componentDidMount: function componentDidMount() {
    var canvas = this.refs.canvas;
    this.editor = new _LinearPieceWiseEditor2.default(canvas);

    this.editor.setControlPoints(this.state.points);
    this.editor.render();
    this.editor.onChange(this.updatePoints);

    if (this.sizeHelper) {
      _SizeHelper2.default.triggerChange();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _this2 = this;

    if (this.props.visible && !prevProps.visible && this.state.width === -1) {
      this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);
      _SizeHelper2.default.startListening();
      _SizeHelper2.default.triggerChange();
    }
    if (this.state.width !== prevState.width || this.props.visible && !prevProps.visible) {
      this.editor.render();
    }
    // We get some duplicate events from the editor, filter them out
    if (!(0, _deepEquals2.default)(this.state.points, prevState.points) || this.props.rangeMin !== prevProps.rangeMin || this.props.rangeMax !== prevProps.rangeMax) {
      var dataPoints = this.state.points.map(function (pt) {
        return makeESLintHappy({
          x: pt.x * (_this2.props.rangeMax - _this2.props.rangeMin) + _this2.props.rangeMin,
          y: pt.y
        });
      });
      if (this.props.onChange) {
        this.props.onChange(dataPoints);
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.sizeSubscription) {
      this.sizeSubscription.unsubscribe();
      this.sizeSubscription = null;
      this.editor = null;
    }
  },
  updateDimensions: function updateDimensions() {
    var _sizeHelper$getSize = _SizeHelper2.default.getSize(_reactDom2.default.findDOMNode(this));

    var clientWidth = _sizeHelper$getSize.clientWidth;

    this.setState({ width: clientWidth });
  },
  updatePoints: function updatePoints(newPoints, envelope) {
    var activePoint = this.editor.activeIndex;
    this.setState({ points: (0, _deepClone2.default)(newPoints), activePoint: activePoint });
  },
  updateActivePointDataValue: function updateActivePointDataValue(e) {
    if (this.state.activePoint === -1) {
      return;
    }
    var value = parseFloat(e.target.value);
    var points = this.state.points.map(function (pt) {
      return makeESLintHappy({ x: pt.x, y: pt.y });
    });
    points[this.state.activePoint].x = (value - this.props.rangeMin) / (this.props.rangeMax - this.props.rangeMin);
    this.editor.setControlPoints(points, this.state.activePoint);
  },
  updateActivePointOpacity: function updateActivePointOpacity(e) {
    if (this.state.activePoint === -1) {
      return;
    }
    var value = parseFloat(e.target.value);
    var points = this.state.points.map(function (pt) {
      return makeESLintHappy({ x: pt.x, y: pt.y });
    });
    points[this.state.activePoint].y = value;
    this.editor.setControlPoints(points, this.state.activePoint);
  },
  addPoint: function addPoint(e) {
    var points = this.state.points.map(function (pt) {
      return makeESLintHappy({ x: pt.x, y: pt.y });
    });
    points.push({ x: 0.5, y: 0.5 });
    this.editor.setControlPoints(points, points.length - 1);
  },
  removePoint: function removePoint(e) {
    if (this.state.activePoint === -1) {
      return;
    }
    var points = this.state.points.map(function (pt) {
      return makeESLintHappy({ x: pt.x, y: pt.y });
    });
    points.splice(this.state.activePoint, 1);
    this.editor.setActivePoint(-1);
    this.editor.setControlPoints(points);
  },
  render: function render() {
    var activePointDataValue = (this.state.activePoint !== -1 ? this.state.points[this.state.activePoint].x : 0.5) * (this.props.rangeMax - this.props.rangeMin) + this.props.rangeMin;
    var activePointOpacity = this.state.activePoint !== -1 ? this.state.points[this.state.activePoint].y : 0.5;
    return _react2.default.createElement(
      'div',
      { className: this.props.visible ? _PieceWiseFunctionEditorWidget2.default.pieceWiseFunctionEditorWidget : _PieceWiseFunctionEditorWidget2.default.hidden },
      _react2.default.createElement('canvas', {
        className: _PieceWiseFunctionEditorWidget2.default.canvas,
        width: this.state.width,
        height: this.state.height,
        ref: 'canvas'
      }),
      _react2.default.createElement(
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