'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiClicker;

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DOUBLE_CLICK_TIMEOUT = 300; // win7 default is 500 ms

/*
 * Use this function if you need both single-click and double-click handlers on
 * a node.  If you only need one or the other, simply listen to the 'click' and
 * 'dblclick' events.  Otherwise, you can use this function as follows:
 *
 * d3.select('.someclass').
 *   on('click', multiClicker([
 *     function(d, i) { // single click handler
 *       // do single-click stuff with "d", "i", or "d3.select(this)", as usual
 *     },
 *     function(d, i) { // double click handler
 *       // do double-click stuff with "d", "i", or "d3.select(this)", as usual
 *     },
 *   ]));
 *
 */
function multiClicker(handlers) {
  var timer = null;
  var singleClick = handlers[0];
  var doubleClick = handlers[1];
  var clickEvent = null;

  return function inner() {
    var _this = this;

    clearTimeout(timer);
    /* eslint-disable prefer-rest-params */
    var args = Array.prototype.slice.call(arguments, 0);
    /* eslint-enable prefer-rest-params */
    if (timer === null) {
      clickEvent = _d2.default.event;
      timer = setTimeout(function () {
        timer = null;
        _d2.default.event = clickEvent;
        singleClick.apply(_this, args);
      }, DOUBLE_CLICK_TIMEOUT);
    } else {
      timer = null;
      doubleClick.apply(this, args);
    }
  };
}