define(['exports', '../AbstractImageBuilder', '../../../Common/Misc/CanvasOffscreenBuffer'], function (exports, _AbstractImageBuilder2, _CanvasOffscreenBuffer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

  var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var DepthImageBuilder = function (_AbstractImageBuilder) {
    _inherits(DepthImageBuilder, _AbstractImageBuilder);

    // ------------------------------------------------------------------------

    function DepthImageBuilder(queryDataModel, dataName) {
      _classCallCheck(this, DepthImageBuilder);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DepthImageBuilder).call(this, {
        queryDataModel: queryDataModel, dimensions: queryDataModel.getDataMetaData(dataName).dimensions
      }));

      _this.dataName = dataName;
      _this.depthArray = null;
      _this.dimensions = queryDataModel.getDataMetaData(dataName).dimensions;

      _this.bgCanvas = new _CanvasOffscreenBuffer2.default(_this.dimensions[0], _this.dimensions[1]);
      _this.registerObjectToFree(_this.bgCanvas);

      _this.registerSubscription(queryDataModel.onDataChange(function (data, envelope) {
        _this.depthArray = new Uint8Array(data[_this.dataName].data);
        _this.render();
      }));
      return _this;
    }

    // ------------------------------------------------------------------------

    _createClass(DepthImageBuilder, [{
      key: 'render',
      value: function render() {
        if (!this.depthArray) {
          this.update();
          return;
        }

        var ctx = this.bgCanvas.get2DContext(),
            width = this.dimensions[0],
            height = this.dimensions[1],
            imageData = this.bgCanvas.el.getContext('2d').getImageData(0, 0, width, height),
            pixels = imageData.data,
            size = width * height;

        // Fill bgCanvas with depth
        for (var i = 0; i < size; i++) {
          var value = this.depthArray[i];
          pixels[i * 4 + 0] = value;
          pixels[i * 4 + 1] = value;
          pixels[i * 4 + 2] = value;
          pixels[i * 4 + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);

        var readyImage = {
          canvas: this.bgCanvas.el,
          area: [0, 0, width, height],
          outputSize: [width, height],
          builder: this
        };

        // Let everyone know the image is ready
        this.imageReady(readyImage);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        _get(Object.getPrototypeOf(DepthImageBuilder.prototype), 'destroy', this).call(this);

        this.bgCanvas = null;
        this.dataName = null;
        this.depthArray = null;
        this.dimensions = null;
      }
    }]);

    return DepthImageBuilder;
  }(_AbstractImageBuilder3.default);

  exports.default = DepthImageBuilder;
});