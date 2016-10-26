define(['react', 'react-dom', '..', 'normalize.css'], function (_react, _reactDom, _) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _2 = _interopRequireDefault(_);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var operationValue = 'a+2/5';
    var operator = {
        getOperation: function getOperation() {
            return operationValue;
        },
        setOperation: function setOperation(v) {
            operationValue = v;
        }
    },
        container = document.querySelector('.content');

    _reactDom2.default.render(_react2.default.createElement(_2.default, { operator: operator }), container);

    document.body.style.margin = '10px';
});