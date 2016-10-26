'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = document.createElement('canvas');
container.setAttribute('width', 400);
container.setAttribute('height', 300);

document.body.appendChild(container);

var editor = new _2.default(container);

editor.onChange(function (controlPoints, envelope) {
  console.log(controlPoints);
});

editor.setControlPoints([{ x: 0.0, y: 0.0 }, { x: 0.25, y: 0.75 }, { x: 0.5, y: 0.25 }, { x: 0.75, y: 0.5 }, { x: 1, y: 1 }]);