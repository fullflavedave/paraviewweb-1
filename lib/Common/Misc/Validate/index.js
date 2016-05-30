'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integer = integer;
exports.double = double;
exports.string = string;
exports.boolean = boolean;
function integer(val) {
  return Number.isInteger(parseInt(val, 10));
}

function double(val) {
  return !isNaN(parseFloat(val));
}

function string(val) {
  return typeof val === 'string' || val instanceof String;
}

function boolean(val) {
  return typeof val === 'boolean';
}

exports.default = {
  integer: integer, int: integer,
  double: double, dbl: double, float: double,
  string: string, str: string,
  boolean: boolean, bool: boolean
};