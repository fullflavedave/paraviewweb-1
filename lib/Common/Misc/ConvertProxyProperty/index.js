'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.proxyPropToProp = proxyPropToProp;
exports.proxyToProps = proxyToProps;
var typeMapping = {
  textfield: 'Cell',
  slider: 'Slider',
  'list-n': 'Enum',
  'list-1': 'Enum',
  checkbox: 'Checkbox',
  textarea: 'Cell'
};

function extractSize(ui) {
  if (ui.widget === 'list-n') {
    return -1;
  }
  return ui.size;
}

function extractLayout(ui) {
  if (ui.size === 0 || ui.size === -1 || ui.widget === 'list-n') {
    return '-1';
  }

  if (ui.size < 4) {
    return ui.size.toString();
  }

  if (ui.widget === 'list-1') {
    return '1';
  }

  if (ui.size === 6) {
    if (ui.name.toLowerCase().indexOf('bound')) {
      return '3x2';
    }
    if (ui.name.toLowerCase().indexOf('range')) {
      return '3x2';
    }
    console.log('What is the layout for', ui);
    return '2x3';
  }
  console.log('Could not find layout for', ui);
  return 'NO_LAYOUT';
}

function extractType(ui) {
  if (ui.type === 'proxy') {
    return 'string';
  }
  return ui.type;
}

function extractDomain(ui) {
  if (ui.values) {
    if (Array.isArray(ui.values)) {
      var _ret = function () {
        var domain = {};
        ui.values.forEach(function (txt) {
          domain[txt] = txt;
        });
        return {
          v: domain
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    if (ui.type === 'proxy') {
      var _ret2 = function () {
        var domain = {};
        Object.keys(ui.values).forEach(function (key) {
          domain[key] = key;
        });
        return {
          v: domain
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
    return ui.values;
  }

  if (ui.range) {
    return { range: ui.range };
  }

  return {};
}

function proxyPropToProp(property, ui) {
  if (!typeMapping[ui.widget]) {
    console.log('No propType for', ui);
  }

  var depList = ui.depends ? ui.depends.split(':') : null;
  var depStatus = depList ? Boolean(Number(depList.pop())) : true;
  var depValue = depList ? depList.pop() : null;
  var depId = depList ? depList.join(':') : null;
  var searchString = [ui.name].concat(property.value).join(' ').toLowerCase();

  return {
    show: function show(ctx) {
      if (depId && ctx.properties[depId] !== undefined) {
        return ctx.properties[depId][0] === depValue ? depStatus : !depStatus;
      }
      if (ctx.filter && ctx.filter.length) {
        var _ret3 = function () {
          var queries = ctx.filter.toLowerCase().split(' ');
          var match = true;

          queries.forEach(function (q) {
            match = match && searchString.indexOf(q) !== -1;
          });

          return {
            v: match
          };
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
      }
      return !!ctx.advanced || !ui.advanced;
    },

    ui: {
      propType: typeMapping[ui.widget] || ui.widget,
      label: ui.name,
      help: ui.doc,
      noEmpty: true,
      layout: extractLayout(ui),
      type: extractType(ui),
      domain: extractDomain(ui),
      componentLabels: [],
      size: extractSize(ui)
    },
    data: {
      id: [property.id, property.name].join(':'),
      value: [].concat(property.value),
      size: ui.size
    }
  };
}

function proxyToProps(proxy) {
  return proxy.properties.map(function (property, index) {
    return proxyPropToProp(property, proxy.ui[index]);
  });
}

exports.default = {
  proxyToProps: proxyToProps,
  proxyPropToProp: proxyPropToProp
};