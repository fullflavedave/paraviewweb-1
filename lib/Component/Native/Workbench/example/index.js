define(['..', '../../ToggleControl', '../../BackgroundColor', '../../Spacer', '../../Composite', '../../../React/ReactAdapter', '../../../React/WorkbenchController', '../../../../Common/Misc/Debounce', 'normalize.css'], function (_, _ToggleControl, _BackgroundColor, _Spacer, _Composite, _ReactAdapter, _WorkbenchController, _Debounce) {
  'use strict';

  var _2 = _interopRequireDefault(_);

  var _ToggleControl2 = _interopRequireDefault(_ToggleControl);

  var _BackgroundColor2 = _interopRequireDefault(_BackgroundColor);

  var _Spacer2 = _interopRequireDefault(_Spacer);

  var _Composite2 = _interopRequireDefault(_Composite);

  var _ReactAdapter2 = _interopRequireDefault(_ReactAdapter);

  var _WorkbenchController2 = _interopRequireDefault(_WorkbenchController);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var container = document.querySelector('.content');
  container.style.height = '100vh';
  container.style.width = '100vw';

  var green = new _BackgroundColor2.default('green');
  var red = new _BackgroundColor2.default('red');
  var blue = new _BackgroundColor2.default('blue');
  var pink = new _BackgroundColor2.default('pink');
  var gray = new _BackgroundColor2.default('gray');

  // const toggleView = new ToggleControl(green, red);

  var viewports = {
    Gray: {
      component: gray,
      viewport: 2
    },
    // ToggleView: {
    //   component: toggleView,
    //   viewport: 0,
    // },
    Green: {
      component: green,
      viewport: 0
    },
    Red: {
      component: red,
      viewport: -1
    },
    Blue: {
      component: blue,
      viewport: 1
    },
    Pink: {
      component: pink,
      viewport: 3
    }
  };

  var workbench = new _2.default();
  workbench.setComponents(viewports);
  workbench.setLayout('2x2');

  var props = {
    onLayoutChange: function onLayoutChange(layout) {
      workbench.setLayout(layout);
    },
    onViewportChange: function onViewportChange(index, instance) {
      workbench.setViewport(index, instance);
    },

    activeLayout: workbench.getLayout(),
    viewports: workbench.getViewportMapping(),
    count: 4
  };

  var controlPanel = new _ReactAdapter2.default(_WorkbenchController2.default, props);
  var shiftedWorkbench = new _Composite2.default();
  shiftedWorkbench.addViewport(new _Spacer2.default(), false);
  shiftedWorkbench.addViewport(workbench);
  var mainComponent = new _ToggleControl2.default(shiftedWorkbench, controlPanel, 280);
  mainComponent.setContainer(container);

  workbench.onChange(function (model) {
    props.activeLayout = model.layout;
    props.viewports = model.viewports;
    props.count = model.count;
    controlPanel.render();
  });

  // Create a debounced window resize handler
  var resizeHandler = (0, _Debounce.debounce)(function () {
    mainComponent.resize();
  }, 50);

  // Register window resize handler so workbench redraws when browser is resized
  window.onresize = resizeHandler;
});