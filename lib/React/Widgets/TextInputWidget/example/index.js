define(['..', 'react', 'react-dom', 'normalize.css'], function (_, _react, _reactDom) {
    'use strict';

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var container = document.querySelector('.content'),
        textValue = 'Some text example...';

    // Load CSS


    document.body.style.padding = '10px';

    function onChange(value, name) {
        render(name, value);
        console.log(name, ' => ', value);
    }

    function render(name, value) {
        _reactDom2.default.render(_react2.default.createElement(_2.default, { name: name, value: value, onChange: onChange }), container);
    }

    render('example', textValue);
});