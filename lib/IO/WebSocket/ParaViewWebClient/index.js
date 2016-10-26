'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClient = createClient;

var _ColorManager = require('./ColorManager');

var _ColorManager2 = _interopRequireDefault(_ColorManager);

var _FileListing = require('./FileListing');

var _FileListing2 = _interopRequireDefault(_FileListing);

var _KeyValuePairStore = require('./KeyValuePairStore');

var _KeyValuePairStore2 = _interopRequireDefault(_KeyValuePairStore);

var _MouseHandler = require('./MouseHandler');

var _MouseHandler2 = _interopRequireDefault(_MouseHandler);

var _ProxyManager = require('./ProxyManager');

var _ProxyManager2 = _interopRequireDefault(_ProxyManager);

var _SaveData = require('./SaveData');

var _SaveData2 = _interopRequireDefault(_SaveData);

var _TimeHandler = require('./TimeHandler');

var _TimeHandler2 = _interopRequireDefault(_TimeHandler);

var _ViewPort = require('./ViewPort');

var _ViewPort2 = _interopRequireDefault(_ViewPort);

var _ViewPortGeometryDelivery = require('./ViewPortGeometryDelivery');

var _ViewPortGeometryDelivery2 = _interopRequireDefault(_ViewPortGeometryDelivery);

var _ViewPortImageDelivery = require('./ViewPortImageDelivery');

var _ViewPortImageDelivery2 = _interopRequireDefault(_ViewPortImageDelivery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var protocolsMap = {
  ColorManager: _ColorManager2.default,
  FileListing: _FileListing2.default,
  KeyValuePairStore: _KeyValuePairStore2.default,
  MouseHandler: _MouseHandler2.default,
  ProxyManager: _ProxyManager2.default,
  SaveData: _SaveData2.default,
  TimeHandler: _TimeHandler2.default,
  ViewPort: _ViewPort2.default,
  ViewPortGeometryDelivery: _ViewPortGeometryDelivery2.default,
  ViewPortImageDelivery: _ViewPortImageDelivery2.default
};

function createClient(connection) {
  var protocols = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var customProtocols = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var session = connection.getSession(),
      result = {
    connection: connection, session: session
  },
      count = protocols.length;

  while (count) {
    count -= 1;
    var name = protocols[count];
    result[name] = protocolsMap[name](session);
  }

  Object.keys(customProtocols).forEach(function (key) {
    result[key] = customProtocols[key](session);
  });

  return result;
}

exports.default = {
  createClient: createClient
};