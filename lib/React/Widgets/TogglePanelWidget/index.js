define(['exports', 'react', 'PVWStyle/ReactWidgets/TogglePanelWidget.mcss'], function (exports, _react, _TogglePanelWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _TogglePanelWidget2 = _interopRequireDefault(_TogglePanelWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'TogglePanelWidget',

    propTypes: {
      anchor: _react2.default.PropTypes.array,
      children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.array]),
      panelVisible: _react2.default.PropTypes.bool,
      position: _react2.default.PropTypes.array,
      size: _react2.default.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
      return {
        anchor: ['top', 'right'],
        children: [],
        panelVisible: false,
        position: ['top', 'left'],
        size: {
          button: ['2em', '2em'],
          panel: ['400px']
        }
      };
    },
    getInitialState: function getInitialState() {
      return {
        panelVisible: this.props.panelVisible
      };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.state.enabled) {
        this.setState({ enabled: nextProps.value });
      }
      if (nextProps.panelVisible !== this.state.panelVisible) {
        this.setState({ panelVisible: nextProps.panelVisible });
      }
    },
    togglePanel: function togglePanel() {
      var panelVisible = !this.state.panelVisible;
      this.setState({ panelVisible: panelVisible });
    },
    render: function render() {
      var buttonAnchor = this.props.anchor.join(' '),
          panelAnchor = this.props.position.join(' ');

      return _react2.default.createElement(
        'div',
        {
          className: _TogglePanelWidget2.default.container,
          style: {
            width: this.props.size.button[0],
            height: this.props.size.button[1],
            lineHeight: this.props.size.button[1]
          }
        },
        _react2.default.createElement('span', {
          className: this.state.panelVisible ? _TogglePanelWidget2.default.panelVisible : _TogglePanelWidget2.default.panelHidden,
          style: {
            width: this.props.size.button[0],
            height: this.props.size.button[1],
            lineHeight: this.props.size.button[1]
          },
          onClick: this.togglePanel
        }),
        _react2.default.createElement(
          'div',
          { className: [_TogglePanelWidget2.default.button, buttonAnchor].join(' ') },
          _react2.default.createElement(
            'div',
            {
              className: [_TogglePanelWidget2.default.content, panelAnchor].join(' '),
              style: {
                display: this.state.panelVisible ? 'block' : 'none',
                width: this.props.size.panel[0]
              }
            },
            this.props.children
          )
        )
      );
    }
  });
});