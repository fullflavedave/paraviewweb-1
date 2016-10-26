'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PixelOperatorImageBuilder = function (_AbstractImageBuilder) {
  _inherits(PixelOperatorImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function PixelOperatorImageBuilder() {
    var operation = arguments.length <= 0 || arguments[0] === undefined ? 'a-b' : arguments[0];
    var dependency = arguments.length <= 1 || arguments[1] === undefined ? ['a', 'b'] : arguments[1];

    _classCallCheck(this, PixelOperatorImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PixelOperatorImageBuilder).call(this, {}));

    _this.data = {};
    _this.listeners = {};
    _this.dataSize = [200, 200];
    _this.operation = operation;
    _this.dependency = dependency;
    _this.bgCanvas = new _CanvasOffscreenBuffer2.default(_this.dataSize[0], _this.dataSize[1]);

    _this.registerObjectToFree(_this.bgCanvas);
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(PixelOperatorImageBuilder, [{
    key: 'setOperation',
    value: function setOperation(expression) {
      this.operation = expression;
      this.processData();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setDependencies',
    value: function setDependencies(dependencyList) {
      this.dependency = dependencyList;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getOperation',
    value: function getOperation() {
      return this.operation;
    }

    // ------------------------------------------------------------------------

    /* eslint-disable no-new-func */

  }, {
    key: 'updateOperationFunction',
    value: function updateOperationFunction() {
      var _this2 = this;

      var isValid = true;
      var functionBody = [];

      Object.keys(this.data).forEach(function (key) {
        functionBody.push('var X = data.X[i];'.replace(/X/g, key));
      });
      this.dependency.forEach(function (dep) {
        isValid = _this2.data[dep] && isValid;
      });

      functionBody.push('return X;'.replace(/X/g, this.operation));
      this.fnOperation = new Function('data', 'i', functionBody.join(''));

      return isValid;
    }
    /* eslint-enable no-new-func */

    // ------------------------------------------------------------------------

  }, {
    key: 'updateData',
    value: function updateData(name, imageReadyEvent) {
      var _this3 = this;

      // Extract image data
      var area = imageReadyEvent.area,
          srcCanvas = imageReadyEvent.canvas,
          x = area[0],
          y = area[1],
          width = area[2],
          height = area[3],
          ctx = this.bgCanvas.get2DContext(),
          extractedData = new Uint8ClampedArray(width * height * 4),
          pixelBuffer = null;

      this.bgCanvas.size(width, height);
      ctx.drawImage(srcCanvas, x, y, width, height, 0, 0, width, height);
      pixelBuffer = ctx.getImageData(0, 0, width, height);
      extractedData.set(pixelBuffer.data);

      // Store the given array
      this.data[name] = extractedData;
      this.dataSize = [width, height];

      // Is dependency meet?
      var canProcess = true;
      this.dependency.forEach(function (depName) {
        if (!_this3.data[depName]) {
          canProcess = false;
        }
      });

      if (canProcess) {
        this.processData();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateDataFromImage',
    value: function updateDataFromImage(name, image) {
      var _this4 = this;

      var registerImage = function registerImage() {
        // Remove callback if any
        image.removeEventListener('load', registerImage);

        // Extract image data
        var width = image.width,
            height = image.height,
            ctx = _this4.bgCanvas.get2DContext(),
            extractedData = new Uint8ClampedArray(width * height * 4);

        _this4.bgCanvas.size(width, height);
        ctx.drawImage(image, 0, 0);
        var pixelBuffer = ctx.getImageData(0, 0, width, height);
        extractedData.set(pixelBuffer.data);

        // Store the given array
        _this4.data[name] = extractedData;
        _this4.dataSize = [width, height];

        // Is dependency meet?
        var canProcess = true;
        _this4.dependency.forEach(function (depName) {
          if (!_this4.data[depName]) {
            canProcess = false;
          }
        });

        if (canProcess) {
          _this4.processData();
        }
      };

      if (image.complete) {
        registerImage();
      } else {
        image.addEventListener('load', registerImage);
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateDataFromClampedArray',
    value: function updateDataFromClampedArray(name, array, size) {
      var _this5 = this;

      // Store the given array
      this.data[name] = array;
      this.dataSize = size || this.dataSize;

      // Is dependency meet?
      var canProcess = true;
      this.dependency.forEach(function (depName) {
        if (!_this5.data[depName]) {
          canProcess = false;
        }
      });

      if (canProcess) {
        this.processData();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'processData',
    value: function processData() {
      var _this6 = this;

      if (!this.updateOperationFunction()) {
        // We are not ready yet
        return;
      }

      // Validate Array sizes
      var size = -1;
      var sizeValid = true;

      Object.keys(this.data).forEach(function (key) {
        var array = _this6.data[key];
        if (size === -1) {
          size = array.length;
        } else {
          sizeValid = sizeValid && size === array.length;
        }
      });

      if (!sizeValid || size === -1) {
        console.log('The array size are invalid!!!', size);
        return;
      }

      if (this.dataSize[0] * this.dataSize[1] * 4 !== size) {
        console.log('The array size are invalid!!!', size, this.dataSize);
        return;
      }

      // Evaluate pixel operation
      var resultArray = new Uint8ClampedArray(size);
      var idx = 0;
      while (idx < size) {
        resultArray[idx] = this.fnOperation(this.data, idx);
        resultArray[idx + 1] = this.fnOperation(this.data, idx + 1);
        resultArray[idx + 2] = this.fnOperation(this.data, idx + 2);
        resultArray[idx + 3] = 255;

        idx += 4;
      }

      // Push data in canvas
      this.bgCanvas.size(this.dataSize[0], this.dataSize[1]);
      var ctx = this.bgCanvas.get2DContext(),
          pixelBuffer = ctx.getImageData(0, 0, this.dataSize[0], this.dataSize[1]);

      pixelBuffer.data.set(resultArray);
      ctx.putImageData(pixelBuffer, 0, 0);

      var readyImage = {
        canvas: this.bgCanvas.el,
        area: [0, 0].concat(this.dataSize),
        outputSize: this.dataSize,
        builder: this
      };

      // Let everyone know the image is ready
      this.imageReady(readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getListeners',
    value: function getListeners() {
      return this.listeners;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setListeners',
    value: function setListeners(l) {
      this.listeners = l;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(PixelOperatorImageBuilder.prototype), 'destroy', this).call(this);

      this.bgCanvas = null;
      this.data = null;
      this.dataSize = null;
      this.dependency = null;
      this.listeners = null;
      this.operation = null;
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlWidgets',
    value: function getControlWidgets() {
      return [{
        name: 'PixelOperatorControl',
        model: this
      }];
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'getControlModels',
    value: function getControlModels() {
      return {
        dimensions: this.dataSize
      };
    }
  }]);

  return PixelOperatorImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = PixelOperatorImageBuilder;