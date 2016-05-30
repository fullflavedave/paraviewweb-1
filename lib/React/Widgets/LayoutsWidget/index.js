'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LayoutsWidget = require('PVWStyle/ReactWidgets/LayoutsWidget.mcss');

var _LayoutsWidget2 = _interopRequireDefault(_LayoutsWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'LayoutsWidget',

  propTypes: {
    onChange: _react2.default.PropTypes.func
  },

  onLayoutChange: function onLayoutChange(event) {
    var layout = event.currentTarget.getAttribute('name');
    if (this.props.onChange) {
      this.props.onChange(layout);
    }
  },
  render: function render() {
    return _react2.default.createElement(
      'section',
      null,
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '2x2', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '1x2', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '2x1', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '1x1', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '3xL', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { rowSpan: '2', className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '3xT', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { colSpan: '2', className: _LayoutsWidget2.default.td })
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '3xR', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { rowSpan: '2', className: _LayoutsWidget2.default.td })
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          )
        )
      ),
      _react2.default.createElement(
        'table',
        { className: _LayoutsWidget2.default.table, name: '3xB', onClick: this.onLayoutChange },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td }),
            _react2.default.createElement('td', { className: _LayoutsWidget2.default.td })
          ),
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement('td', { colSpan: '2', className: _LayoutsWidget2.default.td })
          )
        )
      )
    );
  }
});