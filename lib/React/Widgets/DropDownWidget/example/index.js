define(['..', 'react', 'react-dom'], function (_, _react, _reactDom) {
    'use strict';

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    document.body.style.padding = '10px';

    function onChange(field) {
        console.log(field);
    }

    var container = document.querySelector('.content'),
        fields = ['Temperature', 'Pressure', 'Velocity'];

    container.style.width = '100px';

    (0, _reactDom.render)(_react2.default.createElement(_2.default, {
        field: fields[1],
        fields: fields,
        onChange: onChange
    }), container);
});