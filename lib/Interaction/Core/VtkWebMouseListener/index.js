'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modifier = {
  NONE: 0,
  ALT: 1,
  META: 2,
  SHIFT: 4,
  CTRL: 8
},
    INTERATION_TOPIC = 'vtk.web.interaction';

var NoOp = function NoOp() {};

var VtkMouseListener = function () {
  function VtkMouseListener(vtkWebClient) {
    var _this = this;

    var width = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
    var height = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];

    _classCallCheck(this, VtkMouseListener);

    this.client = vtkWebClient;
    this.ready = true;
    this.width = width;
    this.height = height;
    this.setInteractionDoneCallback();
    this.listeners = {
      drag: function drag(event) {
        var vtkEvent = {
          view: -1,
          buttonLeft: !event.isFinal,
          buttonMiddle: false,
          buttonRight: false,
          shiftKey: event.modifier & modifier.SHIFT,
          ctrlKey: event.modifier & modifier.CTRL,
          altKey: event.modifier & modifier.ALT,
          metaKey: event.modifier & modifier.META,
          x: event.relative.x / _this.width,
          y: 1.0 - event.relative.y / _this.height
        };
        if (event.isFirst) {
          // Down
          vtkEvent.action = 'down';
        } else if (event.isFinal) {
          // Up
          vtkEvent.action = 'up';
        } else {
          // Move
          vtkEvent.action = 'move';
        }
        _this.emit(INTERATION_TOPIC, vtkEvent.action !== 'up');
        if (_this.client) {
          if (_this.ready || vtkEvent.action !== 'move') {
            _this.ready = false;
            _this.client.MouseHandler.interaction(vtkEvent).then(function (resp) {
              _this.ready = true;
              _this.doneCallback(vtkEvent.action !== 'up');
            }, function (err) {
              console.log('event err', err);
              _this.doneCallback(vtkEvent.action !== 'up');
            });
          }
        }
      },
      zoom: function zoom(event) {
        var vtkEvent = {
          view: -1,
          buttonLeft: false,
          buttonMiddle: false,
          buttonRight: !event.isFinal,
          shiftKey: false,
          ctrlKey: false,
          altKey: false,
          metaKey: false,
          x: event.relative.x / _this.width,
          y: 1.0 - (event.relative.y + event.deltaY) / _this.height
        };
        if (event.isFirst) {
          // Down
          vtkEvent.action = 'down';
        } else if (event.isFinal) {
          // Up
          vtkEvent.action = 'up';
        } else {
          // Move
          vtkEvent.action = 'move';
        }
        _this.emit(INTERATION_TOPIC, vtkEvent.action !== 'up');
        if (_this.client) {
          _this.client.MouseHandler.interaction(vtkEvent).then(function (resp) {
            _this.doneCallback(vtkEvent.action !== 'up');
          }, function (err) {
            _this.doneCallback(vtkEvent.action !== 'up');
          });
        }
      }
    };
  }

  _createClass(VtkMouseListener, [{
    key: 'getListeners',
    value: function getListeners() {
      return this.listeners;
    }
  }, {
    key: 'setInteractionDoneCallback',
    value: function setInteractionDoneCallback(callback) {
      this.doneCallback = callback || NoOp;
    }
  }, {
    key: 'updateSize',
    value: function updateSize(w, h) {
      this.width = w;
      this.height = h;
    }
  }, {
    key: 'onInteraction',
    value: function onInteraction(callback) {
      return this.on(INTERATION_TOPIC, callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.client = null;
      this.listeners = null;
    }
  }]);

  return VtkMouseListener;
}();

// Add Observer pattern using Monologue.js


exports.default = VtkMouseListener;
_monologue2.default.mixInto(VtkMouseListener);