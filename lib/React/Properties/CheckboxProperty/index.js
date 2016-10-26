define(['exports', 'react', 'PVWStyle/ReactProperties/CellProperty.mcss', '../PropertyFactory/BlockMixin', './Checkbox', '../../Widgets/ToggleIconButtonWidget'], function (exports, _react, _CellProperty, _BlockMixin, _Checkbox, _ToggleIconButtonWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CellProperty2 = _interopRequireDefault(_CellProperty);

  var _BlockMixin2 = _interopRequireDefault(_BlockMixin);

  var _Checkbox2 = _interopRequireDefault(_Checkbox);

  var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'CheckboxProperty',

    propTypes: {
      data: _react2.default.PropTypes.object.isRequired,
      help: _react2.default.PropTypes.string,
      name: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      show: _react2.default.PropTypes.func,
      ui: _react2.default.PropTypes.object.isRequired,
      viewData: _react2.default.PropTypes.object
    },

    mixins: [_BlockMixin2.default],

    valueChange: function valueChange(idx, newVal) {
      var newData = this.state.data;
      if (idx === null) {
        newData.value = newVal;
      } else {
        newData.value[idx] = newVal;
      }
      this.setState({
        data: newData
      });
      if (this.props.onChange) {
        this.props.onChange(newData);
      }
    },
    render: function render() {
      var _this = this;

      var mapper = function mapper() {
        if (Array.isArray(_this.props.data.value)) {
          var ret = [];
          for (var i = 0; i < _this.props.data.value.length; i++) {
            ret.push(_react2.default.createElement(_Checkbox2.default, {
              value: !!_this.props.data.value[i],
              label: _this.props.ui.componentLabels[i],
              key: _this.props.data.id + '_' + i,
              onChange: _this.valueChange
            }));
          }
          return ret;
        }

        return _react2.default.createElement(_Checkbox2.default, {
          value: !!_this.props.data.value,
          label: _this.props.ui.componentLabels[0],
          onChange: _this.valueChange
        });
      };

      return _react2.default.createElement(
        'div',
        { className: this.props.show(this.props.viewData) ? _CellProperty2.default.container : _CellProperty2.default.hidden },
        _react2.default.createElement(
          'div',
          { className: _CellProperty2.default.header },
          _react2.default.createElement(
            'strong',
            null,
            this.props.ui.label
          ),
          _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(_ToggleIconButtonWidget2.default, {
              icon: _CellProperty2.default.helpIcon,
              value: this.state.helpOpen,
              toggle: !!this.props.ui.help,
              onChange: this.helpToggled
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _CellProperty2.default.inputBlock },
          mapper()
        ),
        _react2.default.createElement('div', {
          className: this.state.helpOpen ? _CellProperty2.default.helpBox : _CellProperty2.default.hidden,
          dangerouslySetInnerHTML: { __html: this.props.ui.help }
        })
      );
    }
  });
});