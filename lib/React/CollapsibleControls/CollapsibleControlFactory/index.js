define(['exports', 'react', '../../Widgets/CollapsibleWidget', '../FloatImageControl', '../TimeFloatImageControl', '../LightControl', '../LookupTableManagerControl', '../PixelOperatorControl', '../PlotlyChartControl', '../ProbeControl', '../QueryDataModelControl', '../VolumeControl', '../../Widgets/CompositePipelineWidget', '../../Widgets/EqualizerWidget', '../../Widgets/LookupTableWidget'], function (exports, _react, _CollapsibleWidget, _FloatImageControl2, _TimeFloatImageControl2, _LightControl, _LookupTableManagerControl, _PixelOperatorControl2, _PlotlyChartControl2, _ProbeControl2, _QueryDataModelControl, _VolumeControl, _CompositePipelineWidget, _EqualizerWidget2, _LookupTableWidget2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

  var _FloatImageControl3 = _interopRequireDefault(_FloatImageControl2);

  var _TimeFloatImageControl3 = _interopRequireDefault(_TimeFloatImageControl2);

  var _LightControl2 = _interopRequireDefault(_LightControl);

  var _LookupTableManagerControl2 = _interopRequireDefault(_LookupTableManagerControl);

  var _PixelOperatorControl3 = _interopRequireDefault(_PixelOperatorControl2);

  var _PlotlyChartControl3 = _interopRequireDefault(_PlotlyChartControl2);

  var _ProbeControl3 = _interopRequireDefault(_ProbeControl2);

  var _QueryDataModelControl2 = _interopRequireDefault(_QueryDataModelControl);

  var _VolumeControl2 = _interopRequireDefault(_VolumeControl);

  var _CompositePipelineWidget2 = _interopRequireDefault(_CompositePipelineWidget);

  var _EqualizerWidget3 = _interopRequireDefault(_EqualizerWidget2);

  var _LookupTableWidget3 = _interopRequireDefault(_LookupTableWidget2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* eslint-disable react/display-name */
  /* eslint-disable react/no-multi-comp */
  /* eslint-disable react/prop-types */
  /* eslint-disable react/no-string-refs */


  // Full feature control
  var WidgetFactoryMapping = {
    QueryDataModelWidget: function QueryDataModelWidget(_ref) {
      var queryDataModel = _ref.queryDataModel;
      var handleExploration = _ref.handleExploration;

      return _react2.default.createElement(_QueryDataModelControl2.default, {
        key: 'QueryDataModel',
        handleExploration: !!handleExploration,
        model: queryDataModel
      });
    },
    EqualizerWidget: function EqualizerWidget(_ref2) {
      var levels = _ref2.levels;
      var _ref2$colors = _ref2.colors;
      var colors = _ref2$colors === undefined ? ['#cccccc'] : _ref2$colors;
      var callback = _ref2.callback;

      return _react2.default.createElement(_EqualizerWidget3.default, {
        key: 'Equalizer',
        width: 300,
        height: 120,
        layers: levels,
        onChange: callback,
        colors: colors
      });
    },
    LookupTableWidget: function LookupTableWidget(_ref3) {
      var _ref3$originalRange = _ref3.originalRange;
      var originalRange = _ref3$originalRange === undefined ? [0, 1] : _ref3$originalRange;
      var lookupTable = _ref3.lookupTable;
      var lookupTableManager = _ref3.lookupTableManager;

      return _react2.default.createElement(
        _CollapsibleWidget2.default,
        { title: 'LookupTable', key: 'LookupTableWidget_parent' },
        _react2.default.createElement(_LookupTableWidget3.default, {
          key: 'LookupTableWidget',
          ref: 'LookupTableWidget',
          originalRange: originalRange,
          lookupTable: lookupTable,
          lookupTableManager: lookupTableManager
        })
      );
    },
    LookupTableManagerWidget: function LookupTableManagerWidget(_ref4) {
      var lookupTableManager = _ref4.lookupTableManager;
      var activeField = _ref4.activeField;

      var field = activeField;
      if (!field) {
        field = lookupTableManager.getActiveField();
      }
      return _react2.default.createElement(_LookupTableManagerControl2.default, {
        key: 'LookupTableManagerWidget',
        ref: 'LookupTableManagerWidget',
        field: field,
        lookupTableManager: lookupTableManager
      });
    },
    CompositeControl: function CompositeControl(_ref5) {
      var pipelineModel = _ref5.pipelineModel;

      return _react2.default.createElement(
        _CollapsibleWidget2.default,
        { title: 'Pipeline', key: 'CompositeControl_parent' },
        _react2.default.createElement(_CompositePipelineWidget2.default, {
          key: 'CompositeControl',
          ref: 'CompositeControl',
          model: pipelineModel
        })
      );
    },
    ProbeControl: function ProbeControl(_ref6) {
      var model = _ref6.model;

      return _react2.default.createElement(_ProbeControl3.default, {
        key: 'ProbeControl',
        ref: 'ProbeControl',
        imageBuilder: model
      });
    },
    LightPropertiesWidget: function LightPropertiesWidget(_ref7) {
      var light = _ref7.light;

      return _react2.default.createElement(_LightControl2.default, {
        key: 'LightPropertiesWidget',
        ref: 'LightPropertiesWidget',
        light: light
      });
    },
    VolumeControlWidget: function VolumeControlWidget(_ref8) {
      var lookupTable = _ref8.lookupTable;
      var equalizer = _ref8.equalizer;
      var intensity = _ref8.intensity;
      var computation = _ref8.computation;

      return _react2.default.createElement(_VolumeControl2.default, {
        key: 'VolumeControlWidget',
        ref: 'VolumeControlWidget',
        intensity: intensity,
        computation: computation,
        equalizer: equalizer,
        lookupTable: lookupTable
      });
    },
    PixelOperatorControl: function PixelOperatorControl(_ref9) {
      var model = _ref9.model;

      return _react2.default.createElement(_PixelOperatorControl3.default, {
        key: 'PixelOperatorControl',
        ref: 'PixelOperatorControl',
        operator: model
      });
    },
    FloatImageControl: function FloatImageControl(_ref10) {
      var model = _ref10.model;

      return _react2.default.createElement(_FloatImageControl3.default, {
        key: 'FloatImageControl',
        ref: 'FloatImageControl',
        model: model
      });
    },
    TimeFloatImageControl: function TimeFloatImageControl(_ref11) {
      var model = _ref11.model;

      return _react2.default.createElement(_TimeFloatImageControl3.default, {
        key: 'TimeFloatImageControl',
        ref: 'TimeFloatImageControl',
        model: model
      });
    },
    PlotlyChartControl: function PlotlyChartControl(_ref12) {
      var model = _ref12.model;

      return _react2.default.createElement(_PlotlyChartControl3.default, {
        key: 'PlotlyChartControl',
        ref: 'PlotlyChartControl',
        model: model
      });
    }
  };
  /* eslint-enable react/display-name */
  /* eslint-enable react/no-multi-comp */
  /* eslint-enable react/prop-types */
  /* eslint-enable react/no-string-refs */


  // Need to be wrapped inside CollapsibleWidget
  function createWidget(name, options) {
    var fn = WidgetFactoryMapping[name];

    if (fn) {
      return fn(options);
    }
    return null;
  }

  function getWidgets(obj) {
    if (!obj) {
      return [];
    }

    var widgetDesc = obj.getControlWidgets(),
        widgetList = [];

    widgetDesc.forEach(function (desc) {
      var widget = createWidget(desc.name, desc);
      if (widget) {
        widgetList.push(widget);
      } else {
        console.error('Unable to create widget for name:', desc.name);
      }
    });

    return widgetList;
  }

  exports.default = {
    createWidget: createWidget,
    getWidgets: getWidgets
  };
});