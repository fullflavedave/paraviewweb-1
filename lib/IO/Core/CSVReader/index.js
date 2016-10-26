define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function parseCsv(csvText) {
    var lines = csvText.split('\n');
    var columnNames = lines[0].split(',');
    var columns = [];

    for (var colIdx = 0; colIdx < columnNames.length; ++colIdx) {
      columnNames[colIdx] = columnNames[colIdx].replace(/[\s"]/g, ' ').trim();
      columns.push([]);
    }

    for (var rowIdx = 1; rowIdx < lines.length; ++rowIdx) {
      var cells = lines[rowIdx].split(',');
      for (var _colIdx = 0; _colIdx < cells.length; ++_colIdx) {
        columns[_colIdx].push(cells[_colIdx].replace(/[\s"]/g, ' ').trim());
      }
    }

    return {
      numRows: lines.length - 1,
      numCols: columnNames.length,
      colNames: columnNames,
      columns: columns
    };
  }

  var CSVReader = function () {
    function CSVReader(csvContent) {
      _classCallCheck(this, CSVReader);

      this.setData(csvContent);
    }

    _createClass(CSVReader, [{
      key: 'setData',
      value: function setData(csvContent) {
        this.data = parseCsv(csvContent);
      }
    }, {
      key: 'getNumberOfColumns',
      value: function getNumberOfColumns() {
        return this.data.numCols;
      }
    }, {
      key: 'getNumberOfRows',
      value: function getNumberOfRows() {
        return this.data.numRows;
      }
    }, {
      key: 'getColumnNames',
      value: function getColumnNames() {
        return this.data.colNames;
      }
    }, {
      key: 'getColumnByIndex',
      value: function getColumnByIndex(colIdx) {
        if (colIdx >= 0 && colIdx < this.getNumberOfColumns()) {
          return this.data.columns[colIdx];
        }
        throw new Error(colIdx + ' is outside the column range for this dataset.');
      }
    }, {
      key: 'getColumn',
      value: function getColumn(colName) {
        var colIdx = this.data.colNames.indexOf(colName);
        if (colIdx < 0) {
          throw new Error(colName + ': No such column found.');
        }
        return this.getColumnByIndex(colIdx);
      }
    }, {
      key: 'getRow',
      value: function getRow(rowIdx) {
        var row = [];

        for (var i = 0; i < this.getNumberOfColumns(); ++i) {
          row.push(this.getColumnByIndex(i)[rowIdx]);
        }

        return row;
      }
    }]);

    return CSVReader;
  }();

  exports.default = CSVReader;
});