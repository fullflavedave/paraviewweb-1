'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = layoutsWidget;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TwoByTwo = require('./TwoByTwo');

var _TwoByTwo2 = _interopRequireDefault(_TwoByTwo);

var _OneByTwo = require('./OneByTwo');

var _OneByTwo2 = _interopRequireDefault(_OneByTwo);

var _TwoByOne = require('./TwoByOne');

var _TwoByOne2 = _interopRequireDefault(_TwoByOne);

var _OneByOne = require('./OneByOne');

var _OneByOne2 = _interopRequireDefault(_OneByOne);

var _TwoLeft = require('./TwoLeft');

var _TwoLeft2 = _interopRequireDefault(_TwoLeft);

var _TwoTop = require('./TwoTop');

var _TwoTop2 = _interopRequireDefault(_TwoTop);

var _TwoRight = require('./TwoRight');

var _TwoRight2 = _interopRequireDefault(_TwoRight);

var _TwoBottom = require('./TwoBottom');

var _TwoBottom2 = _interopRequireDefault(_TwoBottom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function layoutsWidget(props) {
  var onLayoutChange = function onLayoutChange(event) {
    return props.onChange(event.currentTarget.getAttribute('name'));
  };

  return _react2.default.createElement(
    'section',
    { className: props.className },
    _react2.default.createElement(_TwoByTwo2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_OneByTwo2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_TwoByOne2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_OneByOne2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_TwoLeft2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_TwoTop2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_TwoRight2.default, { active: props.active, onClick: onLayoutChange }),
    _react2.default.createElement(_TwoBottom2.default, { active: props.active, onClick: onLayoutChange })
  );
}

layoutsWidget.propTypes = {
  onChange: _react2.default.PropTypes.func,
  active: _react2.default.PropTypes.string,
  className: _react2.default.PropTypes.string
};

layoutsWidget.defaultProps = {
  onChange: function onChange() {}
};