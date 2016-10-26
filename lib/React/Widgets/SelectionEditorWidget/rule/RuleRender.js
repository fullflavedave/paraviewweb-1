'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ruleRender;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _OperatorRender = require('./OperatorRender');

var _OperatorRender2 = _interopRequireDefault(_OperatorRender);

var _FiveClauseRender = require('./FiveClauseRender');

var _FiveClauseRender2 = _interopRequireDefault(_FiveClauseRender);

var _DepthMatchingRender = require('../DepthMatchingRender');

var _DepthMatchingRender2 = _interopRequireDefault(_DepthMatchingRender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ruleRender(props) {
  var ruleSelector = props.rule.type;
  if (ruleSelector === 'logical') {
    return _react2.default.createElement(_OperatorRender2.default, {
      className: props.className,
      getLegend: props.getLegend,

      onChange: props.onChange,
      onDelete: props.onDelete,

      rule: props.rule,
      depth: props.depth,
      maxDepth: props.maxDepth,
      path: props.path
    });
  }
  if (ruleSelector === '5C') {
    return _react2.default.createElement(
      _DepthMatchingRender2.default,
      { depth: props.depth, maxDepth: props.maxDepth },
      _react2.default.createElement(_FiveClauseRender2.default, {
        getLegend: props.getLegend,

        onChange: props.onChange,
        onDelete: props.onDelete,

        rule: props.rule,
        depth: props.depth,
        maxDepth: props.maxDepth,
        path: props.path
      })
    );
  }
  return null;
}

ruleRender.propTypes = {
  className: _react2.default.PropTypes.string,
  rule: _react2.default.PropTypes.object,
  depth: _react2.default.PropTypes.number,
  maxDepth: _react2.default.PropTypes.number,
  path: _react2.default.PropTypes.array,
  onChange: _react2.default.PropTypes.func,
  onDelete: _react2.default.PropTypes.func,
  getLegend: _react2.default.PropTypes.func
};