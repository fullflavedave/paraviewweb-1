'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _max = require('mout/object/max');

var _max2 = _interopRequireDefault(_max);

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

var _CanvasOffscreenBuffer = require('../../../Common/Misc/CanvasOffscreenBuffer');

var _CanvasOffscreenBuffer2 = _interopRequireDefault(_CanvasOffscreenBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompositeImageBuilder = function (_AbstractImageBuilder) {
  _inherits(CompositeImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function CompositeImageBuilder(queryDataModel, pipelineModel) {
    _classCallCheck(this, CompositeImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompositeImageBuilder).call(this, { queryDataModel: queryDataModel, pipelineModel: pipelineModel, handleRecord: true, dimensions: queryDataModel.originalData.CompositePipeline.dimensions }));

    _this.metadata = queryDataModel.originalData.CompositePipeline;
    _this.compositeMap = {};
    _this.offsetMap = {};
    _this.spriteSize = (0, _max2.default)(_this.metadata.offset);
    _this.query = null;
    _this.composite = null;

    _this.bgCanvas = new _CanvasOffscreenBuffer2.default(_this.metadata.dimensions[0], _this.metadata.dimensions[1]);
    _this.registerObjectToFree(_this.bgCanvas);

    _this.fgCanvas = null;

    _this.registerSubscription(queryDataModel.onDataChange(function (data, envelope) {
      _this.sprite = data.sprite;
      _this.composite = data.composite.data['pixel-order'].split('+');
      _this.updateCompositeMap(_this.query, _this.composite);
      _this.render();
    }));

    _this.registerSubscription(_this.pipelineModel.onChange(function (data, envelope) {
      _this.setPipelineQuery(data);
    }));

    _this.setPipelineQuery(_this.pipelineModel.getPipelineQuery());
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(CompositeImageBuilder, [{
    key: 'updateOffsetMap',
    value: function updateOffsetMap(query) {
      var layers = this.metadata.layers,
          count = layers.length,
          offsets = this.metadata.offset;

      this.offsetMap = {};
      this.compositeMap = {};
      for (var idx = 0; idx < count; idx++) {
        var fieldCode = query[idx * 2 + 1];
        if (fieldCode === '_') {
          this.offsetMap[layers[idx]] = -1;
        } else {
          this.offsetMap[layers[idx]] = this.spriteSize - offsets[layers[idx] + fieldCode];
        }
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'updateCompositeMap',
    value: function updateCompositeMap(query, composite) {
      if (query === null || composite === null) {
        return;
      }
      var compositeArray = composite,
          map = this.compositeMap;

      var count = compositeArray.length;
      while (count) {
        count -= 1;
        var key = compositeArray[count];
        if (key[0] === '@') {
          // Skip pixels
        } else if ({}.hasOwnProperty.call(map, key)) {
            // Already computed
          } else {
              var offset = -1;
              for (var i = 0, size = key.length; i < size; i++) {
                offset = this.offsetMap[key[i]];
                if (offset !== -1) {
                  i = size;
                }
              }
              map[key] = offset;
            }
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'pushToFrontAsImage',
    value: function pushToFrontAsImage(width, height) {
      var ctx = null;

      // Make sure we have a foreground buffer
      if (this.fgCanvas) {
        this.fgCanvas.size(width, height);
      } else {
        this.fgCanvas = new _CanvasOffscreenBuffer2.default(width, height);
        this.registerObjectToFree(this.fgCanvas);
      }

      ctx = this.fgCanvas.get2DContext();
      ctx.drawImage(this.bgCanvas.el, 0, 0, width, height, 0, 0, width, height);

      var readyImage = {
        url: this.fgCanvas.toDataURL(),
        builder: this
      };

      // Let everyone know the image is ready
      this.imageReady(readyImage);
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'pushToFrontAsBuffer',
    value: function pushToFrontAsBuffer(width, height) {
      var readyImage = {
        canvas: this.bgCanvas.el,
        imageData: this.bgCanvas.el.getContext('2d').getImageData(0, 0, width, height),
        area: [0, 0, width, height],
        outputSize: [width, height],
        builder: this,
        arguments: this.queryDataModel.getQuery()
      };

      // Add pipeline info + ts
      readyImage.arguments.pipeline = this.query;

      // Let everyone know the image is ready
      this.imageReady(readyImage);

      // In case of exploration trigger next data fetch
      this.queryDataModel.nextExploration();
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'setPipelineQuery',
    value: function setPipelineQuery(query) {
      if (this.query !== query) {
        this.query = query;
        this.updateOffsetMap(query);
        this.updateCompositeMap(query, this.composite);
        this.render();
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.sprite) {
        this.queryDataModel.fetchData();
        return;
      }
      if (this.query === null) {
        return;
      }

      var ctx = this.bgCanvas.get2DContext(),
          dimensions = this.metadata.dimensions,
          compositeArray = this.composite,
          count = compositeArray.length,
          modulo = dimensions[0];

      var offset = 1,
          x = 0,
          y = 0;

      function addToX(delta) {
        x += delta;
        y += Math.floor(x / modulo);
        x %= modulo;
      }

      if (this.sprite.image.complete) {
        // Free callback if any
        if (this.sprite.image.onload) {
          this.sprite.image.onload = null;
        }

        ctx.clearRect(0, 0, dimensions[0], dimensions[1]);
        for (var idx = 0; idx < count; idx++) {
          var key = compositeArray[idx];
          if (key[0] === '@') {
            // Shift (x,y)
            addToX(Number(key.replace(/@/, '+')));
          } else {
            offset = this.compositeMap[key];
            if (offset !== -1) {
              ctx.drawImage(this.sprite.image, x, y + dimensions[1] * offset, 1, 1, x, y, 1, 1);
            }
            addToX(1);
          }
        }

        this.pushToFrontAsBuffer(dimensions[0], dimensions[1]);
      } else {
        this.sprite.image.onload = function () {
          _this2.render();
        };
      }
    }

    // ------------------------------------------------------------------------

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(CompositeImageBuilder.prototype), 'destroy', this).call(this);

      this.bgCanvas = null;
      this.fgCanvas = null;
      this.compositeMap = null;
      this.offsetMap = null;
    }
  }]);

  return CompositeImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = CompositeImageBuilder;