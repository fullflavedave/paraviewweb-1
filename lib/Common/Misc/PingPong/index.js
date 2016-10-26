'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WebGl = require('../WebGl');

var _WebGl2 = _interopRequireDefault(_WebGl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PingPong = function () {
  function PingPong(gl, fbos, textures) {
    _classCallCheck(this, PingPong);

    this.gl = gl;
    this.idx = 0;
    this.fbos = fbos;
    this.textures = textures;

    _WebGl2.default.bindTextureToFramebuffer(this.gl, this.fbos[0], this.textures[1]);
    _WebGl2.default.bindTextureToFramebuffer(this.gl, this.fbos[1], this.textures[0]);
  }

  _createClass(PingPong, [{
    key: 'swap',
    value: function swap() {
      this.idx += 1;
      this.idx %= 2;
    }
  }, {
    key: 'clearFbo',
    value: function clearFbo() {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbos[0]);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbos[1]);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);

      this.idx = 0;
    }
  }, {
    key: 'getFramebuffer',
    value: function getFramebuffer() {
      return this.fbos[this.idx];
    }
  }, {
    key: 'getRenderingTexture',
    value: function getRenderingTexture() {
      return this.textures[this.idx];
    }
  }]);

  return PingPong;
}();

exports.default = PingPong;