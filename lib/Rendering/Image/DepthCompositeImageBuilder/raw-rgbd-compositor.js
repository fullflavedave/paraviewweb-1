'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _max = require('mout/object/max');

var _max2 = _interopRequireDefault(_max);

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

var _WebGl = require('../../../Common/Misc/WebGl');

var _WebGl2 = _interopRequireDefault(_WebGl);

var _PingPong = require('../../../Common/Misc/PingPong');

var _PingPong2 = _interopRequireDefault(_PingPong);

var _basic = require('../../../Common/Misc/WebGl/shaders/vertex/basic.c');

var _basic2 = _interopRequireDefault(_basic);

var _display = require('./shaders/fragment/display.c');

var _display2 = _interopRequireDefault(_display);

var _composite = require('./shaders/fragment/composite.c');

var _composite2 = _interopRequireDefault(_composite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BinaryCompositor = function () {
  function BinaryCompositor(_ref) {
    var _this = this;

    var queryDataModel = _ref.queryDataModel;
    var imageBuilder = _ref.imageBuilder;

    _classCallCheck(this, BinaryCompositor);

    this.queryDataModel = queryDataModel;
    this.imageBuilder = imageBuilder;
    this.rgbdData = null;
    this.offsetList = [];
    this.spriteSize = (0, _max2.default)(this.queryDataModel.originalData.CompositePipeline.offset);

    this.dataSubscription = queryDataModel.onDataChange(function (data, envelope) {
      _this.rgbdData = data.rgbdSprite.data;
      _this.render();
    });

    this.width = this.queryDataModel.originalData.CompositePipeline.dimensions[0];
    this.height = this.queryDataModel.originalData.CompositePipeline.dimensions[1];
    this.glCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);

    // Inialize GL context
    this.gl = this.glCanvas.get3DContext();
    if (!this.gl) {
      console.error('Unable to get WebGl context');
      return;
    }

    // Set clear color to white, fully transparent
    this.gl.clearColor(1.0, 1.0, 1.0, 0.0);

    // Set up GL resources
    this.glConfig = {
      programs: {
        displayProgram: {
          vertexShader: _basic2.default,
          fragmentShader: _display2.default,
          mapping: 'default'
        },
        compositeProgram: {
          vertexShader: _basic2.default,
          fragmentShader: _composite2.default,
          mapping: 'default'
        }
      },
      resources: {
        buffers: [{
          id: 'texCoord',
          data: new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0])
        }, {
          id: 'posCoord',
          data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
        }],
        textures: [{
          id: 'texture2D',
          pixelStore: [['UNPACK_FLIP_Y_WEBGL', true]],
          texParameter: [['TEXTURE_MAG_FILTER', 'NEAREST'], ['TEXTURE_MIN_FILTER', 'NEAREST'], ['TEXTURE_WRAP_S', 'CLAMP_TO_EDGE'], ['TEXTURE_WRAP_T', 'CLAMP_TO_EDGE']]
        }, {
          id: 'ping',
          pixelStore: [['UNPACK_FLIP_Y_WEBGL', true]],
          texParameter: [['TEXTURE_MAG_FILTER', 'NEAREST'], ['TEXTURE_MIN_FILTER', 'NEAREST'], ['TEXTURE_WRAP_S', 'CLAMP_TO_EDGE'], ['TEXTURE_WRAP_T', 'CLAMP_TO_EDGE']]
        }, {
          id: 'pong',
          pixelStore: [['UNPACK_FLIP_Y_WEBGL', true]],
          texParameter: [['TEXTURE_MAG_FILTER', 'NEAREST'], ['TEXTURE_MIN_FILTER', 'NEAREST'], ['TEXTURE_WRAP_S', 'CLAMP_TO_EDGE'], ['TEXTURE_WRAP_T', 'CLAMP_TO_EDGE']]
        }],
        framebuffers: [{
          id: 'ping',
          width: this.width,
          height: this.height
        }, {
          id: 'pong',
          width: this.width,
          height: this.height
        }]
      },
      mappings: {
        default: [{
          id: 'posCoord',
          name: 'positionLocation',
          attribute: 'a_position',
          format: [2, this.gl.FLOAT, false, 0, 0]
        }, {
          id: 'texCoord',
          name: 'texCoordLocation',
          attribute: 'a_texCoord',
          format: [2, this.gl.FLOAT, false, 0, 0]
        }]
      }
    };

    this.glResources = _WebGl2.default.createGLResources(this.gl, this.glConfig);

    this.pingPong = new _PingPong2.default(this.gl, [this.glResources.framebuffers.ping, this.glResources.framebuffers.pong], [this.glResources.textures.ping, this.glResources.textures.pong]);
  }

  // ------------------------------------------------------------------------

  _createClass(BinaryCompositor, [{
    key: 'extractLayerData',
    value: function extractLayerData(buffer, pixelOffset) {
      var px = 0,
          py = pixelOffset,
          offset = (py * this.width + px) * 4,
          length = this.width * this.height * 4;

      return new Uint8Array(buffer, offset, length);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateQuery',
    value: function updateQuery(query) {
      var layers = this.queryDataModel.originalData.CompositePipeline.layers,
          count = layers.length,
          offsets = this.queryDataModel.originalData.CompositePipeline.offset;

      this.offsetList = [];
      for (var idx = 0; idx < count; idx++) {
        var fieldCode = query[idx * 2 + 1];
        if (fieldCode !== '_') {
          this.offsetList.push(this.spriteSize - offsets[layers[idx] + fieldCode]);
        }
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.rgbdData) {
        return;
      }

      // Compute composite
      this.pingPong.clearFbo();
      this.offsetList.forEach(function (layerIdx) {
        _this2.drawCompositePass(_this2.extractLayerData(_this2.rgbdData, layerIdx * _this2.height));
      });

      // Draw to display
      this.drawDisplayPass();

      var readyImage = {
        canvas: this.glCanvas.el,
        area: [0, 0, this.width, this.height],
        outputSize: [this.width, this.height],
        builder: this.imageBuilder
      };

      this.imageBuilder.imageReady(readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      this.glCanvas.destroy();
      this.glCanvas = null;

      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;

      this.glResources.destroy();
      this.glResources = null;

      this.pingPong = null;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'drawDisplayPass',
    value: function drawDisplayPass() {
      // Draw to the screen framebuffer
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

      // Using the display shader program
      this.gl.useProgram(this.glResources.programs.displayProgram);

      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.viewport(0, 0, this.width, this.height);

      // Set up the sampler uniform and bind the rendered texture
      var uImage = this.gl.getUniformLocation(this.glResources.programs.displayProgram, 'u_image');
      this.gl.uniform1i(uImage, 0);
      this.gl.activeTexture(this.gl.TEXTURE0 + 0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.pingPong.getRenderingTexture());

      // Draw the rectangle.
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

      this.gl.finish();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'drawCompositePass',
    value: function drawCompositePass(layerData) {
      // Draw to the fbo on this pass
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pingPong.getFramebuffer());

      // Using the compositing shader program
      this.gl.useProgram(this.glResources.programs.compositeProgram);

      // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.viewport(0, 0, this.width, this.height);

      // Set up the layer texture
      var layer = this.gl.getUniformLocation(this.glResources.programs.compositeProgram, 'layerSampler');
      this.gl.uniform1i(layer, 0);
      this.gl.activeTexture(this.gl.TEXTURE0 + 0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.texture2D);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, layerData);

      // Set up the sampler uniform and bind the rendered texture
      var composite = this.gl.getUniformLocation(this.glResources.programs.compositeProgram, 'compositeSampler');
      this.gl.uniform1i(composite, 1);
      this.gl.activeTexture(this.gl.TEXTURE0 + 1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.pingPong.getRenderingTexture());

      // Draw the rectangle.
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

      this.gl.finish();

      // Ping-pong
      this.pingPong.swap();
    }
  }]);

  return BinaryCompositor;
}();

exports.default = BinaryCompositor;