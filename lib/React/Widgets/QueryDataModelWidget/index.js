'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _String = require('./String');

var _String2 = _interopRequireDefault(_String);

var _Number = require('./Number');

var _Number2 = _interopRequireDefault(_Number);

var _DataListenerMixin = require('./DataListenerMixin');

var _DataListenerMixin2 = _interopRequireDefault(_DataListenerMixin);

var _DataListenerUpdateMixin = require('./DataListenerUpdateMixin');

var _DataListenerUpdateMixin2 = _interopRequireDefault(_DataListenerUpdateMixin);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QueryDataModelWidget = require('PVWStyle/ReactWidgets/QueryDataModelWidget.mcss');

var _QueryDataModelWidget2 = _interopRequireDefault(_QueryDataModelWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This React component expect the following input properties:
 *   - model:
 *       Expect a QueryDataModel instance.
 *   - listener:
 *       Expect a Boolean based on the automatic data model registration for listening.
 *       Default value is true and false for the sub components.
 */
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