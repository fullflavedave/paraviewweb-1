define(['exports', 'react', 'PVWStyle/ReactWidgets/LayoutsWidget.mcss'], function (exports, _react, _LayoutsWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = twoRight;

  var _react2 = _interopRequireDefault(_react);

  var _LayoutsWidget2 = _interopRequireDefault(_LayoutsWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function twoRight(props) {
    return _react2.default.createElement(
      'table',
      { className: props.active === '3xR' ? _LayoutsWidget2.default.activeTable : _LayoutsWidget2.default.table, name: '3xR', onClick: props.onClick },
      _react2.default.createElement(
        'tbody',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement('td', { className: props.activeRegion === 0 ? _LayoutsWidget2.default.activeTd : _LayoutsWidget2.default.td }),
          _react2.default.createElement('td', { rowSpan: '2', className: props.activeRegion === 1 ? _LayoutsWidget2.default.activeTd : _LayoutsWidget2.default.td })
        ),
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement('td', { className: props.activeRegion === 2 ? _LayoutsWidget2.default.activeTd : _LayoutsWidget2.default.td })
        )
      )
    );
  }

  twoRight.propTypes = {
    onClick: _react2.default.PropTypes.func,
    active: _react2.default.PropTypes.string,
    activeRegion: _react2.default.PropTypes.number
  };

  twoRight.defaultProps = {
    onClick: function onClick() {},
    activeRegion: -1
  };
});