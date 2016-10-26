define(['react', 'react-dom', '..', 'babel-polyfill'], function (_react, _reactDom, _) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _2 = _interopRequireDefault(_);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var container = document.querySelector('.content');

  container.style.height = "50%";
  container.style.width = "50%";

  var PieceWiseTestWidget = _react2.default.createClass({
    displayName: 'PieceWiseTestWidget',

    getInitialState: function getInitialState() {
      return {
        points: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      };
    },
    updatePoints: function updatePoints(points) {
      this.setState({ points: points });
      console.log(points);
    },
    render: function render() {
      return _react2.default.createElement(_2.default, {
        points: this.state.points,
        rangeMin: 0,
        rangeMax: 100,
        onChange: this.updatePoints,
        visible: true
      });
    }
  });

  _reactDom2.default.render(_react2.default.createElement(PieceWiseTestWidget, {}), container);

  document.body.style.margin = '10px';
});