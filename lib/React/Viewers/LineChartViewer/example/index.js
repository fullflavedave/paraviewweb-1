'use strict';

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load CSS
require('normalize.css');

// Get react component
var container = document.querySelector('.content'),
    data = { xRange: [-10, 123], fields: [] };

function createField(name, size, scale) {
    var data = [];
    for (var i = 0; i < size; i++) {
        data.push(Math.random() * scale * 0.1 + Math.sin(i / size * Math.PI * 4) * scale);
    }
    return { name: name, data: data };
}

data.fields.push(createField('Temperature', 500, 30));
data.fields.push(createField('Pressure', 500, 500));
data.fields.push(createField('Salinity', 500, 1));

container.style.width = '100%';
container.style.height = '100%';
container.style.position = 'absolute';
container.style.padding = '0';
// container.style.margin = '10px';
// container.style.border = 'solid 1px black';

_reactDom2.default.render(_react2.default.createElement(_2.default, { data: data, width: 500, height: 300 }), container);