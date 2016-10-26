define(['exports', 'react', 'PVWStyle/ReactWidgets/PresetListWidget.mcss'], function (exports, _react, _PresetListWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _PresetListWidget2 = _interopRequireDefault(_PresetListWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'PresetListWidget',

    propTypes: {
      activeName: _react2.default.PropTypes.string,
      height: _react2.default.PropTypes.string,
      onChange: _react2.default.PropTypes.func,
      presets: _react2.default.PropTypes.object,
      visible: _react2.default.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
      return {
        activeName: '',
        height: '1em',
        presets: {},
        visible: true
      };
    },
    getInitialState: function getInitialState() {
      return {
        activeName: this.props.activeName
      };
    },
    updateActive: function updateActive(event) {
      var activeName = event.target.dataset.name;
      this.setState({ activeName: activeName });
      if (this.props.onChange) {
        this.props.onChange(activeName);
      }
    },
    render: function render() {
      var _this = this;

      if (!this.props.presets || !this.props.visible) {
        return null;
      }

      var activeName = this.state.activeName,
          height = this.props.height,
          presets = this.props.presets,
          names = Object.keys(presets);

      return _react2.default.createElement(
        'div',
        { className: _PresetListWidget2.default.container },
        _react2.default.createElement('div', { className: _PresetListWidget2.default.bottomPadding }),
        names.map(function (name) {
          return _react2.default.createElement('img', {
            alt: 'Preset',
            src: 'data:image/png;base64,' + presets[name],
            key: name,
            style: { height: height },
            'data-name': name,
            onClick: _this.updateActive,
            className: name === activeName ? _PresetListWidget2.default.activeLine : _PresetListWidget2.default.line
          });
        }),
        _react2.default.createElement('div', { className: _PresetListWidget2.default.bottomPadding })
      );
    }
  });
});