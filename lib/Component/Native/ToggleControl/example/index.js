define(['..', '../../BackgroundColor', 'normalize.css'], function (_, _BackgroundColor) {
  'use strict';

  var _2 = _interopRequireDefault(_);

  var _BackgroundColor2 = _interopRequireDefault(_BackgroundColor);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var container = document.querySelector('.content');

  // Load CSS

  container.style.height = '100vh';

  var green = new _BackgroundColor2.default('green');
  var red = new _BackgroundColor2.default('red');
  var toggleView = new _2.default(green, red);

  toggleView.setContainer(container);
  toggleView.render();

  window.addEventListener('resize', function () {
    toggleView.resize();
  });
});