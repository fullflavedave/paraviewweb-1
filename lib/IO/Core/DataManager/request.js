'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Generic request handler
function makeRequest(url, handler) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = handler.type;

  xhr.onload = function onLoad(e) {
    if (this.status === 200) {
      handler.fn(null, xhr);
      return;
    }
    handler.fn(e, xhr);
  };
  xhr.onerror = function onError(e) {
    handler.fn(e, xhr);
  };
  xhr.send();
}

// Array buffer handler
function arraybufferHandler(callback) {
  return {
    type: 'arraybuffer',
    fn: function fn(error, xhrObject) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, xhrObject.response);
    }
  };
}

// Text handler
function textHandler(callback) {
  return {
    type: 'text',
    fn: function fn(error, xhrObject) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, xhrObject.response);
    }
  };
}

// JSON handler
function jsonHandler(callback) {
  return {
    type: 'text',
    fn: function fn(error, xhrObject) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, JSON.parse(xhrObject.response));
    }
  };
}

// Blob handler
function blobHandler(mimeType, callback) {
  return {
    type: 'blob',
    fn: function fn(error, xhrObject) {
      if (error) {
        callback(error);
        return;
      }

      var blob = new Blob([xhrObject.response], {
        type: mimeType
      });
      callback(null, blob);
    }
  };
}

// Fetch methods

function fetchJSON(url, callback) {
  makeRequest(url, jsonHandler(callback));
}

function fetchTxt(url, callback) {
  makeRequest(url, textHandler(callback));
}

function fetchBlob(url, mimeType, callback) {
  makeRequest(url, blobHandler(mimeType, callback));
}

function fetchArray(url, callback) {
  makeRequest(url, arraybufferHandler(callback));
}

// Export fetch methods
exports.default = {
  fetchJSON: fetchJSON,
  fetchTxt: fetchTxt,
  fetchBlob: fetchBlob,
  fetchArray: fetchArray
};