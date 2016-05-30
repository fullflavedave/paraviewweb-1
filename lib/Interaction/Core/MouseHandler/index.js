'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hammerjs = require('hammerjs');

var _hammerjs2 = _interopRequireDefault(_hammerjs);

var _merge = require('mout/src/object/merge');

var _merge2 = _interopRequireDefault(_merge);

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Module dependencies and constants
var Modifier = {
  NONE: 0,
  ALT: 1,
  META: 2,
  SHIFT: 4,
  CTRL: 8
},
    eventTypeMapping = {
  contextmenu: 'contextmenu',
  mousewheel: 'zoom',
  DOMMouseScroll: 'zoom'
},
    TIMEOUT_BETWEEN_ZOOM = 300;

var handlerCount = 0;

function getModifier(e) {
  var modifier = 0;
  if (e.srcEvent) {
    modifier += e.srcEvent.altKey ? Modifier.ALT : 0;
    modifier += e.srcEvent.ctrlKey ? Modifier.CTRL : 0;
    modifier += e.srcEvent.metaKey ? Modifier.META : 0;
    modifier += e.srcEvent.shiftKey ? Modifier.SHIFT : 0;
  }

  return modifier;
}

function getRelative(el, event) {
  return {
    x: event.center.x - (el.getClientRects()[0].x || el.getClientRects()[0].left),
    y: event.center.y - (el.getClientRects()[0].y || el.getClientRects()[0].top)
  };
}

function broadcast(ctx, topic, event) {
  event.preventDefault();

  event.button = 0;
  event.topic = topic;
  event.modifier = ctx.modifier ? ctx.modifier : getModifier(event);
  event.relative = getRelative(ctx.el, event);

  ctx.emit(topic, event);
}

var MouseHandler = function () {
  function MouseHandler(domElement, options) {
    var _this = this;

    _classCallCheck(this, MouseHandler);

    var defaultOptions = {
      pan: {
        threshold: 0
      },
      pinch: {
        threshold: 0
      }
    };
    var optionsWithDefault = (0, _merge2.default)(defaultOptions, options);

    this.Modifier = Modifier;

    this.id = 'mouse_handler_' + ++handlerCount;
    this.el = domElement;
    this.modifier = 0;
    this.toggleModifiers = [0];
    this.toggleModifierIdx = 0;
    this.toggleModifierEnable = false;
    this.hammer = new _hammerjs2.default(domElement);
    this.scrollInternal = {
      ts: +new Date(),
      deltaX: 0,
      deltaY: 0
    };
    this.finalZoomEvent = null;
    this.finalZoomTimerId = 0;
    this.triggerFinalZoomEvent = function () {
      if (_this.finalZoomEvent) {
        _this.finalZoomEvent.isFirst = false;
        _this.finalZoomEvent.isFinal = true;
      }
      _this.emit(_this.finalZoomEvent.topic, _this.finalZoomEvent);
    };

    this.domEventHandler = function (e) {
      e.preventDefault();
      var event = {
        srcEvent: e,
        button: e.type === 'contextmenu' ? 2 : 0,
        topic: eventTypeMapping[e.type],

        center: {
          x: e.clientX,
          y: e.clientY
        },
        relative: {
          x: e.clientX - (_this.el.getClientRects()[0].x || _this.el.getClientRects()[0].left),
          y: e.clientY - (_this.el.getClientRects()[0].y || _this.el.getClientRects()[0].top)
        },

        scale: 1,

        deltaX: 0,
        deltaY: 0,
        delta: 0,
        deltaTime: 0,

        velocityX: 0,
        velocityY: 0,
        velocity: 0,

        isFirst: false,
        isFinal: false
      };
      event.modifier = _this.modifier ? _this.modifier : getModifier(event);

      // Handle scroll/zoom if any
      if (event.topic === 'zoom') {
        // Register final zoom
        clearTimeout(_this.finalZoomTimerId);
        _this.finalZoomTimerId = setTimeout(_this.triggerFinalZoomEvent, TIMEOUT_BETWEEN_ZOOM);

        var currentTime = +new Date();
        if (currentTime - _this.scrollInternal.ts > TIMEOUT_BETWEEN_ZOOM) {
          _this.scrollInternal.deltaX = 0;
          _this.scrollInternal.deltaY = 0;
          event.isFirst = true;
          event.isFinal = false;
        } else {
          event.isFinal = false;
        }

        if (e.wheelDeltaX === undefined) {
          event.zoom = _this.lastScrollZoomFactor;
          _this.scrollInternal.deltaY -= e.detail * 2.0;
        } else {
          event.zoom = _this.lastScrollZoomFactor;
          _this.scrollInternal.deltaX += e.wheelDeltaX;
          _this.scrollInternal.deltaY += e.wheelDeltaY;
        }

        event.deltaX = _this.scrollInternal.deltaX;
        event.deltaY = _this.scrollInternal.deltaY;
        event.scale = 1.0 + event.deltaY / _this.el.getClientRects()[0].height;
        event.scale = event.scale < 0.1 ? 0.1 : event.scale;
        _this.scrollInternal.ts = currentTime;

        _this.finalZoomEvent = event;
      }

      _this.emit(event.topic, event);
      return false;
    };

    // set hammer options
    this.hammer.get('pan').set(optionsWithDefault.pan);
    this.hammer.get('pinch').set(optionsWithDefault.pinch);

    // Listen to hammer events
    this.hammer.on('tap', function (e) {
      broadcast(_this, 'click', e);
    });

    this.hammer.on('doubletap', function (e) {
      broadcast(_this, 'dblclick', e);
    });

    this.hammer.on('pan', function (e) {
      broadcast(_this, 'drag', e);
    });

    this.hammer.on('panstart', function (e) {
      e.isFirst = true;
      broadcast(_this, 'drag', e);
    });

    this.hammer.on('panend', function (e) {
      e.isFinal = true;
      broadcast(_this, 'drag', e);
    });

    this.hammer.on('pinch', function (e) {
      broadcast(_this, 'zoom', e);
    });

    this.hammer.on('pinchstart', function (e) {
      console.log('zoom start');
      e.isFirst = true;
      broadcast(_this, 'zoom', e);
    });

    this.hammer.on('pinchend', function (e) {
      e.isFinal = true;
      console.log('zoom end');
      broadcast(_this, 'zoom', e);
    });

    this.hammer.get('pinch').set({
      enable: true
    });

    this.hammer.on('press', function (e) {
      if (_this.toggleModifierEnable) {
        _this.toggleModifierIdx = (_this.toggleModifierIdx + 1) % _this.toggleModifiers.length;
        _this.modifier = _this.toggleModifiers[_this.toggleModifierIdx];

        e.relative = getRelative(_this.el, e);

        _this.emit('modifier.change', {
          value: _this.modifier,
          list: Modifier,
          event: e
        });
      }
    });

    // Manage events that are not captured by hammer
    this.el.addEventListener('contextmenu', this.domEventHandler);
    this.el.addEventListener('mousewheel', this.domEventHandler);
    this.el.addEventListener('DOMMouseScroll', this.domEventHandler);
  }

  _createClass(MouseHandler, [{
    key: 'enablePinch',
    value: function enablePinch(enable) {
      this.hammer.get('pinch').set({
        enable: enable
      });
    }
  }, {
    key: 'setModifier',
    value: function setModifier(modifier) {
      this.modifier = modifier;
    }
  }, {
    key: 'toggleModifierOnPress',
    value: function toggleModifierOnPress(enable, modifiers) {
      this.toggleModifiers = modifiers;
      this.toggleModifierEnable = enable;
    }
  }, {
    key: 'attach',
    value: function attach(listeners) {
      var _this2 = this;

      var subscriptions = {};
      Object.keys(listeners).forEach(function (key) {
        subscriptions[key] = _this2.on(key, listeners[key]);
      });
      return subscriptions;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // Remove all listeners is any
      this.off();

      // Release hammer
      this.hammer.destroy();

      // Remove events that are not captured by hammer
      this.el.removeEventListener('contextmenu', this.domEventHandler);
      this.el.removeEventListener('mousewheel', this.domEventHandler);
      this.el.removeEventListener('DOMMouseScroll', this.domEventHandler);
    }
  }]);

  return MouseHandler;
}();

// Add Observer pattern using Monologue.js


exports.default = MouseHandler;
_monologue2.default.mixInto(MouseHandler);