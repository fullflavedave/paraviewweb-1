'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = twoByOne;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LayoutsWidget = require('PVWStyle/ReactWidgets/LayoutsWidget.mcss');

var _LayoutsWidget2 = _interopRequireDefault(_LayoutsWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function twoByOne(props) {
  return _react2.default.createElement(
    'table',
    { className: props.active === '2x1' ? _LayoutsWidget2.default.activeTable : _LayoutsWidget2.default.table, name: '2x1', onClick: props.onClick },
    _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        null,
        _react2.default.createElement('td', { className: props.activeRegion === 0 ? _LayoutsWidget2.default.activeTd : _LayoutsWidget2.default.td }),
        _react2.default.createElement('td', { className: props.activeRegion === 1 ? _LayoutsWidget2.default.activeTd : _LayoutsWidget2.default.td })
      )
    )
  );
}

twoByOne.propTypes = {
  onClick: _react2.default.PropTypes.func,
  active: _react2.default.PropTypes.string,
  activeRegion: _react2.default.PropTypes.number
};

twoByOne.defaultProps = {
  onClick: function onClick() {},
  activeRegion: -1
};