define(['..', 'react', 'react-dom', 'normalize.css', 'font-awesome/css/font-awesome.css'], function (_, _react, _reactDom) {
    'use strict';

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var container = document.querySelector('.content');

    // Load CSS


    document.body.style.padding = '10px';
    document.body.style.background = '#ccc';

    _reactDom2.default.render(_react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            { style: {
                    position: 'relative',
                    width: '2em',
                    border: 'solid 1px black',
                    borderRadius: '5px'
                } },
            _react2.default.createElement(
                _2.default,
                { anchor: ['top', 'right'], position: ['top', 'left'] },
                _react2.default.createElement(
                    'div',
                    { style: {
                            padding: '50px',
                            background: 'red',
                            border: 'solid 1px black',
                            borderRadius: '5px'
                        } },
                    'Some content here'
                )
            ),
            _react2.default.createElement(
                _2.default,
                { anchor: ['bottom', 'left'], position: ['top', 'left'] },
                _react2.default.createElement(
                    'div',
                    { style: {
                            padding: '50px',
                            background: 'red',
                            border: 'solid 1px black',
                            borderRadius: '5px'
                        } },
                    'Some other here'
                )
            )
        )
    ), container);
});