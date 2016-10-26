'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _QueryDataModel = require('../../../../IO/Core/QueryDataModel');

var _QueryDataModel2 = _interopRequireDefault(_QueryDataModel);

var _QueryDataModelImageBuilder = require('../../../../Rendering/Image/QueryDataModelImageBuilder');

var _QueryDataModelImageBuilder2 = _interopRequireDefault(_QueryDataModelImageBuilder);

var _index = require('tonic-arctic-sample-data/data/earth/index.json');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

/* global __BASE_PATH__ */
var queryDataModel = new _QueryDataModel2.default(_index2.default, __BASE_PATH__ + '/data/earth/'),
    imageBuilder = new _QueryDataModelImageBuilder2.default(queryDataModel);

_reactDom2.default.render(_react2.default.createElement(_2.default, { queryDataModel: queryDataModel, imageBuilder: imageBuilder }), document.querySelector('.content'));

queryDataModel.fetchData();