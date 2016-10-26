define(['exports', 'react', 'PVWStyle/ReactWidgets/ActionListWidget.mcss'], function (exports, _react, _ActionListWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ActionListWidget2 = _interopRequireDefault(_ActionListWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'ActionListWidget',

    propTypes: {
      list: _react2.default.PropTypes.array.isRequired,
      onClick: _react2.default.PropTypes.func
    },

    processClick: function processClick(event) {
      var target = event.target;
      while (!target.dataset.name) {
        target = target.parentNode;
      }

      if (this.props.onClick) {
        this.props.onClick(target.dataset.name, target.dataset.action, target.dataset.user);
      }
    },
    render: function render() {
      var _this = this;

      var list = [];

      this.props.list.forEach(function (item, idx) {
        list.push(_react2.default.createElement(
          'li',
          {
            className: item.active ? _ActionListWidget2.default.activeItem : _ActionListWidget2.default.item,
            key: idx,
            title: item.name,
            'data-name': item.name,
            'data-action': item.action || 'default',
            'data-user': item.data || '',
            onClick: _this.processClick
          },
          _react2.default.createElement('i', { className: item.icon }),
          item.name
        ));
      });

      return _react2.default.createElement(
        'ul',
        { className: _ActionListWidget2.default.list },
        list
      );
    }
  });
});