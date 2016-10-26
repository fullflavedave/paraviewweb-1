define(['exports', './CellProperty', './CheckboxProperty', './EnumProperty', './MapProperty', './PropertyFactory', './PropertyPanel', './SliderProperty'], function (exports, _CellProperty, _CheckboxProperty, _EnumProperty, _MapProperty, _PropertyFactory, _PropertyPanel, _SliderProperty) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _CellProperty2 = _interopRequireDefault(_CellProperty);

  var _CheckboxProperty2 = _interopRequireDefault(_CheckboxProperty);

  var _EnumProperty2 = _interopRequireDefault(_EnumProperty);

  var _MapProperty2 = _interopRequireDefault(_MapProperty);

  var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

  var _PropertyPanel2 = _interopRequireDefault(_PropertyPanel);

  var _SliderProperty2 = _interopRequireDefault(_SliderProperty);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    CellProperty: _CellProperty2.default,
    CheckboxProperty: _CheckboxProperty2.default,
    EnumProperty: _EnumProperty2.default,
    MapProperty: _MapProperty2.default,
    PropertyFactory: _PropertyFactory2.default,
    PropertyPanel: _PropertyPanel2.default,
    SliderProperty: _SliderProperty2.default
  };
});