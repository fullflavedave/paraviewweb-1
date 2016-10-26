define(['exports', 'react', 'mout/src/object/equals', 'PVWStyle/ReactWidgets/InlineToggleButtonWidget.mcss'], function (exports, _react, _equals, _InlineToggleButtonWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _equals2 = _interopRequireDefault(_equals);

  var _InlineToggleButtonWidget2 = _interopRequireDefault(_InlineToggleButtonWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'InlineToggleButtonWidget',

    propTypes: {
      active: _react2.default.PropTypes.number,
      activeColor: _react2.default.PropTypes.string,
      defaultColor: _react2.default.PropTypes.string,
      height: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      options: _react2.default.PropTypes.array.isRequired
    },

    getDefaultProps: function getDefaultProps() {
      return {
        activeColor: '#fff',
        defaultColor: '#ccc',
        height: '1em'
      };
    },
    getInitialState: function getInitialState() {
      return {
        activeIdx: this.props.active || 0
      };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var previous = this.props,
          next = nextProps;

      if (!(0, _equals2.default)(previous, next)) {
        this.setState({
          activeIdx: next.active || 0
        });
      }
    },
    activateButton: function activateButton(e) {
      var activeIdx = Number(e.target.dataset.idx);
      this.setState({ activeIdx: activeIdx });
      if (this.props.onChange) {
        this.props.onChange(this.props.options[activeIdx], activeIdx);
      }
    },
    render: function render() {
      var _this = this;

      var currentActive = this.state.activeIdx,
          fontSize = this.props.height,
          lineHeight = this.props.height,
          height = this.props.height;

      return _react2.default.createElement(
        'div',
        { className: _InlineToggleButtonWidget2.default.container },
        this.props.options.map(function (obj, idx) {
          var isActive = currentActive === idx,
              background = isActive ? _this.props.activeColor : _this.props.defaultColor,
              className = idx === 0 ? isActive ? 'activeFirst' : 'first' : idx === _this.props.options.length - 1 ? isActive ? 'activeLast' : 'last' : isActive ? 'activeMiddle' : 'middle';
          if (obj.label) {
            return _react2.default.createElement(
              'button',
              {
                style: { lineHeight: lineHeight, fontSize: fontSize, background: background },
                key: idx,
                onClick: _this.activateButton,
                'data-idx': idx,
                className: _InlineToggleButtonWidget2.default[className]
              },
              obj.label
            );
          }
          if (obj.img) {
            return _react2.default.createElement(
              'div',
              {
                style: { lineHeight: lineHeight, height: height, fontSize: fontSize, background: background },
                key: idx,
                onClick: _this.activateButton,
                'data-idx': idx,
                className: _InlineToggleButtonWidget2.default[className]
              },
              _react2.default.createElement('img', {
                'data-idx': idx,
                onClick: _this.activateButton,
                height: '100%',
                src: obj.img,
                alt: 'ToggleButton'
              })
            );
          }
          if (obj.icon) {
            return _react2.default.createElement('i', {
              key: idx,
              style: { lineHeight: lineHeight, fontSize: fontSize, background: background },
              onClick: _this.activateButton,
              'data-idx': idx,
              className: [_InlineToggleButtonWidget2.default[className], obj.icon].join(' ')
            });
          }
          return null;
        })
      );
    }
  });
});