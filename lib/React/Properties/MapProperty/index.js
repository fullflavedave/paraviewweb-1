define(['exports', 'react', 'PVWStyle/ReactProperties/CellProperty.mcss', 'PVWStyle/ReactProperties/MapProperty.mcss', '../PropertyFactory/BlockMixin', './KeyValuePair', '../../Widgets/ToggleIconButtonWidget'], function (exports, _react, _CellProperty, _MapProperty, _BlockMixin, _KeyValuePair, _ToggleIconButtonWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _CellProperty2 = _interopRequireDefault(_CellProperty);

  var _MapProperty2 = _interopRequireDefault(_MapProperty);

  var _BlockMixin2 = _interopRequireDefault(_BlockMixin);

  var _KeyValuePair2 = _interopRequireDefault(_KeyValuePair);

  var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'MapProperty',

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

    valueChange: function valueChange(idx, key, value) {
      var data = this.state.data;

      if (key === value && key === undefined) {
        data.value.splice(idx, 1);
      } else {
        data.value[idx][key] = value;
      }
      this.setState({ data: data });

      if (this.props.onChange) {
        this.props.onChange(data);
      }
    },
    addEntry: function addEntry() {
      var data = this.state.data;

      data.value.push({ name: '', value: '' });
      this.setState({ data: data });
    },
    render: function render() {
      var _this = this;

      var mapper = function mapper() {
        if (Array.isArray(_this.state.data.value)) {
          var ret = [];
          for (var i = 0; i < _this.state.data.value.length; i++) {
            ret.push(_react2.default.createElement(_KeyValuePair2.default, {
              idx: i,
              value: _this.state.data.value[i],
              key: _this.state.data.id + '_' + i,
              onChange: _this.valueChange
            }));
          }
          return ret;
        }

        return null;
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
          _react2.default.createElement(
            'table',
            { className: _MapProperty2.default.table },
            _react2.default.createElement(
              'tbody',
              null,
              _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'th',
                  { className: _MapProperty2.default.inputColumn },
                  'Name'
                ),
                _react2.default.createElement(
                  'th',
                  { className: _MapProperty2.default.inputColumn },
                  'Value'
                ),
                _react2.default.createElement(
                  'th',
                  { className: _MapProperty2.default.actionColumn },
                  _react2.default.createElement('i', { className: _MapProperty2.default.addButton, onClick: this.addEntry })
                )
              ),
              mapper()
            )
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