define(['..', 'react', 'react-dom', '../../../../../documentation/images/ui.png', 'font-awesome/css/font-awesome.css', 'normalize.css'], function (_, _react, _reactDom, logo) {
    'use strict';

    var _2 = _interopRequireDefault(_);

    var _react2 = _interopRequireDefault(_react);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function onChange(obj, idx) {
        console.log('Active', obj, idx);
    }

    (0, _reactDom.render)(_react2.default.createElement(_2.default, {
        activeColor: 'red',
        defaultColor: 'green',
        height: '0.75em',
        options: [{ label: 'First' }, { label: 'A' }, { label: 'B' }, { label: 'C' }, { img: logo }, { icon: 'fa fa-twitter' }, { label: 'Last' }],
        onChange: onChange
    }), document.querySelector('.content'));
});