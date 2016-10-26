define(['exports', 'react', 'PVWStyle/ReactProperties/CellProperty.mcss', '../PropertyFactory/BlockMixin', './layouts', '../../Widgets/ToggleIconButtonWidget'], function (exports, _react, _CellProperty, _BlockMixin, _layouts, _ToggleIconButtonWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CellProperty2 = _interopRequireDefault(_CellProperty);

  var _BlockMixin2 = _interopRequireDefault(_BlockMixin);

  var _layouts2 = _interopRequireDefault(_layouts);

  var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'CellProperty',

    propTypes: {
      data: _react2.default.PropTypes.object.isRequired,
      help: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      show: _react2.default.PropTypes.func,
      ui: _react2.default.PropTypes.object.isRequired,
      viewData: _react2.default.PropTypes.object
    },

    mixins: [_BlockMixin2.default],

    valueChange: function valueChange(idx, newVal) {
      var newData = this.state.data;
      if (newVal === null) {
        newData.value.splice(idx, 1);
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
    addValue: function addValue() {
      var newData = this.state.data,
          values = newData.value;

      switch (values.length) {
        case 0:
          {
            values.push(0);
            break;
          }
        case 1:
          {
            values.push(values[0]);
            break;
          }
        default:
          {
            var last = Number(values[values.length - 1]);
            var beforeLast = Number(values[values.length - 2]);
            var newValue = last + (last - beforeLast);
            if (!Number.isNaN(newValue) && Number.isFinite(newValue)) {
              values.push(newValue);
            } else {
              values.push(values[values.length - 1]);
            }
          }
      }

      this.setState({
        data: newData
      });
      if (this.props.onChange) {
        this.props.onChange(newData);
      }
    },
    render: function render() {
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
            _react2.default.createElement('i', {
              className: this.props.ui.layout === '-1' ? _CellProperty2.default.plusIcon : _CellProperty2.default.hidden,
              onClick: this.addValue
            }),
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
          _react2.default.createElement(
            'table',
            { className: _CellProperty2.default.inputTable },
            (0, _layouts2.default)(this.props.data, this.props.ui, this.valueChange)
          )
        ),
        _react2.default.createElement('div', {
          className: this.state.helpOpen ? _CellProperty2.default.helpBox : _CellProperty2.default.hidden,
          dangerouslySetInnerHTML: { __html: this.props.ui.help }
        })
      );
    }
  });
});