define(['exports', '../Observable', '../Debounce'], function (exports, _Observable, _Debounce) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Observable2 = _interopRequireDefault(_Observable);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* eslint-disable no-use-before-define */

  /* global window */

  var observableInstance = new _Observable2.default();
  var TOPIC = 'window.size.change';
  var domSizes = new WeakMap();
  var sizeProperties = ['scrollWidth', 'scrollHeight', 'clientWidth', 'clientHeight'];
  var windowListener = (0, _Debounce.debounce)(invalidateSize, 250);

  var timestamp = 0;
  var listenerAttached = false;

  // ------ internal functions ------

  function updateSize(domElement, cacheObj) {
    if (cacheObj.timestamp < timestamp) {
      sizeProperties.forEach(function (prop) {
        cacheObj[prop] = domElement[prop];
      });
      cacheObj.clientRect = domElement.getClientRects()[0];
    }
  }

  // ------ New API ------

  function getSize(domElement) {
    var clearCache = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var cachedSize = domSizes.get(domElement);
    if (!cachedSize || clearCache) {
      cachedSize = { timestamp: -1 };
      domSizes.set(domElement, cachedSize);
    }
    updateSize(domElement, cachedSize);

    return cachedSize;
  }

  function onSizeChange(callback) {
    return observableInstance.on(TOPIC, callback);
  }

  function triggerChange() {
    observableInstance.emit(TOPIC);
  }

  function isListening() {
    return listenerAttached;
  }

  function startListening() {
    if (!listenerAttached) {
      window.addEventListener('resize', windowListener);
      listenerAttached = true;
    }
  }

  function stopListening() {
    if (listenerAttached) {
      window.removeEventListener('resize', windowListener);
      listenerAttached = false;
    }
  }

  // ------ internal functions ------

  function invalidateSize() {
    timestamp += 1;
    triggerChange();
  }

  // Export
  exports.default = {
    getSize: getSize,
    isListening: isListening,
    onSizeChange: onSizeChange,
    startListening: startListening,
    stopListening: stopListening,
    triggerChange: triggerChange
  };
});