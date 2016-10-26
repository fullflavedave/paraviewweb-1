define(['exports', 'react', 'PVWStyle/ReactContainers/OverlayWindow.mcss'], function (exports, _react, _OverlayWindow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _OverlayWindow2 = _interopRequireDefault(_OverlayWindow);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* eslint-disable react/no-unused-prop-types */

  // Clamp, but also let us know how much we cut off
  function diffClamp(value, min, max) {
    if (value > max) {
      return { value: max, diff: value - max };
    } else if (value < min) {
      return { value: min, diff: value - min };
    }
    return { value: value, diff: 0 };
  }

  // Return extra information about the target element bounds
  function getMouseEventInfo(event, divElt) {
    var clientRect = divElt.getBoundingClientRect();
    return {
      relX: event.clientX - clientRect.left,
      relY: event.clientY - clientRect.top,
      eltBounds: clientRect
    };
  }

  function createDragHandlers(thisObj) {
    function computeMouseDelta(event, container) {
      var eventInfo = getMouseEventInfo(event, container);
      var delX = event.screenX - thisObj.getLastScreenX();
      var delY = event.screenY - thisObj.getLastScreenY();
      return {
        delX: delX,
        delY: delY,
        eltBounds: eventInfo.eltBounds
      };
    }
    return {
      topLeft: function topLeft(event) {
        var _computeMouseDelta = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delX = _computeMouseDelta.delX;
        var delY = _computeMouseDelta.delY;

        var maxX = thisObj.state.x + thisObj.state.width - 2 * thisObj.props.marginSize - thisObj.props.minContentWidth;
        var maxY = thisObj.state.y + thisObj.state.height - (2 * thisObj.props.marginSize + thisObj.props.titleBarHeight) - thisObj.props.minContentHeight;
        var dx = diffClamp(thisObj.state.x + delX, 0, maxX);
        var dy = diffClamp(thisObj.state.y + delY, 0, maxY);
        thisObj.setState({
          x: dx.value,
          y: dy.value,
          width: thisObj.state.width - (delX - dx.diff),
          height: thisObj.state.height - (delY - dy.diff)
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      topRight: function topRight(event) {
        var _computeMouseDelta2 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delX = _computeMouseDelta2.delX;
        var delY = _computeMouseDelta2.delY;
        var eltBounds = _computeMouseDelta2.eltBounds;

        var minWidth = 2 * thisObj.props.marginSize + thisObj.props.minContentWidth;
        var maxWidth = eltBounds.width - thisObj.state.x;
        var maxY = thisObj.state.y + thisObj.state.height - (2 * thisObj.props.marginSize + thisObj.props.titleBarHeight) - thisObj.props.minContentHeight;
        var dw = diffClamp(thisObj.state.width + delX, minWidth, maxWidth);
        var dy = diffClamp(thisObj.state.y + delY, 0, maxY);
        thisObj.setState({
          y: dy.value,
          width: dw.value,
          height: thisObj.state.height - (delY - dy.diff)
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      bottomLeft: function bottomLeft(event) {
        var _computeMouseDelta3 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delX = _computeMouseDelta3.delX;
        var delY = _computeMouseDelta3.delY;
        var eltBounds = _computeMouseDelta3.eltBounds;

        var maxX = thisObj.state.x + thisObj.state.width - 2 * thisObj.props.marginSize - thisObj.props.minContentWidth;
        var minHeight = 2 * thisObj.props.marginSize + thisObj.props.titleBarHeight + thisObj.props.minContentHeight;
        var maxHeight = eltBounds.height - thisObj.state.y;
        var dx = diffClamp(thisObj.state.x + delX, 0, maxX);
        var dh = diffClamp(thisObj.state.height + delY, minHeight, maxHeight);
        thisObj.setState({
          x: dx.value,
          width: thisObj.state.width - (delX - dx.diff),
          height: dh.value
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      bottomRight: function bottomRight(event) {
        var _computeMouseDelta4 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delX = _computeMouseDelta4.delX;
        var delY = _computeMouseDelta4.delY;
        var eltBounds = _computeMouseDelta4.eltBounds;

        var minWidth = 2 * thisObj.props.marginSize + thisObj.props.minContentWidth;
        var maxWidth = eltBounds.width - thisObj.state.x;
        var minHeight = 2 * thisObj.props.marginSize + thisObj.props.titleBarHeight + thisObj.props.minContentHeight;
        var maxHeight = eltBounds.height - thisObj.state.y;
        var dw = diffClamp(thisObj.state.width + delX, minWidth, maxWidth);
        var dh = diffClamp(thisObj.state.height + delY, minHeight, maxHeight);
        thisObj.setState({
          width: dw.value,
          height: dh.value
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      top: function top(event) {
        var _computeMouseDelta5 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delY = _computeMouseDelta5.delY;

        var maxY = thisObj.state.y + thisObj.state.height - (2 * thisObj.props.marginSize + thisObj.props.titleBarHeight) - thisObj.props.minContentHeight;
        var dy = diffClamp(thisObj.state.y + delY, 0, maxY);
        thisObj.setState({
          y: dy.value,
          height: thisObj.state.height - (delY - dy.diff)
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      right: function right(event) {
        var _computeMouseDelta6 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delX = _computeMouseDelta6.delX;
        var eltBounds = _computeMouseDelta6.eltBounds;

        var minWidth = 2 * thisObj.props.marginSize + thisObj.props.minContentWidth;
        var maxWidth = eltBounds.width - thisObj.state.x;
        var dw = diffClamp(thisObj.state.width + delX, minWidth, maxWidth);
        thisObj.setState({
          width: dw.value
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      bottom: function bottom(event) {
        var _computeMouseDelta7 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delY = _computeMouseDelta7.delY;
        var eltBounds = _computeMouseDelta7.eltBounds;

        var minHeight = 2 * thisObj.props.marginSize + thisObj.props.titleBarHeight + thisObj.props.minContentHeight;
        var maxHeight = eltBounds.height - thisObj.state.y;
        var dh = diffClamp(thisObj.state.height + delY, minHeight, maxHeight);
        thisObj.setState({
          height: dh.value
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      left: function left(event) {
        var _computeMouseDelta8 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var delX = _computeMouseDelta8.delX;

        var maxX = thisObj.state.x + thisObj.state.width - 2 * thisObj.props.marginSize - thisObj.props.minContentWidth;
        var dx = diffClamp(thisObj.state.x + delX, 0, maxX);
        thisObj.setState({
          x: dx.value,
          width: thisObj.state.width - (delX - dx.diff)
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      },
      move: function move(event) {
        var _computeMouseDelta9 = computeMouseDelta(event, thisObj.eventContainerDiv);

        var eltBounds = _computeMouseDelta9.eltBounds;

        var maxX = eltBounds.width - thisObj.state.width;
        var maxY = eltBounds.height - thisObj.state.height;
        var dx = diffClamp(thisObj.state.x + (event.screenX - thisObj.getLastScreenX()), 0, maxX);
        var dy = diffClamp(thisObj.state.y + (event.screenY - thisObj.getLastScreenY()), 0, maxY);
        thisObj.setState({
          x: dx.value,
          y: dy.value
        });
        thisObj.setLastScreenX(event.screenX);
        thisObj.setLastScreenY(event.screenY);
      }
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'OverlayWindow',

    propTypes: {
      children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.array]),
      cloneChildren: _react2.default.PropTypes.bool,
      height: _react2.default.PropTypes.number,
      hotCornerExtra: _react2.default.PropTypes.number, // FIXME: Constrain to (positive) integer?
      marginSize: _react2.default.PropTypes.number,
      minContentHeight: _react2.default.PropTypes.number,
      minContentWidth: _react2.default.PropTypes.number,
      onResize: _react2.default.PropTypes.func,
      onActive: _react2.default.PropTypes.func,
      title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element, _react2.default.PropTypes.array, _react2.default.PropTypes.object]),
      titleBarHeight: _react2.default.PropTypes.number,
      front: _react2.default.PropTypes.bool,
      visible: _react2.default.PropTypes.bool,
      width: _react2.default.PropTypes.number,
      x: _react2.default.PropTypes.number,
      y: _react2.default.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
      return {
        cloneChildren: false,
        height: 100,
        hotCornerExtra: 2,
        marginSize: 5,
        minContentHeight: 2,
        minContentWidth: 2,
        resizable: true,
        title: null,
        titleBarHeight: 25,
        visible: true,
        width: 200,
        front: false,
        onActive: function onActive() {},
        x: 10,
        y: 10
      };
    },
    getInitialState: function getInitialState() {
      return {
        x: this.props.x,
        y: this.props.y,
        height: this.props.height,
        width: this.props.width,
        cursor: null,
        dragging: false
      };
    },
    componentWillMount: function componentWillMount() {
      var _this = this;

      this.lastScreenY = 0;
      this.lastScreenX = 0;
      this.getLastScreenX = function () {
        return _this.lastScreenX;
      };
      this.getLastScreenY = function () {
        return _this.lastScreenY;
      };
      this.setLastScreenX = function (x) {
        _this.lastScreenX = x;
      };
      this.setLastScreenY = function (y) {
        _this.lastScreenY = y;
      };
      this.handlerMap = createDragHandlers(this);
      this.dragHandler = this.mouseMove;
    },
    componentDidMount: function componentDidMount() {
      if (this.props.onResize) {
        this.props.onResize(this.state.width, this.state.height, this);
      }
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
      if (this.state.width !== prevState.width || this.state.height !== prevState.height) {
        if (this.props.onResize) {
          this.props.onResize(this.state.width, this.state.height, this);
        }
      }
    },
    computeActionRegion: function computeActionRegion(evt) {
      var _getMouseEventInfo = getMouseEventInfo(evt, this.mainContainerDiv);

      var x = _getMouseEventInfo.relX;
      var y = _getMouseEventInfo.relY;

      this.setLastScreenX(evt.screenX);
      this.setLastScreenY(evt.screenY);

      var contentWidth = this.state.width - 2 * this.props.marginSize;
      var contentHeight = this.state.height - (2 * this.props.marginSize + this.props.titleBarHeight);

      var actionStruct = {
        cursor: null,
        dragAction: null
      };

      if (evt.target.nodeName === 'OPTION') {
        return actionStruct;
      }

      if (x < this.props.marginSize) {
        actionStruct.cursor = 'ew-resize';
        actionStruct.dragAction = this.handlerMap.left;
      } else if (x > this.props.marginSize + contentWidth) {
        actionStruct.cursor = 'ew-resize';
        actionStruct.dragAction = this.handlerMap.right;
      }

      if (y < this.props.marginSize) {
        actionStruct.cursor = 'ns-resize';
        actionStruct.dragAction = this.handlerMap.top;
      } else if (y < this.props.marginSize + this.props.titleBarHeight) {
        actionStruct.cursor = 'move';
        actionStruct.dragAction = this.handlerMap.move;
      } else if (y >= this.props.marginSize + this.props.titleBarHeight + contentHeight && y <= 2 * this.props.marginSize + this.props.titleBarHeight + contentHeight) {
        actionStruct.cursor = 'ns-resize';
        actionStruct.dragAction = this.handlerMap.bottom;
      }

      return actionStruct;
    },
    hotCornerDown: function hotCornerDown(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      switch (evt.currentTarget.className) {
        case 'ulCorner':
          this.dragHandler = this.handlerMap.topLeft;
          this.setState({ cursor: 'nwse-resize', dragging: true });
          break;
        case 'urCorner':
          this.dragHandler = this.handlerMap.topRight;
          this.setState({ cursor: 'nesw-resize', dragging: true });
          break;
        case 'llCorner':
          this.dragHandler = this.handlerMap.bottomLeft;
          this.setState({ cursor: 'nesw-resize', dragging: true });
          break;
        case 'lrCorner':
          this.dragHandler = this.handlerMap.bottomRight;
          this.setState({ cursor: 'nwse-resize', dragging: true });
          break;
        default:
          break;
      }
    },
    mouseMove: function mouseMove(evt) {
      var actionStruct = this.computeActionRegion(evt);
      this.setState({ cursor: actionStruct.cursor });
    },
    mouseDown: function mouseDown(evt) {
      var actionStruct = this.computeActionRegion(evt);
      if (actionStruct.dragAction !== null) {
        evt.preventDefault();
        this.dragHandler = actionStruct.dragAction;
        this.setState({ cursor: actionStruct.cursor, dragging: true });
        this.props.onActive(true, this);
      }
    },
    mouseUp: function mouseUp(evt) {
      var _this2 = this;

      var actionStruct = this.computeActionRegion(evt);
      this.dragHandler = this.mouseMove;
      this.setState({ cursor: actionStruct.cursor, dragging: false });
      setImmediate(function () {
        return _this2.props.onActive(false, _this2);
      });
    },
    render: function render() {
      var _this3 = this;

      if (!this.props.visible) {
        return null;
      }

      // Configure the initial event container props and style overrides
      var eventDivProps = {
        className: this.props.front ? _OverlayWindow2.default.frontEventContainer : _OverlayWindow2.default.backEventContainer,
        ref: function ref(c) {
          return _this3.eventContainerDiv = c;
        },
        style: {}
      };

      // Configure the initial main container props and style overrides
      var mainDivProps = {
        className: _OverlayWindow2.default.mainContainer,
        ref: function ref(c) {
          return _this3.mainContainerDiv = c;
        },
        style: {
          width: this.state.width,
          height: this.state.height,
          top: this.state.y,
          left: this.state.x
        }
      };

      // Make adjustments based on whether or not we're currently dragging
      if (this.state.dragging === true) {
        eventDivProps.onMouseUp = this.mouseUp;
        eventDivProps.onMouseMove = this.dragHandler;
        mainDivProps.style.pointerEvents = 'none';
        eventDivProps.style.pointerEvents = 'auto';
        if (this.state.cursor !== null) {
          eventDivProps.style.cursor = this.state.cursor;
        }
      } else {
        mainDivProps.onMouseDown = this.mouseDown;
        mainDivProps.onMouseUp = this.mouseUp;
        mainDivProps.onMouseMove = this.dragHandler;
        mainDivProps.style.pointerEvents = 'auto';
        eventDivProps.style.pointerEvents = 'none';
        if (this.state.cursor !== null) {
          mainDivProps.style.cursor = this.state.cursor;
        }
      }

      // Configure the content container props and style overrides
      var contentDivProps = {
        className: _OverlayWindow2.default.content,
        style: {
          top: this.props.marginSize + this.props.titleBarHeight,
          right: this.props.marginSize,
          bottom: this.props.marginSize,
          left: this.props.marginSize
        }
      };

      if (this.state.dragging === true) {
        contentDivProps.style.opacity = 0.5;
        contentDivProps.style.pointerEvents = 'none';
      }

      // Configure the title bar props and style overrides
      var titleBarProps = {
        className: _OverlayWindow2.default.titleBar,
        style: {
          top: this.props.marginSize,
          right: this.props.marginSize,
          left: this.props.marginSize,
          height: this.props.titleBarHeight,
          lineHeight: this.props.titleBarHeight + 'px'
        }
      };

      // Configure the hot corner divs
      var offset = this.props.hotCornerExtra;
      var w = 2 * offset + this.props.marginSize;

      // Clone children in order to add a prop which could force redraw of children
      var overlayContentSize = this.state.width + 'x' + this.state.height;
      var children = this.props.cloneChildren ? _react2.default.Children.map(this.props.children, function (child, idx) {
        return _react2.default.cloneElement(child, { overlayContentSize: overlayContentSize });
      }) : this.props.children;

      return _react2.default.createElement(
        'div',
        eventDivProps,
        _react2.default.createElement(
          'div',
          mainDivProps,
          _react2.default.createElement('div', {
            className: 'ulCorner', key: 0, onMouseDown: this.hotCornerDown,
            style: { position: 'absolute', width: w, height: w, top: -offset, left: -offset, cursor: 'nwse-resize', pointerEvents: 'auto' }
          }),
          _react2.default.createElement('div', {
            className: 'urCorner', key: 1, onMouseDown: this.hotCornerDown,
            style: { position: 'absolute', width: w, height: w, top: -offset, right: -offset, cursor: 'nesw-resize', pointerEvents: 'auto' }
          }),
          _react2.default.createElement('div', {
            className: 'llCorner', key: 2, onMouseDown: this.hotCornerDown,
            style: { position: 'absolute', width: w, height: w, bottom: -offset, left: -offset, cursor: 'nesw-resize', pointerEvents: 'auto' }
          }),
          _react2.default.createElement('div', {
            className: 'lrCorner', key: 3, onMouseDown: this.hotCornerDown,
            style: { position: 'absolute', width: w, height: w, bottom: -offset, right: -offset, cursor: 'nwse-resize', pointerEvents: 'auto' }
          }),
          _react2.default.createElement(
            'div',
            titleBarProps,
            this.props.title
          ),
          _react2.default.createElement(
            'div',
            contentDivProps,
            children
          )
        )
      );
    }
  });
});