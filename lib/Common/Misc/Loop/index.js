"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loop = loop;
function loop(reverseOrder, count_, fn) {
  var count = count_;
  if (reverseOrder) {
    while (count--) {
      fn(count);
    }
  } else {
    for (var i = 0; i < count; i++) {
      fn(i);
    }
  }
}

exports.default = {
  loop: loop
};