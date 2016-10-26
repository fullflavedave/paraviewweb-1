define(['exports', 'react', '../../../React/Widgets/LayoutsWidget', '../../../React/Widgets/LayoutsWidget/TwoByTwo', '../../../React/Widgets/LayoutsWidget/OneByTwo', '../../../React/Widgets/LayoutsWidget/TwoByOne', '../../../React/Widgets/LayoutsWidget/OneByOne', '../../../React/Widgets/LayoutsWidget/TwoLeft', '../../../React/Widgets/LayoutsWidget/TwoTop', '../../../React/Widgets/LayoutsWidget/TwoRight', '../../../React/Widgets/LayoutsWidget/TwoBottom', 'PVWStyle/ComponentReact/WorkbenchController.mcss'], function (exports, _react, _LayoutsWidget, _TwoByTwo, _OneByTwo, _TwoByOne, _OneByOne, _TwoLeft, _TwoTop, _TwoRight, _TwoBottom, _WorkbenchController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = workbenchController;

  var _react2 = _interopRequireDefault(_react);

  var _LayoutsWidget2 = _interopRequireDefault(_LayoutsWidget);

  var _TwoByTwo2 = _interopRequireDefault(_TwoByTwo);

  var _OneByTwo2 = _interopRequireDefault(_OneByTwo);

  var _TwoByOne2 = _interopRequireDefault(_TwoByOne);

  var _OneByOne2 = _interopRequireDefault(_OneByOne);

  var _TwoLeft2 = _interopRequireDefault(_TwoLeft);

  var _TwoTop2 = _interopRequireDefault(_TwoTop);

  var _TwoRight2 = _interopRequireDefault(_TwoRight);

  var _TwoBottom2 = _interopRequireDefault(_TwoBottom);

  var _WorkbenchController2 = _interopRequireDefault(_WorkbenchController);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var LAYOUT_VIEW = {
    '2x2': _TwoByTwo2.default,
    '1x2': _OneByTwo2.default,
    '2x1': _TwoByOne2.default,
    '1x1': _OneByOne2.default,
    '3xL': _TwoLeft2.default,
    '3xT': _TwoTop2.default,
    '3xR': _TwoRight2.default,
    '3xB': _TwoBottom2.default
  };

  function workbenchController(props) {
    var options = Object.keys(props.viewports).map(function (name, idx) {
      return _react2.default.createElement(
        'option',
        { key: idx, value: name },
        name
      );
    });
    var mapping = [];
    while (mapping.length < props.count) {
      mapping.push('None');
    }
    Object.keys(props.viewports).forEach(function (name) {
      if (props.viewports[name].viewport !== -1) {
        mapping[props.viewports[name].viewport] = name;
      }
    });
    while (mapping.length > props.count) {
      mapping.pop();
    }

    function changeViewport(event) {
      var idx = Number(event.currentTarget.getAttribute('name'));
      var name = event.currentTarget.value;
      props.onViewportChange(idx, props.viewports[name].component);
    }
    var LayoutItem = LAYOUT_VIEW[props.activeLayout];

    return _react2.default.createElement(
      'div',
      { className: _WorkbenchController2.default.container },
      _react2.default.createElement(_LayoutsWidget2.default, { className: _WorkbenchController2.default.layout, onChange: props.onLayoutChange, active: props.activeLayout }),
      mapping.map(function (name, idx) {
        return _react2.default.createElement(
          'section',
          { key: idx, className: _WorkbenchController2.default.line },
          _react2.default.createElement(LayoutItem, { activeRegion: idx }),
          _react2.default.createElement(
            'select',
            { className: _WorkbenchController2.default.stretch, name: idx, value: name, onChange: changeViewport },
            options
          )
        );
      })
    );
  }

  workbenchController.propTypes = {
    onLayoutChange: _react2.default.PropTypes.func,
    onViewportChange: _react2.default.PropTypes.func,
    activeLayout: _react2.default.PropTypes.string,
    viewports: _react2.default.PropTypes.object,
    count: _react2.default.PropTypes.number
  };

  workbenchController.defaultProps = {
    onLayoutChange: function onLayoutChange() {},
    onViewportChange: function onViewportChange() {},
    count: 4
  };
});