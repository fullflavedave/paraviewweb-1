define(['exports', 'react', 'PVWStyle/ReactWidgets/QueryDataModelWidget.mcss', './String', './Number', './DataListenerMixin', './DataListenerUpdateMixin'], function (exports, _react, _QueryDataModelWidget, _String, _Number, _DataListenerMixin, _DataListenerUpdateMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _QueryDataModelWidget2 = _interopRequireDefault(_QueryDataModelWidget);

  var _String2 = _interopRequireDefault(_String);

  var _Number2 = _interopRequireDefault(_Number);

  var _DataListenerMixin2 = _interopRequireDefault(_DataListenerMixin);

  var _DataListenerUpdateMixin2 = _interopRequireDefault(_DataListenerUpdateMixin);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'QueryDataModelWidget',

    propTypes: {
      model: _react2.default.PropTypes.object
    },

    mixins: [_DataListenerMixin2.default, _DataListenerUpdateMixin2.default],

    render: function render() {
      var model = this.props.model,
          args = model.originalData.arguments,
          orderList = model.originalData.arguments_order.filter(function (name) {
        return args[name].values.length > 1;
      });

      return _react2.default.createElement(
        'div',
        { className: _QueryDataModelWidget2.default.container },
        orderList.map(function (name) {
          if (model.getUiType(name) === 'list') {
            return _react2.default.createElement(_String2.default, {
              key: name,
              model: model,
              arg: name,
              listener: false
            });
          } else if (model.getUiType(name) === 'slider') {
            return _react2.default.createElement(_Number2.default, {
              key: name,
              model: model,
              arg: name,
              listener: false
            });
          }
          return null;
        })
      );
    }
  });
});