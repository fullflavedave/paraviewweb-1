"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integer = integer;
exports.double = double;
exports.string = string;
exports.boolean = boolean;
exports.proxy = proxy;
function integer(val) {
  if (Array.isArray(val)) {
    return val.map(function (v) {
      return parseInt(v, 10);
    });
  }
  return parseInt(val, 10);
}

function double(val) {
  if (Array.isArray(val)) {
    return val.map(function (v) {
      return parseFloat(v);
    });
  }
  return parseFloat(val);
}

function string(val) {
  if (Array.isArray(val)) {
    return val.map(function (v) {
      return String(v);
    });
  }
  return String(val);
}

function boolean(val) {
  if (Array.isArray(val)) {
    return val.map(function (v) {
      return Boolean(v);
    });
  }
  return Boolean(val);
}

function proxy(val) {
  return val;
}

exports.default = {
  integer: integer,
  int: integer,

  double: double,
  dbl: double,
  float: double,

  string: string,
  str: string,

  boolean: boolean,
  bool: boolean,

  proxy: proxy
};