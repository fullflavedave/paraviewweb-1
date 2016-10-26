'use strict';

var _tapeCatch = require('tape-catch');

var _tapeCatch2 = _interopRequireDefault(_tapeCatch);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------

(0, _tapeCatch2.default)('Query Data Model - Fetch/Notification', function (t) {
  var dataDescription = {
    type: ['tonic-query-data-model', 'slice-prober'],
    arguments: {
      time: {
        ui: 'slider',
        values: ['0', '1'],
        label: 'Time'
      }
    },
    arguments_order: ['time'],
    data: [{
      name: 'slice_0',
      type: 'blob',
      mimeType: 'image/png',
      pattern: '{time}/{field}_0.png'
    }, {
      name: 'slice_1',
      type: 'blob',
      mimeType: 'image/png',
      pattern: '{time}/{field}_1.png'
    }, {
      name: 'slice_2',
      type: 'blob',
      mimeType: 'image/png',
      pattern: '{time}/{field}_2.png'
    }],
    metadata: {
      title: 'Ocean simulation data',
      type: 'probe-slice',
      id: 'mpas-probe-data',
      description: 'Some simulation data from MPAS'
    },
    InSituDataProber: {
      slices: ['slice_0', 'slice_1', 'slice_2'],
      fields: ['temperature', 'salinity'],
      origin: [-180, -84, 0],
      sprite_size: 10,
      dimensions: [500, 250, 30],
      spacing: [0.72, 0.672, 4.0],
      ranges: {
        temperature: [-5, 30],
        salinity: [0, 38]
      }
    }
  };

  var numberOfRequests = 100;
  var queryDataModel = new _2.default(dataDescription, '/data/probe/');
  var fetchCount = 0;
  var notificationCount = 0;

  queryDataModel.onDataChange(function (data, envelope) {
    notificationCount++;
    t.ok(data && !data.error, 'callback ' + notificationCount);

    // Finish test
    if (numberOfRequests === notificationCount) {
      // console.log('Fetch/Notification: done with success');
      t.end();
    }
  });

  queryDataModel.setValue('field', 'temperature');

  var count = numberOfRequests;
  while (count--) {
    fetchCount++;
    t.comment('fetch ' + fetchCount);
    queryDataModel.fetchData();
  }
});

// ----------------------------------------------------------------------------

(0, _tapeCatch2.default)('Query Data Model - API/Query/Validation', function (t) {
  var dataDescription = {
    type: ['tonic-query-data-model'],
    arguments: {
      x: {
        values: ['0', '1', '2']
      },
      y: {
        values: ['0', '1', '2']
      }
    },
    arguments_order: ['x', 'y'],
    data: [{
      name: 'text',
      type: 'text',
      pattern: '{x}_{y}.txt'
    }, {
      name: 'json',
      type: 'json',
      pattern: '{x}_{y}.json'
    }]
  };

  var queryDataModel = new _2.default(dataDescription, '/base/data/dummy/');
  var expectedValues = ['X', 'O', 'X', 'O', 'O', 'X', 'X', 'X', 'O'];

  queryDataModel.onDataChange(function (data, envelope) {
    t.ok(data && !data.error, 'Valid data without error');
    var expected = expectedValues.shift();

    t.equal(data.json.data.value, expected, 'Validate data request');

    if (queryDataModel.next('x')) {
      queryDataModel.fetchData();
    } else if (queryDataModel.next('y')) {
      queryDataModel.first('x');
      queryDataModel.fetchData();
    } else {
      t.end();
    }
  });

  queryDataModel.fetchData();
});