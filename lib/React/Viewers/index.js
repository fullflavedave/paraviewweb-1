define(['exports', './AbstractViewerMenu', './ChartViewer', './GeometryViewer', './ImageBuilderViewer', './LineChartViewer', './MultiLayoutViewer', './Probe3DViewer'], function (exports, _AbstractViewerMenu, _ChartViewer, _GeometryViewer, _ImageBuilderViewer, _LineChartViewer, _MultiLayoutViewer, _Probe3DViewer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

  var _ChartViewer2 = _interopRequireDefault(_ChartViewer);

  var _GeometryViewer2 = _interopRequireDefault(_GeometryViewer);

  var _ImageBuilderViewer2 = _interopRequireDefault(_ImageBuilderViewer);

  var _LineChartViewer2 = _interopRequireDefault(_LineChartViewer);

  var _MultiLayoutViewer2 = _interopRequireDefault(_MultiLayoutViewer);

  var _Probe3DViewer2 = _interopRequireDefault(_Probe3DViewer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    AbstractViewerMenu: _AbstractViewerMenu2.default,
    ChartViewer: _ChartViewer2.default,
    GeometryViewer: _GeometryViewer2.default,
    ImageBuilderViewer: _ImageBuilderViewer2.default,
    LineChartViewer: _LineChartViewer2.default,
    MultiLayoutViewer: _MultiLayoutViewer2.default,
    Probe3DViewer: _Probe3DViewer2.default
  };
});