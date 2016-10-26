define(['..', 'react', 'react-dom'], function (_, _react, _reactDom) {
  'use strict';

  var _2 = _interopRequireDefault(_);

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Accordion = _react2.default.createClass({

    displayName: 'Accordion',

    render: function render() {
      var mainStyle = {
        border: '1px solid grey'
      };

      return _react2.default.createElement(
        'main',
        { style: mainStyle },
        _react2.default.createElement(
          _2.default,
          { title: 'Charmander', subtitle: 'stage 1' },
          _react2.default.createElement('img', { src: 'http://media.giphy.com/media/Rs8APEp9KGBjy/giphy.gif' })
        ),
        _react2.default.createElement(
          _2.default,
          { title: 'Charmeleon', subtitle: 'stage 2', open: false },
          _react2.default.createElement('img', { src: 'http://media.giphy.com/media/ijnAEnJI6oZG0/giphy.gif' })
        ),
        _react2.default.createElement(
          _2.default,
          { title: 'Charizard', subtitle: 'final form', open: false },
          _react2.default.createElement('img', { src: 'http://media.giphy.com/media/11sXoLLZGXwcvu/giphy.gif' })
        )
      );
    }
  });

  _reactDom2.default.render(_react2.default.createElement(Accordion, null), document.querySelector('.content'));
});