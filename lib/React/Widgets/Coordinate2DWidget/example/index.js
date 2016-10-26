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

    var height = 100,
        width = 100;

    _reactDom2.default.render(_react2.default.createElement(_2.default, { height: height, width: width, onChange: console.log, hideXY: true }), document.querySelector('.content'));
});