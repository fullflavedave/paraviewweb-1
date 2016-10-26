define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  // Show GL informations
  function showGlInfo(gl) {
    var vertexUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    var fragmentUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    var combinedUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    console.log('vertex texture image units:', vertexUnits);
    console.log('fragment texture image units:', fragmentUnits);
    console.log('combined texture image units:', combinedUnits);
  }

  // Compile a shader
  function compileShader(gl, src, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, src);

    // Compile and check status
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // Something went wrong during compilation; get the error
      var lastError = gl.getShaderInfoLog(shader);
      console.error('Error compiling shader \'' + shader + '\': ' + lastError);
      gl.deleteShader(shader);

      return null;
    }

    return shader;
  }

  // Create a shader program
  function createShaderProgram(gl, shaders) {
    var program = gl.createProgram();

    for (var i = 0; i < shaders.length; i++) {
      gl.attachShader(program, shaders[i]);
    }

    gl.linkProgram(program);

    // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // something went wrong with the link
      var lastError = gl.getProgramInfoLog(program);
      console.error('Error in program linking:', lastError);
      gl.deleteProgram(program);

      return null;
    }

    program.shaders = shaders;
    gl.useProgram(program);

    return program;
  }

  // Apply new mapping to a program
  function applyProgramDataMapping(gl, programName, mappingName, glConfig, glResources) {
    var program = glResources.programs[programName];
    var mapping = glConfig.mappings[mappingName];

    mapping.forEach(function (bufferMapping) {
      var glBuffer = glResources.buffers[bufferMapping.id];

      gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
      program[bufferMapping.name] = gl.getAttribLocation(program, bufferMapping.attribute);
      gl.enableVertexAttribArray(program[bufferMapping.name]);
      gl.vertexAttribPointer.apply(gl, [program[bufferMapping.name]].concat(_toConsumableArray(bufferMapping.format)));
      // FIXME: Remove this check when Apple fixes this bug
      /* global navigator */
      if (navigator.userAgent.indexOf('AppleWebKit/602.1.50') === -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      }
    });
  }

  // Create a shader program
  function buildShaderProgram(gl, name, config, resources) {
    var progConfig = config.programs[name];
    var compiledVertexShader = compileShader(gl, progConfig.vertexShader, gl.VERTEX_SHADER);
    var compiledFragmentShader = compileShader(gl, progConfig.fragmentShader, gl.FRAGMENT_SHADER);
    var program = createShaderProgram(gl, [compiledVertexShader, compiledFragmentShader]);

    // Store the created program in the resources
    resources.programs[name] = program;

    // Handle mapping if any
    if (progConfig.mapping) {
      applyProgramDataMapping(gl, name, progConfig.mapping, config, resources);
    }

    // Return program
    return program;
  }

  // Bind texture to Framebuffer
  function bindTextureToFramebuffer(gl, fbo, texture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fbo.width, fbo.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Check fbo status
    var fbs = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (fbs !== gl.FRAMEBUFFER_COMPLETE) {
      console.log('ERROR: There is a problem with the framebuffer:', fbs);
    }

    // Clear the bindings we created in this function.
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // Free GL resources
  function freeGLResources(glResources) {
    var gl = glResources.gl;

    // Delete each program
    Object.keys(glResources.programs).forEach(function (programName) {
      var program = glResources.programs[programName];
      var shaders = program.shaders;

      var count = shaders.length;

      // Delete shaders
      while (count) {
        count -= 1;
        gl.deleteShader(shaders[count]);
      }

      // Delete program
      gl.deleteProgram(program);
    });

    // Delete framebuffers
    Object.keys(glResources.framebuffers).forEach(function (fbName) {
      gl.deleteFramebuffer(glResources.framebuffers[fbName]);
    });

    // Delete textures
    Object.keys(glResources.textures).forEach(function (textureName) {
      gl.deleteTexture(glResources.textures[textureName]);
    });

    // Delete buffers
    Object.keys(glResources.buffers).forEach(function (bufferName) {
      gl.deleteBuffer(glResources.buffers[bufferName]);
    });
  }

  // Create GL resources
  function createGLResources(gl, glConfig) {
    var resources = { gl: gl, buffers: {}, textures: {}, framebuffers: {}, programs: {} };
    var buffers = glConfig.resources.buffers || [];
    var textures = glConfig.resources.textures || [];
    var framebuffers = glConfig.resources.framebuffers || [];

    // Create Buffer
    buffers.forEach(function (buffer) {
      var glBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, buffer.data, gl.STATIC_DRAW);
      resources.buffers[buffer.id] = glBuffer;
    });

    // Create Texture
    textures.forEach(function (texture) {
      var glTexture = gl.createTexture();
      var pixelStore = texture.pixelStore || [];
      var texParameter = texture.texParameter || [];

      gl.bindTexture(gl.TEXTURE_2D, glTexture);

      pixelStore.forEach(function (option) {
        gl.pixelStorei(gl[option[0]], option[1]);
      });

      texParameter.forEach(function (option) {
        gl.texParameteri(gl.TEXTURE_2D, gl[option[0]], gl[option[1]]);
      });

      resources.textures[texture.id] = glTexture;
    });

    // Create Framebuffer
    framebuffers.forEach(function (framebuffer) {
      var glFramebuffer = gl.createFramebuffer();
      glFramebuffer.width = framebuffer.width;
      glFramebuffer.height = framebuffer.height;

      resources.framebuffers[framebuffer.id] = glFramebuffer;
    });

    // Create programs
    Object.keys(glConfig.programs).forEach(function (programName) {
      buildShaderProgram(gl, programName, glConfig, resources);
    });

    // Add destroy function
    resources.destroy = function () {
      freeGLResources(resources);
    };

    return resources;
  }

  //----------------------------------------------------------------------------

  function transformShader(shaderContent, variableDict, config) {
    var match = null;
    var unrolledContents = null;
    var shaderString = shaderContent;

    // First do all the variable replacements
    Object.keys(variableDict).forEach(function (vname) {
      var value = variableDict[vname];
      var r = new RegExp('\\$\\{' + vname + '\\}', 'g');
      shaderString = shaderString.replace(r, value);
    });

    // Now check if any loops need to be inlined
    if (config.inlineLoops) {
      var loopRegex = /\/\/@INLINE_LOOP([\s\S]+?)(?=\/\/@INLINE_LOOP)\/\/@INLINE_LOOP/;

      match = shaderString.match(loopRegex);
      while (match) {
        var capture = match[1],
            infoRegex = /^\s*\(([^\),]+)\s*,\s*([^\),]+)\s*,\s*([^\)]+)\)/,
            infoRegexMatch = capture.match(infoRegex),
            loopVariableName = infoRegexMatch[1],
            loopMin = infoRegexMatch[2],
            loopCount = infoRegexMatch[3],
            forLoop = capture.replace(infoRegex, ''),
            loopContentsRegex = /^\s*[^\{]+\{([\s\S]+?)\s*\}\s*$/,
            forLoopMatch = forLoop.match(loopContentsRegex),
            loopBody = forLoopMatch[1],
            loopBodyReplacer = new RegExp(loopVariableName, 'g');

        unrolledContents = '';
        for (var i = loopMin; i < loopCount; ++i) {
          unrolledContents += loopBody.replace(loopBodyReplacer, i);
          unrolledContents += '\n';
        }

        shaderString = shaderString.replace(loopRegex, unrolledContents);
        match = shaderString.match(loopRegex);
      }
    }

    if (config.debug) {
      console.log('Transformed shader string:');
      console.log(shaderString);
    }

    return shaderString;
  }

  //----------------------------------------------------------------------------

  exports.default = {
    applyProgramDataMapping: applyProgramDataMapping,
    bindTextureToFramebuffer: bindTextureToFramebuffer,
    createGLResources: createGLResources,
    showGlInfo: showGlInfo,
    transformShader: transformShader
  };
});