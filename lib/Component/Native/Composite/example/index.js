'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _BackgroundColor = require('../../BackgroundColor');

var _BackgroundColor2 = _interopRequireDefault(_BackgroundColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

var container = document.querySelector('.content');
container.style.position = 'relative';
container.style.width = '100%';
container.style.height = '600px';

var composite = new _2.default();
var green = new _BackgroundColor2.default('green');
var red = new _BackgroundColor2.default('red');
var blue = new _BackgroundColor2.default('blue');
var pink = new _BackgroundColor2.default('pink');

composite.addViewport(green);
composite.addViewport(red);
composite.addViewport(blue);
composite.addViewport(pink);

composite.setContainer(container);