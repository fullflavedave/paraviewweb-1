define(['exports', '../AbstractImageBuilder', './CompositorFactory'], function (exports, _AbstractImageBuilder2, _CompositorFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

  var _CompositorFactory2 = _interopRequireDefault(_CompositorFactory);

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

  var DepthCompositeImageBuilder = function (_AbstractImageBuilder) {
    _inherits(DepthCompositeImageBuilder, _AbstractImageBuilder);

    // ------------------------------------------------------------------------

    function DepthCompositeImageBuilder(queryDataModel, pipelineModel, lookupTableManager) {
      _classCallCheck(this, DepthCompositeImageBuilder);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DepthCompositeImageBuilder).call(this, { queryDataModel: queryDataModel, pipelineModel: pipelineModel, dimensions: queryDataModel.originalData.CompositePipeline.dimensions }));

      _this.compositor = _CompositorFactory2.default.createCompositor(queryDataModel.originalData.type, {
        queryDataModel: queryDataModel, lookupTableManager: lookupTableManager, imageBuilder: _this
      });
      _this.registerObjectToFree(_this.compositor);

      _this.query = null;
      _this.setPipelineQuery(_this.pipelineModel.getPipelineQuery());

      _this.registerSubscription(_this.pipelineModel.onChange(function (data, envelope) {
        _this.setPipelineQuery(data);
      }));
      return _this;
    }

    // ------------------------------------------------------------------------
    // Update the composite pipeline query
    // Sample query: "BACADAGBHBIB" means color layers B, C, and D by field A,
    // color layers G, H, and I by field B

    _createClass(DepthCompositeImageBuilder, [{
      key: 'setPipelineQuery',
      value: function setPipelineQuery(query) {
        if (this.query !== query) {
          this.query = query;
          this.compositor.updateQuery(query);
          this.render();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.query) {
          this.compositor.render();
        }
      }
    }, {
      key: 'getControlWidgets',
      value: function getControlWidgets() {
        if (this.compositor.getControlWidgets) {
          return this.compositor.getControlWidgets();
        }

        return _get(Object.getPrototypeOf(DepthCompositeImageBuilder.prototype), 'getControlWidgets', this).call(this);
      }
    }, {
      key: 'getControlModels',
      value: function getControlModels() {
        if (this.compositor.getControlModels) {
          return this.compositor.getControlModels();
        }

        return _get(Object.getPrototypeOf(DepthCompositeImageBuilder.prototype), 'getControlModels', this).call(this);
      }
    }]);

    return DepthCompositeImageBuilder;
  }(_AbstractImageBuilder3.default);

  exports.default = DepthCompositeImageBuilder;
});