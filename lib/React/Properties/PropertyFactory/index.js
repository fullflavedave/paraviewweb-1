'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (prop, vd, onChange) {
  var fn = factoryMapping[capitalize(prop.ui.propType)];
  if (fn) {
    return fn(prop, vd, onChange);
  }
  return null;
};

var _CellProperty = require('../CellProperty');

var _CellProperty2 = _interopRequireDefault(_CellProperty);

var _CheckboxProperty = require('../CheckboxProperty');

var _CheckboxProperty2 = _interopRequireDefault(_CheckboxProperty);

var _EnumProperty = require('../EnumProperty');

var _EnumProperty2 = _interopRequireDefault(_EnumProperty);

var _MapProperty = require('../MapProperty');

var _MapProperty2 = _interopRequireDefault(_MapProperty);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SliderProperty = require('../SliderProperty');

var _SliderProperty2 = _interopRequireDefault(_SliderProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
/* eslint-disable max-len */
var factoryMapping = {
  Cell: function Cell(prop, viewData, onChange) {
    return _react2.default.createElement(_CellProperty2.default, { key: prop.data.id, data: prop.data, ui: prop.ui, viewData: viewData, show: prop.show, onChange: onChange });
  },
  Slider: function Slider(prop, viewData, onChange) {
    return _react2.default.createElement(_SliderProperty2.default, { key: prop.data.id, data: prop.data, ui: prop.ui, viewData: viewData, show: prop.show, onChange: onChange });
  },
  Enum: function Enum(prop, viewData, onChange) {
    return _react2.default.createElement(_EnumProperty2.default, { key: prop.data.id, data: prop.data, ui: prop.ui, viewData: viewData, show: prop.show, onChange: onChange });
  },
  Checkbox: function Checkbox(prop, viewData, onChange) {
    return _react2.default.createElement(_CheckboxProperty2.default, { key: prop.data.id, data: prop.data, ui: prop.ui, viewData: viewData, show: prop.show, onChange: onChange });
  },
  Map: function Map(prop, viewData, onChange) {
    return _react2.default.createElement(_MapProperty2.default, { key: prop.data.id, data: prop.data, ui: prop.ui, viewData: viewData, show: prop.show, onChange: onChange });
  }
};

/* eslint-enable react/display-name */
/* eslint-enable react/no-multi-comp */
/* eslint-enable max-len */

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1).toLowerCase();
}