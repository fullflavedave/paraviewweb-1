'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

var _max = require('mout/object/max');

var _max2 = _interopRequireDefault(_max);

var _merge = require('mout/src/object/merge');

var _merge2 = _interopRequireDefault(_merge);

var _vec = require('gl-matrix/src/gl-matrix/vec3.js');

var _vec2 = _interopRequireDefault(_vec);

var _vec3 = require('gl-matrix/src/gl-matrix/vec4.js');

var _vec4 = _interopRequireDefault(_vec3);

var _WebGl = require('../../../Common/Misc/WebGl');

var _WebGl2 = _interopRequireDefault(_WebGl);

var _PingPong = require('../../../Common/Misc/PingPong');

var _PingPong2 = _interopRequireDefault(_PingPong);

var _basic = require('../../../Common/Misc/WebGl/shaders/vertex/basic.c');

var _basic2 = _interopRequireDefault(_basic);

var _display = require('./shaders/fragment/display.c');

var _display2 = _interopRequireDefault(_display);

var _compositeLight = require('./shaders/fragment/compositeLight.c');

var _compositeLight2 = _interopRequireDefault(_compositeLight);

var _compositeLut = require('./shaders/fragment/compositeLut.c');

var _compositeLut2 = _interopRequireDefault(_compositeLut);

var _background = require('./shaders/fragment/background.c');

var _background2 = _interopRequireDefault(_background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var texParameter = [['TEXTURE_MAG_FILTER', 'NEAREST'], ['TEXTURE_MIN_FILTER', 'NEAREST'], ['TEXTURE_WRAP_S', 'CLAMP_TO_EDGE'], ['TEXTURE_WRAP_T', 'CLAMP_TO_EDGE']],
    pixelStore = [['UNPACK_FLIP_Y_WEBGL', true]];

// --------------------------------------------------------------------------

function spherical2Cartesian(phi, theta) {
  var nPhi = parseFloat(phi),
      nTheta = parseFloat(theta),
      phiRad = (180.0 - nPhi) * Math.PI / 180.0,
      thetaRad = (180.0 - nTheta) * Math.PI / 180.0;
  return [Math.sin(thetaRad) * Math.cos(phiRad), Math.sin(thetaRad) * Math.sin(phiRad), Math.cos(thetaRad)];
}

// --------------------------------------------------------------------------

function recomputeDirections(queryModel, relativeLightPosition) {
  // construct a coordinate system relative to eye point
  var v = spherical2Cartesian(queryModel.getValue('phi'), queryModel.getValue('theta')),
      viewDir = _vec2.default.fromValues(v[0], v[1], v[2]),
      at = _vec2.default.fromValues(0, 0, 0),
      // assumption always looking at 0
  north = _vec2.default.fromValues(0, 0, 1),
      // assumption, north is always up
  approxUp = _vec2.default.create();
  _vec2.default.add(approxUp, north, viewDir);
  _vec2.default.normalize(approxUp, approxUp);

  var t0 = _vec2.default.create();
  _vec2.default.subtract(t0, at, viewDir);
  var t1 = _vec2.default.create();
  _vec2.default.subtract(t1, approxUp, viewDir);
  var right = _vec2.default.create();
  _vec2.default.cross(right, t0, t1);
  _vec2.default.normalize(right, right);
  _vec2.default.subtract(t0, right, viewDir);
  _vec2.default.subtract(t1, at, viewDir);
  var up = _vec2.default.create();
  _vec2.default.cross(up, t0, t1);
  _vec2.default.normalize(up, up);
  // scale down so we can alway have room before normalization
  var rm = _vec2.default.create();
  _vec2.default.scale(rm, right, relativeLightPosition.x);
  var um = _vec2.default.create();
  _vec2.default.scale(um, up, relativeLightPosition.y);
  var scaledView = _vec2.default.create();
  _vec2.default.scale(scaledView, viewDir, 0.3);
  var lightDirection = _vec2.default.create();
  _vec2.default.add(lightDirection, scaledView, rm);
  _vec2.default.add(lightDirection, lightDirection, um);
  _vec2.default.normalize(lightDirection, lightDirection);
  return {
    lightDir: lightDirection,
    viewDir: viewDir
  };
}

// --------------------------------------------------------------------------

var SXYZLightCompositor = function () {

  // ------------------------------------------------------------------------

  function SXYZLightCompositor(_ref) {
    var _this = this;

    var queryDataModel = _ref.queryDataModel;
    var imageBuilder = _ref.imageBuilder;
    var lookupTableManager = _ref.lookupTableManager;

    _classCallCheck(this, SXYZLightCompositor);

    this.queryDataModel = queryDataModel;
    this.imageBuilder = imageBuilder;
    this.lookupTableManager = lookupTableManager;
    this.compositePipeline = this.queryDataModel.originalData.CompositePipeline;
    this.width = this.compositePipeline.dimensions[0];
    this.height = this.compositePipeline.dimensions[1];
    this.spriteSize = (0, _max2.default)(this.compositePipeline.offset);
    this.offsetList = [];
    this.sxyzSprite = null;
    this.removeLoadCallback = false;
    this.closureRenderMethod = function () {
      _this.render();
    };
    this.doLighting = true;
    this.dataSubscription = queryDataModel.onDataChange(function (data, envelope) {
      _this.sxyzSprite = data.sxyzSprite.image;
      if (_this.sxyzSprite.complete) {
        _this.render();
      } else {
        _this.removeLoadCallback = true;
        _this.sxyzSprite.addEventListener('load', _this.closureRenderMethod);
      }
    });
    this.lookupTableManager.addFields(this.compositePipeline.ranges, this.queryDataModel.originalData.LookupTables);
    this.numLutSamples = 1024;
    this.lutMap = {};

    Object.keys(this.compositePipeline.ranges).forEach(function (key) {
      _this.lutMap[key] = new Uint8Array(_this.numLutSamples * 4);
      _this.resampleLookupTable(key);
    });
    this.lookupTableManager.onChange(function (data, envelope) {
      if (data.lut.name !== '__internal') {
        _this.resampleLookupTable(data.lut.name);
      }
    });
    this.bgColor = [1.0, 1.0, 1.0];
    this.lightingTextureNames = ['nx', 'ny', 'nz', 'scalars'];
    this.lightingTextures = {};
    this.lightProperties = {
      lightTerms: {
        ka: 0.1,
        kd: 0.6,
        ks: 0.3,
        alpha: 20
      },
      lightPosition: {
        x: -1,
        y: 1
      },
      lightColor: [0.8, 0.8, 0.8]
    };
    // Canvas
    this.glCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.compositeCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.compositeCtx = this.compositeCanvas.get2DContext();
    this.scalarCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.scalarCtx = this.scalarCanvas.get2DContext();
    this.nxCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.nxCtx = this.nxCanvas.get2DContext();
    this.nyCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.nyCtx = this.nyCanvas.get2DContext();
    this.nzCanvas = new _CanvasOffscreenBuffer2.default(this.width, this.height);
    this.nzCtx = this.nzCanvas.get2DContext();
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
        compositeLightProgram: {
          vertexShader: _basic2.default,
          fragmentShader: _compositeLight2.default,
          mapping: 'default'
        },
        compositeLutProgram: {
          vertexShader: _basic2.default,
          fragmentShader: _compositeLut2.default,
          mapping: 'default'
        },
        backgroundProgram: {
          vertexShader: _basic2.default,
          fragmentShader: _background2.default,
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
          id: 'scalars',
          pixelStore: pixelStore,
          texParameter: texParameter
        }, {
          id: 'nx',
          pixelStore: pixelStore,
          texParameter: texParameter
        }, {
          id: 'ny',
          pixelStore: pixelStore,
          texParameter: texParameter
        }, {
          id: 'nz',
          pixelStore: pixelStore,
          texParameter: texParameter
        }, {
          id: 'lutTexture',
          pixelStore: pixelStore,
          texParameter: texParameter
        }, {
          id: 'ping',
          pixelStore: pixelStore,
          texParameter: texParameter
        }, {
          id: 'pong',
          pixelStore: pixelStore,
          texParameter: texParameter
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

  _createClass(SXYZLightCompositor, [{
    key: 'resampleLookupTable',
    value: function resampleLookupTable(fieldName) {
      var lookupTable = this.lookupTableManager.getLookupTable(fieldName),
          fieldRange = this.compositePipeline.ranges[fieldName],
          delta = (fieldRange[1] - fieldRange[0]) / this.numLutSamples,

      // lutRange = lookupTable.getScalarRange(),
      samples = this.lutMap[fieldName];
      for (var i = 0; i < this.numLutSamples; ++i) {
        var scalarValue = fieldRange[0] + i * delta,
            colorArrayIdx = i * 4,
            scalarColor = lookupTable.getColor(scalarValue);
        samples[colorArrayIdx] = Math.round(scalarColor[0] * 255);
        samples[colorArrayIdx + 1] = Math.round(scalarColor[1] * 255);
        samples[colorArrayIdx + 2] = Math.round(scalarColor[2] * 255);
        samples[colorArrayIdx + 3] = 1.0;
      }
      this.render();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateQuery',
    value: function updateQuery(query) {
      var layers = this.compositePipeline.layers,
          count = layers.length,
          offsets = this.compositePipeline.offset,
          fieldDependencies = this.compositePipeline.color_by_dependencies;
      this.offsetList = [];
      for (var idx = 0; idx < count; idx++) {
        var fieldCode = query[idx * 2 + 1];
        if (fieldCode !== '_') {
          if (fieldDependencies[fieldCode]) {
            var depends = fieldDependencies[fieldCode];
            if (depends.normal) {
              var nx = depends.normal[0],
                  ny = depends.normal[1],
                  nz = depends.normal[2];
              this.offsetList.push({
                fieldName: this.compositePipeline.fields[fieldCode],
                scalar: this.spriteSize - offsets[layers[idx] + fieldCode],
                nx: this.spriteSize - offsets[layers[idx] + nx],
                ny: this.spriteSize - offsets[layers[idx] + ny],
                nz: this.spriteSize - offsets[layers[idx] + nz]
              });
            }
          }
        }
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      if (!this.sxyzSprite || !this.sxyzSprite.complete) {
        console.log('Not enough data to render');
        return;
      }

      // Handle image decoding
      if (this.removeLoadCallback) {
        this.sxyzSprite.removeEventListener('load', this.closureRenderMethod);
        this.removeLoadCallback = false;
      }
      this.pingPong.clearFbo();

      var _recomputeDirections = recomputeDirections(this.queryDataModel, this.lightProperties.lightPosition);

      var lightDir = _recomputeDirections.lightDir;
      var viewDir = _recomputeDirections.viewDir;
      var imgw = this.width;
      var imgh = this.height;
      var srcX = 0;

      var srcY = 0;

      // Draw a background pass
      this.compositeCtx.clearRect(0, 0, imgw, imgh);
      this.compositeCtx.drawImage(this.sxyzSprite, 0, this.spriteSize * imgh, imgw, imgh, 0, 0, imgw, imgh);
      this.drawBackgroundPass(this.bgColor);
      for (var i = 0, size = this.offsetList.length; i < size; i += 1) {
        var lOffMap = this.offsetList[i],
            field = lOffMap.fieldName;
        srcY = 0;
        if (this.doLighting) {
          // Copy the nx buffer
          srcY = lOffMap.nx * imgh;
          this.nxCtx.clearRect(0, 0, imgw, imgh);
          this.nxCtx.drawImage(this.sxyzSprite, srcX, srcY, imgw, imgh, 0, 0, imgw, imgh);
          // Copy the ny buffer
          srcY = lOffMap.ny * imgh;
          this.nyCtx.clearRect(0, 0, imgw, imgh);
          this.nyCtx.drawImage(this.sxyzSprite, srcX, srcY, imgw, imgh, 0, 0, imgw, imgh);
          // Copy the nz buffer
          srcY = lOffMap.nz * imgh;
          this.nzCtx.clearRect(0, 0, imgw, imgh);
          this.nzCtx.drawImage(this.sxyzSprite, srcX, srcY, imgw, imgh, 0, 0, imgw, imgh);
          // Copy the scalar buffer
          srcY = lOffMap.scalar * imgh;
          this.scalarCtx.clearRect(0, 0, imgw, imgh);
          this.scalarCtx.drawImage(this.sxyzSprite, srcX, srcY, imgw, imgh, 0, 0, imgw, imgh);
          this.drawLitCompositePass(viewDir, lightDir, this.lightProperties, this.lutMap[field]);
        } else {
          // Copy the scalar buffer
          srcY = lOffMap.scalar * imgh;
          this.scalarCtx.clearRect(0, 0, imgw, imgh);
          this.scalarCtx.drawImage(this.sxyzSprite, srcX, srcY, imgw, imgh, 0, 0, imgw, imgh);
          this.drawLutCompositePass(this.lutMap[field]);
        }
      }
      this.drawDisplayPass();
      var readyImage = {
        canvas: this.glCanvas.el,
        area: [0, 0, this.width, this.height],
        outputSize: [this.width, this.height],
        builder: this.imageBuilder
      };

      // Let everyone know the image is ready
      this.imageBuilder.imageReady(readyImage);
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
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'drawBackgroundPass',
    value: function drawBackgroundPass(backgroundColor) {
      // Draw to the fbo on this pass
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pingPong.getFramebuffer());

      // Using the background shader program
      this.gl.useProgram(this.glResources.programs.backgroundProgram);

      // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.gl.viewport(0, 0, this.width, this.height);
      var bgColor = _vec4.default.fromValues(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
      var bgc = this.gl.getUniformLocation(this.glResources.programs.backgroundProgram, 'backgroundColor');
      this.gl.uniform4fv(bgc, bgColor);

      // Set up the layer texture
      var layer = this.gl.getUniformLocation(this.glResources.programs.backgroundProgram, 'backgroundSampler');
      this.gl.uniform1i(layer, 0);
      this.gl.activeTexture(this.gl.TEXTURE0 + 0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.pingPong.getRenderingTexture());
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.compositeCanvas.el);

      // Draw the rectangle.
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      this.gl.finish();

      // Ping-pong
      this.pingPong.swap();

      // Now unbind the textures we used
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'drawLitCompositePass',
    value: function drawLitCompositePass(viewDir, lightDir, lightProperties, lutData) {
      var lightTerms = lightProperties.lightTerms;
      var lightColor = lightProperties.lightColor;

      // Draw to the fbo on this pass

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pingPong.getFramebuffer());

      // Using the lighting compositing shader program
      this.gl.useProgram(this.glResources.programs.compositeLightProgram);
      this.gl.viewport(0, 0, this.width, this.height);
      var viewDirection = _vec4.default.fromValues(viewDir[0], viewDir[1], viewDir[2], 0.0);
      var vdir = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'viewDir');
      this.gl.uniform4fv(vdir, viewDirection);
      var lightDirection = _vec4.default.fromValues(lightDir[0], lightDir[1], lightDir[2], 0.0);
      var ldir = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'lightDir');
      this.gl.uniform4fv(ldir, lightDirection);
      var lightingConstants = _vec4.default.fromValues(lightTerms.ka, lightTerms.kd, lightTerms.ks, lightTerms.alpha);
      var lterms = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'lightTerms');
      this.gl.uniform4fv(lterms, lightingConstants);
      var lightCol = _vec4.default.fromValues(lightColor[0], lightColor[1], lightColor[2], 1.0);
      var lcolor = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'lightColor');
      this.gl.uniform4fv(lcolor, lightCol);

      // Set up the scalar texture
      var scalar = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'scalarSampler');
      this.gl.uniform1i(scalar, 0);
      this.gl.activeTexture(this.gl.TEXTURE0 + 0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.scalars);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.scalarCanvas.el);

      // Set up the normals (x component) texture
      var nx = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'nxSampler');
      this.gl.uniform1i(nx, 1);
      this.gl.activeTexture(this.gl.TEXTURE0 + 1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.nx);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.nxCanvas.el);

      // Set up the normals (y component) texture
      var ny = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'nySampler');
      this.gl.uniform1i(ny, 2);
      this.gl.activeTexture(this.gl.TEXTURE0 + 2);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.ny);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.nyCanvas.el);

      // Set up the normals (z component) texture
      var nz = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'nzSampler');
      this.gl.uniform1i(nz, 3);
      this.gl.activeTexture(this.gl.TEXTURE0 + 3);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.nz);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.nzCanvas.el);

      // Set up the sampler uniform and bind the rendered texture
      var composite = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'compositeSampler');
      this.gl.uniform1i(composite, 4);
      this.gl.activeTexture(this.gl.TEXTURE0 + 4);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.pingPong.getRenderingTexture());

      // Set up the lookup table texture
      var lut = this.gl.getUniformLocation(this.glResources.programs.compositeLightProgram, 'lutSampler');
      this.gl.uniform1i(lut, 5);
      this.gl.activeTexture(this.gl.TEXTURE0 + 5);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.lutTexture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.numLutSamples, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, lutData);

      // Draw the rectangle.
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      this.gl.finish();

      // Ping-pong
      this.pingPong.swap();

      // Now unbind the textures we used
      for (var i = 0; i < 6; i += 1) {
        this.gl.activeTexture(this.gl.TEXTURE0 + i);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'drawLutCompositePass',
    value: function drawLutCompositePass(lutData) {
      // Draw to the fbo on this pass
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pingPong.getFramebuffer());

      // Using the lighting compositing shader program
      this.gl.useProgram(this.glResources.programs.compositeLutProgram);
      this.gl.viewport(0, 0, this.width, this.height);

      // Set up the scalar texture
      var scalar = this.gl.getUniformLocation(this.glResources.programs.compositeLutProgram, 'scalarSampler');
      this.gl.uniform1i(scalar, 0);
      this.gl.activeTexture(this.gl.TEXTURE0 + 0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.scalars);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.scalarCanvas.el);

      // Set up the sampler uniform and bind the rendered texture
      var composite = this.gl.getUniformLocation(this.glResources.programs.compositeLutProgram, 'compositeSampler');
      this.gl.uniform1i(composite, 1);
      this.gl.activeTexture(this.gl.TEXTURE0 + 1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.pingPong.getRenderingTexture());

      // Set up the lookup table texture
      var lut = this.gl.getUniformLocation(this.glResources.programs.compositeLutProgram, 'lutSampler');
      this.gl.uniform1i(lut, 2);
      this.gl.activeTexture(this.gl.TEXTURE0 + 2);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.glResources.textures.lutTexture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.numLutSamples, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, lutData);

      // Draw the rectangle.
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      this.gl.finish();

      // Ping-pong
      this.pingPong.swap();

      // Now unbind the textures we used
      for (var i = 0; i < 3; i += 1) {
        this.gl.activeTexture(this.gl.TEXTURE0 + i);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      return [{
        name: 'LookupTableManagerWidget',
        lookupTableManager: this.lookupTableManager
      }, {
        name: 'LightPropertiesWidget',
        light: this
      }, {
        name: 'CompositeControl',
        pipelineModel: this.imageBuilder.pipelineModel
      }, {
        name: 'QueryDataModelWidget',
        queryDataModel: this.queryDataModel
      }];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getLightingEnabled',
    value: function getLightingEnabled() {
      return this.doLighting;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLightingEnabled',
    value: function setLightingEnabled(lightingEnabled) {
      this.doLighting = lightingEnabled;
      this.render();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getLightProperties',
    value: function getLightProperties() {
      return this.lightProperties;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setLightProperties',
    value: function setLightProperties(lightProps) {
      this.lightProperties = (0, _merge2.default)(this.lightProperties, lightProps);
      this.render();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlModels',
    value: function getControlModels() {
      return {
        lookupTableManager: this.lookupTableManager,
        light: this,
        pipelineModel: this.imageBuilder.pipelineModel,
        queryDataModel: this.queryDataModel,
        dimensions: [this.width, this.height]
      };
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;
      this.glResources.destroy();
      this.glResources = null;
      this.pingPong = null;
    }
  }]);

  return SXYZLightCompositor;
}();

exports.default = SXYZLightCompositor;