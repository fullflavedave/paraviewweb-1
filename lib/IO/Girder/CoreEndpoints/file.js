define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (_ref) {
    var

    /* eslint-disable no-underscore-dangle */
    client = _ref.client;
    var filterQuery = _ref.filterQuery;
    var mustContain = _ref.mustContain;
    var busy = _ref.busy;
    var encodeQueryAsString = _ref.encodeQueryAsString;
    var progress = _ref.progress;

    function uploadChunk(uploadId, offset, chunk) {
      return new Promise(function (resolve, reject) {
        var data = new FormData();
        data.append('uploadId', uploadId);
        data.append('offset', offset);
        data.append('chunk', chunk);

        var xhr = new XMLHttpRequest();

        function extractResponse(ctx) {
          return {
            ctx: ctx,
            data: JSON.parse(xhr.responseText),
            status: xhr.status,
            statusText: xhr.statusText,
            headers: {},
            config: {}
          };
        }

        xhr.addEventListener('progress', function (event) {
          if (event.lengthComputable) {
            var complete = event.loaded / event.total;
            console.log('chunk progress', complete);
          }
        });
        xhr.addEventListener('load', function (event) {
          resolve(extractResponse('load'));
        });
        xhr.addEventListener('error', function (event) {
          console.log('Transfer as failed', event);
          reject(extractResponse('error'));
        });
        xhr.addEventListener('abort', function (event) {
          console.log('Transfer as been canceled', event);
          reject(extractResponse('abort'));
        });

        xhr.open('POST', client.baseURL + '/file/chunk', true);
        xhr.responseType = 'text';
        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Girder-Token', client.token);
        xhr.send(data);
      });
    }

    function uploadFileToItem(params, file) {
      var fileId = file.name + '_' + file.lastModified;
      // upload file to item
      return new Promise(function (resolve, reject) {
        busy(client._.post('/file' + encodeQueryAsString(params))).then(function (upload) {
          var chunkSize = 10 * 1024 * 1024,
              _uploadNextChunk;

          _uploadNextChunk = function uploadNextChunk(offset) {
            var blob;
            progress(fileId, offset, file.size);
            if (offset + chunkSize >= file.size) {
              blob = file.slice(offset);
              uploadChunk(upload.data._id, offset, blob).then(function (uploadResp) {
                progress(fileId, file.size, file.size);
                resolve(uploadResp);
              }).catch(function (error) {
                console.warn('could not upload final chunk');
                console.warn(error);
                reject(error);
              });
            } else {
              blob = file.slice(offset, offset + chunkSize);
              uploadChunk(upload.data._id, offset, blob).then(function (uploadResp) {
                _uploadNextChunk(offset + chunkSize);
              }).catch(function (error) {
                console.warn('could not upload chunk');
                console.warn(error);
                reject(error);
              });
            }
          };
          _uploadNextChunk(0);
        }).catch(function (error) {
          console.warn('Could not upload file');
          console.warn(error);
          reject(error);
        });
      });
    }

    return {
      uploadChunk: uploadChunk,

      uploadFileToItem: uploadFileToItem,

      getUploadOffset: function getUploadOffset(id) {
        return busy(client._.get('/file/offset', { params: { uploadId: id } }));
      },
      downloadFile: function downloadFile(id, offset, endByte, contentDisposition) {
        var params = { offset: offset, endByte: endByte, contentDisposition: contentDisposition };
        Object.keys(params).forEach(function (key) {
          if (params[key] === null) {
            delete params[key];
          }
        });
        return busy(client._.get('/file/' + id + '/download' + encodeQueryAsString(params)));
      },
      updateFileContent: function updateFileContent(id, size) {
        return busy(client._.put('/file/' + id + '/contents?size=' + size));
      },
      deleteFile: function deleteFile(id) {
        return busy(client._.delete('/file/' + id));
      },
      editFile: function editFile(file) {
        var expected = ['name', 'mimeType'];
        var params = filterQuery.apply(undefined, [file].concat(expected));

        var _mustContain = mustContain(file, '_id');

        var missingKeys = _mustContain.missingKeys;
        var promise = _mustContain.promise;


        return missingKeys ? promise : busy(client._.put('/file/' + file._id + encodeQueryAsString(params)));
      },
      newFile: function newFile(file) {
        var expected = ['parentType', 'parentId', 'name', 'size', 'mimeType', 'linkUrl'];
        var params = filterQuery.apply(undefined, [file].concat(expected));

        var _mustContain2 = mustContain(file, 'parentType', 'parentId', 'name');

        var missingKeys = _mustContain2.missingKeys;
        var promise = _mustContain2.promise;


        return missingKeys ? promise : busy(client._.post('/file' + encodeQueryAsString(params)));
      }
    };
  };
});