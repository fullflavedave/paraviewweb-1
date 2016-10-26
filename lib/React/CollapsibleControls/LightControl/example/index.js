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

    document.body.style.padding = '10px';

    var state = {
        enabled: true,
        properties: {
            lightTerms: {
                ka: 1,
                kd: 0.3,
                ks: 0.5,
                alpha: 0
            },
            lightPosition: {
                x: 0,
                y: 0
            }
        }
    },
        light = {
        getLightProperties: function getLightProperties() {
            return state.properties;
        },
        setLightProperties: function setLightProperties(_ref) {
            var lightTerms = _ref.lightTerms;
            var lightPosition = _ref.lightPosition;

            if (lightPosition) {
                state.properties.lightPosition = lightPosition;
                console.log(lightPosition);
            }
            if (lightTerms) {
                state.properties.lightTerms = lightTerms;
                console.log(lightTerms);
            }
        },
        setLightingEnabled: function setLightingEnabled(e) {
            console.log('enable', e);
            state.enabled = e;
        },
        getLightingEnabled: function getLightingEnabled() {
            return state.enabled;
        }
    };

    _reactDom2.default.render(_react2.default.createElement(_2.default, { light: light }), document.querySelector('.content'));
});