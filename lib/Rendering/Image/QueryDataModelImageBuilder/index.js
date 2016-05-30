'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractImageBuilder2 = require('../AbstractImageBuilder');

var _AbstractImageBuilder3 = _interopRequireDefault(_AbstractImageBuilder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueryDataModelImageBuilder = function (_AbstractImageBuilder) {
  _inherits(QueryDataModelImageBuilder, _AbstractImageBuilder);

  // ------------------------------------------------------------------------

  function QueryDataModelImageBuilder(queryDataModel) {
    _classCallCheck(this, QueryDataModelImageBuilder);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(QueryDataModelImageBuilder).call(this, { queryDataModel: queryDataModel, dimensions: queryDataModel.originalData.data[0].dimensions || [500, 500] }));

    _this.lastQueryImage = null;
    _this.onLoadCallback = function () {
      _this.lastQueryImage.removeEventListener('load', _this.onLoadCallback);
      _this.render();
    };

    _this.registerSubscription(queryDataModel.onDataChange(function (data, envelope) {
      if (_this.lastQueryImage) {
        _this.lastQueryImage.removeEventListener('load', _this.onLoadCallback);
      }

      if (data.image) {
        _this.lastQueryImage = data.image.image;
        _this.render();
      }
    }));
    return _this;
  }

  // ------------------------------------------------------------------------

  _createClass(QueryDataModelImageBuilder, [{
    key: 'render',
    value: function render() {
      if (!this.lastQueryImage) {
        this.queryDataModel.fetchData();
        return;
      }

      if (this.lastQueryImage.complete) {
        var width = this.lastQueryImage.width,
            height = this.lastQueryImage.height;

        this.imageReady({
          canvas: this.lastQueryImage,
          area: [0, 0, width, height],
          outputSize: [width, height],
          builder: this,
          arguments: this.queryDataModel.getQuery()
        });
      } else {
        this.lastQueryImage.addEventListener('load', this.onLoadCallback);
      }
    }
  }]);

  return QueryDataModelImageBuilder;
}(_AbstractImageBuilder3.default);

exports.default = QueryDataModelImageBuilder;