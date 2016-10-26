define(['..', '../../../../Common/Misc/SizeHelper', '../../../../IO/WebSocket/SmartConnect', '../../../../IO/WebSocket/ParaViewWebClient'], function (_, _SizeHelper, _SmartConnect, _ParaViewWebClient) {
  'use strict';

  var _2 = _interopRequireDefault(_);

  var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

  var _SmartConnect2 = _interopRequireDefault(_SmartConnect);

  var _ParaViewWebClient2 = _interopRequireDefault(_ParaViewWebClient);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  document.body.style.padding = '0';
  document.body.style.margin = '0';

  var divRenderer = document.createElement('div');
  document.body.appendChild(divRenderer);

  divRenderer.style.position = 'relative';
  divRenderer.style.width = '100vw';
  divRenderer.style.height = '100vh';
  divRenderer.style.overflow = 'hidden';

  var config = { sessionURL: 'ws://localhost:1234/ws' };
  var smartConnect = new _SmartConnect2.default(config);
  smartConnect.onConnectionReady(function (connection) {
    var pvwClient = _ParaViewWebClient2.default.createClient(connection, ['MouseHandler', 'ViewPort', 'ViewPortImageDelivery']);
    var renderer = new _2.default(pvwClient);
    renderer.setContainer(divRenderer);
    renderer.onImageReady(function () {
      console.log('We are good');
    });
    window.renderer = renderer;
    _SizeHelper2.default.onSizeChange(function () {
      renderer.resize();
    });
    _SizeHelper2.default.startListening();
  });
  smartConnect.connect();
});