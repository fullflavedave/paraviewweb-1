'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (data, ui, callback) {
  if (!ui.hasOwnProperty('layout')) {
    ui.layout = 'NO_LAYOUT';
  }

  if (!ui.hasOwnProperty('size')) {
    ui.size = 1;
  }

  if (!ui.hasOwnProperty('type')) {
    ui.type = 'string';
  }

  if (!ui.hasOwnProperty('domain')) {
    ui.domain = {};
  }

  var fn = layouts[ui.layout];
  if (fn) {
    return fn(data, ui, callback);
  }
  return null;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputCell = require('./InputCell');

var _InputCell2 = _interopRequireDefault(_InputCell);

var _CellProperty = require('PVWStyle/ReactProperties/CellProperty.mcss');

var _CellProperty2 = _interopRequireDefault(_CellProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arrayFill(arr, expectedLength) {
  var filler = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  if (!arr) {
    return Array(expectedLength).fill(filler);
  }

  while (arr.length < expectedLength) {
    arr.push(filler);
  }
  return arr;
}
/* eslint-disable */
var layouts = {
  1: function _(data, ui, callback) {
    ui.componentLabels = arrayFill(ui.componentLabels, 1);
    data.value = arrayFill(data.value, 1, null);
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  },
  2: function _(data, ui, callback) {
    ui.componentLabels = arrayFill(ui.componentLabels, 2);
    data.value = arrayFill(data.value, 2, null);
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 1, label: ui.componentLabels[1], type: ui.type, value: data.value[1], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  },
  3: function _(data, ui, callback) {
    ui.componentLabels = arrayFill(ui.componentLabels, 3);
    data.value = arrayFill(data.value, 3, null);
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 1, label: ui.componentLabels[1], type: ui.type, value: data.value[1], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 2, label: ui.componentLabels[2], type: ui.type, value: data.value[2], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  },
  '2x3': function x3(data, ui, callback) {
    ui.componentLabels = arrayFill(ui.componentLabels, 6);
    data.value = arrayFill(data.value, 6, null);
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_0' },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 1, label: ui.componentLabels[1], type: ui.type, value: data.value[1], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 2, label: ui.componentLabels[2], type: ui.type, value: data.value[2], name: data.name, domain: ui.domain, onChange: callback })
      ),
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_1' },
        _react2.default.createElement(_InputCell2.default, { idx: 3, label: ui.componentLabels[3], type: ui.type, value: data.value[3], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 4, label: ui.componentLabels[4], type: ui.type, value: data.value[4], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 5, label: ui.componentLabels[5], type: ui.type, value: data.value[5], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  },
  '3x2': function x2(data, ui, callback) {
    ui.componentLabels = arrayFill(ui.componentLabels, 6);
    data.value = arrayFill(data.value, 6, null);
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_0' },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 1, label: ui.componentLabels[1], type: ui.type, value: data.value[1], name: data.name, domain: ui.domain, onChange: callback })
      ),
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_1' },
        _react2.default.createElement(_InputCell2.default, { idx: 2, label: ui.componentLabels[2], type: ui.type, value: data.value[2], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 3, label: ui.componentLabels[3], type: ui.type, value: data.value[3], name: data.name, domain: ui.domain, onChange: callback })
      ),
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_2' },
        _react2.default.createElement(_InputCell2.default, { idx: 4, label: ui.componentLabels[4], type: ui.type, value: data.value[4], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 5, label: ui.componentLabels[5], type: ui.type, value: data.value[5], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  },
  m6: function m6(data, ui, callback) {
    ui.componentLabels = arrayFill(ui.componentLabels, 6);
    data.value = arrayFill(data.value, 6, null);
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_0' },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 1, label: ui.componentLabels[1], type: ui.type, value: data.value[1], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 2, label: ui.componentLabels[2], type: ui.type, value: data.value[2], name: data.name, domain: ui.domain, onChange: callback })
      ),
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_1' },
        _react2.default.createElement('td', null),
        _react2.default.createElement(_InputCell2.default, { idx: 3, label: ui.componentLabels[3], type: ui.type, value: data.value[3], name: data.name, domain: ui.domain, onChange: callback }),
        _react2.default.createElement(_InputCell2.default, { idx: 4, label: ui.componentLabels[4], type: ui.type, value: data.value[4], name: data.name, domain: ui.domain, onChange: callback })
      ),
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow, key: data.id + '_2' },
        _react2.default.createElement('td', null),
        _react2.default.createElement('td', null),
        _react2.default.createElement(_InputCell2.default, { idx: 5, label: ui.componentLabels[5], type: ui.type, value: data.value[5], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  },
  '-1': function _(data, ui, callback) {
    return _react2.default.createElement(
      'tbody',
      null,
      data.value.map(function (value, index) {
        return _react2.default.createElement(
          'tr',
          { key: [data.id, index].join('_'), className: _CellProperty2.default.inputRow },
          _react2.default.createElement(
            'td',
            null,
            _react2.default.createElement('i', { className: index ? _CellProperty2.default.deleteIcon : _CellProperty2.default.hidden,
              onClick: function onClick() {
                callback(index, null);
              } })
          ),
          _react2.default.createElement(_InputCell2.default, { idx: index, label: '', type: ui.type, value: value, name: data.name, domain: ui.domain, onChange: callback })
        );
      })
    );
  },
  NO_LAYOUT: function NO_LAYOUT(data, ui, callback) {
    return _react2.default.createElement(
      'tbody',
      null,
      _react2.default.createElement(
        'tr',
        { className: _CellProperty2.default.inputRow },
        _react2.default.createElement(_InputCell2.default, { idx: 0, label: ui.componentLabels[0], type: ui.type, value: data.value[0], name: data.name, domain: ui.domain, onChange: callback })
      )
    );
  }
};
/* eslint-enable */