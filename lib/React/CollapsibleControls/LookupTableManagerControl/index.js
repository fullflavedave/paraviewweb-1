define(['exports', 'react', '../../Widgets/CollapsibleWidget', '../../Widgets/LookupTableWidget', '../../Widgets/DropDownWidget'], function (exports, _react, _CollapsibleWidget, _LookupTableWidget, _DropDownWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

  var _LookupTableWidget2 = _interopRequireDefault(_LookupTableWidget);

  var _DropDownWidget2 = _interopRequireDefault(_DropDownWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'lookupTableManagerControl',

    propTypes: {
      field: _react2.default.PropTypes.string,
      lookupTableManager: _react2.default.PropTypes.object.isRequired
    },

    getInitialState: function getInitialState() {
      var luts = this.props.lookupTableManager.luts,
          fields = Object.keys(luts),
          field = this.props.field || fields[0];
      return {
        field: field, fields: fields
      };
    },
    componentWillMount: function componentWillMount() {
      var _this = this;

      this.changeSubscription = this.props.lookupTableManager.onFieldsChange(function (data, enevelope) {
        var fields = Object.keys(_this.props.lookupTableManager.luts);
        _this.setState({
          fields: fields
        });
      });
    },
    componentWillUnmount: function componentWillUnmount() {
      if (this.changeSubscription) {
        this.changeSubscription.unsubscribe();
        this.changeSubscription = null;
      }
    },
    onFieldsChange: function onFieldsChange(newVal) {
      this.props.lookupTableManager.updateActiveLookupTable(newVal);
      this.setState({
        field: newVal
      });
    },
    render: function render() {
      var lutManager = this.props.lookupTableManager,
          lut = lutManager.getLookupTable(this.state.field),
          originalRange = lut.getScalarRange();

      return _react2.default.createElement(
        _CollapsibleWidget2.default,
        {
          title: 'Lookup Table',
          activeSubTitle: true,
          subtitle: _react2.default.createElement(_DropDownWidget2.default, {
            field: this.state.field,
            fields: this.state.fields,
            onChange: this.onFieldsChange
          })
        },
        _react2.default.createElement(_LookupTableWidget2.default, {
          lookupTableManager: lutManager,
          lookupTable: lut,
          originalRange: originalRange
        })
      );
    }
  });
});