'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global document */

var _monologue = require('monologue.js');

var _monologue2 = _interopRequireDefault(_monologue);

var _Workbench = require('PVWStyle/ComponentNative/Workbench.mcss');

var _Workbench2 = _interopRequireDefault(_Workbench);

var _Layouts = require('../../../React/Renderers/MultiLayoutRenderer/Layouts');

var _Layouts2 = _interopRequireDefault(_Layouts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CHANGE_TOPIC = 'Workbench.change';
var noOpRenderer = {
  resize: function resize() {},
  render: function render() {}
};
var NUMBER_OF_VIEWPORTS = 4;
var LAYOUT_TO_COUNT = {
  '2x2': 4,
  '1x1': 1,
  '1x2': 2,
  '2x1': 2,
  '3xT': 3,
  '3xL': 3,
  '3xR': 3,
  '3xB': 3
};

function applyLayout(viewport, layout) {
  var el = viewport.el;
  var renderer = viewport.renderer;

  var styleElements = [];

  if (layout) {
    styleElements = layout.slice();
  } else {
    styleElements = [0, 0, 0, 0];
  }

  el.style.top = styleElements[1] + 'px';
  el.style.left = styleElements[0] + 'px';
  el.style.width = styleElements[2] + 'px';
  el.style.height = styleElements[3] + 'px';

  (renderer || noOpRenderer).resize();
}

var ComponentWorkbench = function () {
  function ComponentWorkbench(el) {
    var _this = this;

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$useMouse = _ref.useMouse;
    var useMouse = _ref$useMouse === undefined ? true : _ref$useMouse;
    var _ref$spacing = _ref.spacing;
    var spacing = _ref$spacing === undefined ? 10 : _ref$spacing;
    var _ref$center = _ref.center;
    var center = _ref$center === undefined ? [0.5, 0.5] : _ref$center;

    _classCallCheck(this, ComponentWorkbench);

    this.el = null;
    this.useMouse = useMouse;
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.wbArrange = {
      center: center,
      spacing: spacing
    };
    this.layoutList = [];
    this.boundingRect = {};
    this.viewportList = [];
    this.activeLayout = Object.keys(_Layouts2.default)[0];
    this.layoutFn = _Layouts2.default[this.activeLayout];
    this.mouseHandlers = {
      mousedown: function mousedown(event) {
        if (_this.getClickedViewport(event.clientX - _this.boundingRect.left, event.clientY - _this.boundingRect.top) === -1 && event.target === _this.el) {
          _this.dragging = true;
          // offset from current center to drag start.
          _this.dragOffset.x = _this.boundingRect.width * _this.wbArrange.center[0] - (event.clientX - _this.boundingRect.left);
          _this.dragOffset.y = _this.boundingRect.height * _this.wbArrange.center[1] - (event.clientY - _this.boundingRect.top);
          event.stopPropagation();
          event.preventDefault();
        }
      },
      mouseup: function mouseup(event) {
        _this.dragging = false;
      },
      mousemove: function mousemove(event) {
        if (_this.dragging) {
          event.stopPropagation();
          event.preventDefault();
          var centerSize = _this.wbArrange.spacing;
          if (Math.abs(_this.dragOffset.x) > centerSize) {
            // only drag boundary vertically
            _this.wbArrange.center[1] = (event.clientY - _this.boundingRect.top + _this.dragOffset.y) / _this.boundingRect.height;
          } else if (Math.abs(_this.dragOffset.y) > centerSize) {
            // only drag boundary horizontally
            _this.wbArrange.center[0] = (event.clientX - _this.boundingRect.left + _this.dragOffset.x) / _this.boundingRect.width;
          } else {
            _this.wbArrange.center = [(event.clientX - _this.boundingRect.left + _this.dragOffset.x) / _this.boundingRect.width, (event.clientY - _this.boundingRect.top + _this.dragOffset.y) / _this.boundingRect.height];
          }
          _this.render();
        }
      }
    };

    this.initializeViewports();
    this.setContainer(el);
    this.computeContainerGeometry();
  }

  _createClass(ComponentWorkbench, [{
    key: 'initializeViewports',
    value: function initializeViewports() {
      for (var i = 0; i < NUMBER_OF_VIEWPORTS; ++i) {
        var newElt = document.createElement('div');
        newElt.setAttribute('class', _Workbench2.default.viewport);

        this.viewportList.push({
          el: newElt,
          renderer: null
        });
      }
    }
  }, {
    key: 'setComponents',
    value: function setComponents(componentDict) {
      var _this2 = this;

      this.componentMap = componentDict;

      Object.keys(componentDict).forEach(function (k) {
        if (componentDict[k].viewport !== -1) {
          // set the viewport as well
          _this2.setViewport(componentDict[k].viewport, componentDict[k].component, false);
        }
      });

      this.componentMap.None = {
        component: null,
        viewport: -1
      };

      this.triggerChange();
    }
  }, {
    key: 'getClickedViewport',
    value: function getClickedViewport(x, y) {
      var index = -1;
      for (var i = 0; i < this.layoutList.length; ++i) {
        var layout = this.layoutList[i];
        if (x >= layout[0] && x <= layout[0] + layout[2] && y >= layout[1] && y <= layout[1] + layout[3]) {
          index = i;
        }
      }
      return index;
    }
  }, {
    key: 'addMouseListeners',
    value: function addMouseListeners() {
      // Set up mouse handling so we can resize the individual viewports
      this.el.addEventListener('mousedown', this.mouseHandlers.mousedown);
      this.el.addEventListener('mouseup', this.mouseHandlers.mouseup);
      this.el.addEventListener('mousemove', this.mouseHandlers.mousemove);
    }
  }, {
    key: 'removeMouseListeners',
    value: function removeMouseListeners() {
      this.el.removeEventListener('mousedown', this.mouseHandlers.mousedown);
      this.el.removeEventListener('mouseup', this.mouseHandlers.mouseup);
      this.el.removeEventListener('mousemove', this.mouseHandlers.mousemove);
    }
  }, {
    key: 'render',
    value: function render() {
      var pixelCenter = [this.wbArrange.center[0] * this.boundingRect.width, this.wbArrange.center[1] * this.boundingRect.height];
      this.layoutList = this.layoutFn(pixelCenter, this.wbArrange.spacing, this.wbArrange.width, this.wbArrange.height);

      // Now apply new styles, rendering the new workbench layout and each component
      for (var i = 0; i < NUMBER_OF_VIEWPORTS; ++i) {
        applyLayout(this.viewportList[i], this.layoutList[i]);
      }
    }
  }, {
    key: 'computeContainerGeometry',
    value: function computeContainerGeometry() {
      if (this.el) {
        this.boundingRect = this.el.getBoundingClientRect();
        this.wbArrange.width = this.boundingRect.width;
        this.wbArrange.height = this.boundingRect.height;
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      if (this.el) {
        this.computeContainerGeometry();
        this.render();
      }
    }

    /* eslint-disable class-methods-use-this */

  }, {
    key: 'checkIndex',
    value: function checkIndex(idx) {
      if (idx < 0 || idx >= NUMBER_OF_VIEWPORTS) {
        throw new Error('The only available indices are in the range [0, 3]');
      }
    }
  }, {
    key: 'setViewport',
    value: function setViewport(index, instance) {
      var _this3 = this;

      var shouldTriggerChange = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var count = NUMBER_OF_VIEWPORTS;
      this.checkIndex(index);

      // Find out if this instance is in another viewport
      while (count) {
        count -= 1;
        if (this.viewportList[count].renderer === instance) {
          this.viewportList[count].renderer = null;
        }
      }

      // Find out if this viewport already has something else in it
      if (this.viewportList[index].renderer !== null) {
        this.viewportList[index].renderer.setContainer(null);
        this.viewportList[index].renderer = null;
      }

      this.viewportList[index].renderer = instance;
      this.viewportList[index].el.setAttribute('class', _Workbench2.default.viewport);
      if (instance !== null) {
        instance.setContainer(this.viewportList[index].el);
        instance.resize();
        Object.keys(this.componentMap).forEach(function (name) {
          if (_this3.componentMap[name].component === instance && _this3.componentMap[name].scroll) {
            _this3.viewportList[index].el.setAttribute('class', _Workbench2.default.scrollableViewport);
          }
        });
      }

      if (shouldTriggerChange) {
        this.triggerChange();
      }
    }
  }, {
    key: 'setContainer',
    value: function setContainer(el) {
      var _this4 = this;

      if (this.el) {
        this.viewportList.forEach(function (viewport) {
          _this4.el.removeChild(viewport.el);
        });
        this.removeMouseListeners();
      }

      this.el = el;
      if (this.el) {
        this.viewportList.forEach(function (viewport) {
          _this4.el.appendChild(viewport.el);
        });
        if (this.useMouse) {
          this.addMouseListeners();
        }
        this.resize();
      }
    }
  }, {
    key: 'getViewport',
    value: function getViewport(index) {
      this.checkIndex(index);
      return this.viewportList[index].renderer;
    }

    /* eslint-disable class-methods-use-this */

  }, {
    key: 'getLayoutLabels',
    value: function getLayoutLabels() {
      return Object.keys(_Layouts2.default);
    }

    /*
     * Parameter 'layout' should be one of the layout keys:
     *
     * "2x2", "1x1", "1x2", "2x1", "3xT", "3xL", "3xR", "3xB"
     */

  }, {
    key: 'setLayout',
    value: function setLayout(layout) {
      if (_Layouts2.default[layout]) {
        this.activeLayout = layout;
        this.layoutFn = _Layouts2.default[layout];
        this.resize();
        //
        this.triggerChange();
      }
    }
  }, {
    key: 'getViewportMapping',
    value: function getViewportMapping() {
      var _this5 = this;

      var viewportMapping = this.viewportList.map(function (viewport) {
        return viewport.renderer;
      });
      Object.keys(this.componentMap).forEach(function (name) {
        _this5.componentMap[name].viewport = viewportMapping.indexOf(_this5.componentMap[name].component);
      });
      return this.componentMap;
    }
  }, {
    key: 'getLayout',
    value: function getLayout() {
      return this.activeLayout;
    }
  }, {
    key: 'getLayoutCount',
    value: function getLayoutCount() {
      return LAYOUT_TO_COUNT[this.activeLayout];
    }
  }, {
    key: 'triggerChange',
    value: function triggerChange() {
      var viewports = this.getViewportMapping();
      var layout = this.getLayout();
      var center = this.getCenter();
      var count = LAYOUT_TO_COUNT[layout];
      this.emit(CHANGE_TOPIC, { layout: layout, viewports: viewports, center: center, count: count });
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      return this.on(CHANGE_TOPIC, callback);
    }
  }, {
    key: 'setCenter',
    value: function setCenter(x, y) {
      this.wbArrange.center = [x, y];
      //
      this.triggerChange();
    }
  }, {
    key: 'getCenter',
    value: function getCenter() {
      return this.wbArrange.center;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.off();
      this.setContainer(null);
      this.viewportList.forEach(function (viewport) {
        viewport.el = null;
        if (viewport.renderer && viewport.renderer.destroy) {
          viewport.renderer.destroy();
          viewport.renderer = null;
        }
      });
    }
  }]);

  return ComponentWorkbench;
}();

// Add Observer pattern using Monologue.js


exports.default = ComponentWorkbench;
_monologue2.default.mixInto(ComponentWorkbench);