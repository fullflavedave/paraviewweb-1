define(['exports', './DataManager', './GeometryDataModel', './ProcessLauncher', './QueryDataModel'], function (exports, _DataManager, _GeometryDataModel, _ProcessLauncher, _QueryDataModel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _DataManager2 = _interopRequireDefault(_DataManager);

  var _GeometryDataModel2 = _interopRequireDefault(_GeometryDataModel);

  var _ProcessLauncher2 = _interopRequireDefault(_ProcessLauncher);

  var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    DataManager: _DataManager2.default,
    GeometryDataModel: _GeometryDataModel2.default,
    ProcessLauncher: _ProcessLauncher2.default,
    QueryDataModel: _QueryDataModel2.default
  };
});