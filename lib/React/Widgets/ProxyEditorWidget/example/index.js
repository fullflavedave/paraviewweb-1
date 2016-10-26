define(['react', 'react-dom', '..', './source-proxy.json', './representation-proxy.json', './view-proxy.json', 'babel-polyfill', 'normalize.css'], function (_react, _reactDom, _, _sourceProxy, _representationProxy, _viewProxy) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _2 = _interopRequireDefault(_);

    var _sourceProxy2 = _interopRequireDefault(_sourceProxy);

    var _representationProxy2 = _interopRequireDefault(_representationProxy);

    var _viewProxy2 = _interopRequireDefault(_viewProxy);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var container = document.querySelector('.content'),
        sections = [Object.assign({ name: 'source', collapsed: false }, _sourceProxy2.default), Object.assign({ name: 'representation', collapsed: true }, _representationProxy2.default), Object.assign({ name: 'view', collapsed: true }, _viewProxy2.default)];

    _reactDom2.default.render(_react2.default.createElement(_2.default, { sections: sections }), container);

    document.body.style.margin = '10px';
});