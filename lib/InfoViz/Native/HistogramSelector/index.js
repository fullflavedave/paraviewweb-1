define(['exports', 'd3', 'PVWStyle/InfoVizNative/HistogramSelector.mcss', '../../../Common/Core/CompositeClosureHelper', '../../Core/D3MultiClick', './score'], function (exports, _d2, _HistogramSelector, _CompositeClosureHelper, _D3MultiClick, _score) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.extend = extend;

  var _d3 = _interopRequireDefault(_d2);

  var _HistogramSelector2 = _interopRequireDefault(_HistogramSelector);

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _D3MultiClick2 = _interopRequireDefault(_D3MultiClick);

  var _score2 = _interopRequireDefault(_score);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  // ----------------------------------------------------------------------------
  // Histogram Selector
  // ----------------------------------------------------------------------------
  //
  // This component is designed to display histograms in a grid and support
  // user selection of histograms. The idea being to allow the user to view
  // histograms for a large number of parameters and then select some of
  // those parameters to use in further visualizations.
  //
  // Due to the large number of DOM elements a histogram can have, we modify
  // the standard D3 graph approach to reuse DOM elements as the histograms
  // scroll offscreen.  This way we can support thousands of histograms
  // while only creating enough DOM elements to fill the screen.
  //
  // A Transform is used to reposition existing DOM elements as they
  // are reused. Supposedly this is a fast operation. The idea comes from
  // http://bl.ocks.org/gmaclennan/11130600 among other examples.
  // Reuse happens at the row level.
  //
  // The minBoxSize variable controls the smallest width that a box
  // (histogram) will use. This code will fill its container with the
  // smallest size histogram it can that does not exceed this limit and
  // provides an integral number of histograms across the container's width.
  //

  function histogramSelector(publicAPI, model) {
    // in contact-sheet mode, specify the smallest width a histogram can shrink
    // to before fewer histograms are created to fill the container's width
    var minBoxSize = 200;
    // smallest we'll let it go. Limits boxesPerRow in header GUI.
    var minBoxSizeLimit = 115;
    var legendSize = 15;
    // hard coded because I did not figure out how to
    // properly query this value from our container.
    var borderSize = 6;
    // 8? for linux/firefox, 16 for win10/chrome (hi-res screen)
    var scrollbarWidth = 16;

    var displayOnlySelected = false;

    var lastNumFields = 0;

    var scoreHelper = (0, _score2.default)(publicAPI, model);

    // This function modifies the Transform property
    // of the rows of the grid. Instead of creating new
    // rows filled with DOM elements. Inside histogramSelector()
    // to make sure document.head/body exists.
    var transformCSSProp = function tcssp(property) {
      var prefixes = ['webkit', 'ms', 'Moz', 'O'];
      var i = -1;
      var n = prefixes.length;
      var s = document.head ? document.head.style : document.body ? document.body.style : null;

      if (s === null || property.toLowerCase() in s) {
        return property.toLowerCase();
      }

      /* eslint-disable no-plusplus */
      while (++i < n) {
        if (prefixes[i] + property in s) {
          return '-' + prefixes[i].toLowerCase() + property.replace(/([A-Z])/g, '-$1').toLowerCase();
        }
      }
      /* eslint-enable no-plusplus */

      return false;
    }('Transform');

    // Apply our desired attributes to the grid rows
    function styleRows(selection, self) {
      selection.classed(_HistogramSelector2.default.row, true).style('height', self.rowHeight + 'px').style(transformCSSProp, function (d, i) {
        return 'translate3d(0,' + d.key * self.rowHeight + 'px,0)';
      });
    }

    // apply our desired attributes to the boxes of a row
    function styleBoxes(selection, self) {
      selection.style('width', self.boxWidth + 'px').style('height', self.boxHeight + 'px')
      // .style('margin', `${self.boxMargin / 2}px`)
      ;
    }

    publicAPI.svgWidth = function () {
      return model.histWidth + model.histMargin.left + model.histMargin.right;
    };
    publicAPI.svgHeight = function () {
      return model.histHeight + model.histMargin.top + model.histMargin.bottom;
    };

    function getClientArea() {
      var clientRect = model.listContainer.getBoundingClientRect();
      return [clientRect.width - borderSize - scrollbarWidth, clientRect.height - borderSize];
    }

    function updateSizeInformation(singleMode) {
      var updateBoxPerRow = false;

      var boxMargin = 3; // outside the box dimensions
      var boxBorder = 3; // included in the box dimensions, visible border

      // Get the client area size
      var dimensions = getClientArea();

      // compute key values based on our new size
      var boxesPerRow = singleMode ? 1 : Math.max(1, Math.floor(dimensions[0] / minBoxSize));
      model.boxWidth = Math.floor(dimensions[0] / boxesPerRow) - 2 * boxMargin;
      if (boxesPerRow === 1) {
        // use 3 / 4 to make a single hist wider than it is tall.
        model.boxHeight = Math.min(Math.floor((model.boxWidth + 2 * boxMargin) * (3 / 4) - 2 * boxMargin), Math.floor(dimensions[1] - 2 * boxMargin));
      } else {
        model.boxHeight = model.boxWidth;
      }
      model.rowHeight = model.boxHeight + 2 * boxMargin;
      model.rowsPerPage = Math.ceil(dimensions[1] / model.rowHeight);

      if (boxesPerRow !== model.boxesPerRow) {
        updateBoxPerRow = true;
        model.boxesPerRow = boxesPerRow;
      }

      model.histWidth = model.boxWidth - boxBorder * 2 - model.histMargin.left - model.histMargin.right;
      // other row size, probably a way to query for this
      var otherRowHeight = 21;
      model.histHeight = model.boxHeight - boxBorder * 2 - otherRowHeight - model.histMargin.top - model.histMargin.bottom;

      return updateBoxPerRow;
    }

    // which row of model.nest does this field name reside in?
    function getFieldRow(name) {
      if (model.nest === null) return 0;
      var foundRow = model.nest.reduce(function (prev, item, i) {
        var val = item.value.filter(function (def) {
          return def.name === name;
        });
        if (val.length > 0) {
          return item.key;
        }
        return prev;
      }, 0);
      return foundRow;
    }

    function getCurrentFieldNames() {
      var fieldNames = [];
      // Initialize fields
      if (model.provider.isA('FieldProvider')) {
        fieldNames = !displayOnlySelected ? model.provider.getFieldNames() : model.provider.getActiveFieldNames();
      }
      fieldNames = scoreHelper.filterFieldNames(fieldNames);
      return fieldNames;
    }

    var fieldHeaderClick = function fieldHeaderClick(d) {
      displayOnlySelected = !displayOnlySelected;
      publicAPI.render();
    };

    function incrNumBoxes(amount) {
      if (model.singleModeName !== null) return;
      // Get the client area size
      var dimensions = getClientArea();
      var maxNumBoxes = Math.floor(dimensions[0] / minBoxSizeLimit);
      var newBoxesPerRow = Math.min(maxNumBoxes, Math.max(1, model.boxesPerRow + amount));

      // if we actually changed, re-render, letting updateSizeInformation actually change dimensions.
      if (newBoxesPerRow !== model.boxesPerRow) {
        // compute a reasonable new minimum for box size based on the current container dimensions.
        // Midway between desired and next larger number of boxes, except at limit.
        var newMinBoxSize = newBoxesPerRow === maxNumBoxes ? minBoxSizeLimit : Math.floor(0.5 * (dimensions[0] / newBoxesPerRow + dimensions[0] / (newBoxesPerRow + 1)));
        minBoxSize = newMinBoxSize;
        publicAPI.render();
      }
    }

    // let the caller set a specific number of boxes/row, within our normal size constraints.
    publicAPI.requestNumBoxesPerRow = function (count) {
      model.singleModeName = null;
      model.singleModeSticky = false;
      incrNumBoxes(count - model.boxesPerRow);
    };

    function changeSingleField(direction) {
      if (model.singleModeName === null) return;
      var fieldNames = getCurrentFieldNames();
      if (fieldNames.length === 0) return;

      var index = fieldNames.indexOf(model.singleModeName);
      if (index === -1) index = 0;else index = (index + direction) % fieldNames.length;
      if (index < 0) index = fieldNames.length - 1;

      model.singleModeName = fieldNames[index];
      lastNumFields = 0;
      publicAPI.render();
    }

    function createHeader(divSel) {
      var header = divSel.append('div').classed(_HistogramSelector2.default.header, true).style('height', model.headerSize + 'px').style('line-height', model.headerSize + 'px');
      header.append('span').on('click', fieldHeaderClick).append('i').classed(_HistogramSelector2.default.jsFieldsIcon, true);
      header.append('span').classed(_HistogramSelector2.default.jsHeaderLabel, true).text('Only Selected').on('click', fieldHeaderClick);

      scoreHelper.createHeader(header);

      var numBoxesSpan = header.append('span').classed(_HistogramSelector2.default.headerBoxes, true);
      numBoxesSpan.append('i').classed(_HistogramSelector2.default.headerBoxesMinus, true).on('click', function () {
        return incrNumBoxes(-1);
      });
      numBoxesSpan.append('span').classed(_HistogramSelector2.default.jsHeaderBoxesNum, true).text(model.boxesPerRow);
      numBoxesSpan.append('i').classed(_HistogramSelector2.default.headerBoxesPlus, true).on('click', function () {
        return incrNumBoxes(1);
      });

      var singleSpan = header.append('span').classed(_HistogramSelector2.default.headerSingle, true);
      singleSpan.append('i').classed(_HistogramSelector2.default.headerSinglePrev, true).on('click', function () {
        return changeSingleField(-1);
      });
      singleSpan.append('span').classed(_HistogramSelector2.default.jsHeaderSingleField, true).text('');
      singleSpan.append('i').classed(_HistogramSelector2.default.headerSingleNext, true).on('click', function () {
        return changeSingleField(1);
      });
    }

    function updateHeader(dataLength) {
      if (model.singleModeSticky) {
        // header isn't useful for a single histogram.
        _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeader).style('display', 'none');
        return;
      }
      _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeader).style('display', null);
      _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsFieldsIcon)
      // apply class - 'false' should come first to not remove common base class.
      .classed(displayOnlySelected ? _HistogramSelector2.default.allFieldsIcon : _HistogramSelector2.default.selectedFieldsIcon, false).classed(!displayOnlySelected ? _HistogramSelector2.default.allFieldsIcon : _HistogramSelector2.default.selectedFieldsIcon, true);
      scoreHelper.updateHeader();

      _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeaderBoxes).style('display', model.singleModeName === null ? 'initial' : 'none');
      _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeaderBoxesNum).text(model.boxesPerRow + ' /row');

      _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeaderSingle).style('display', model.singleModeName === null ? 'none' : 'initial');

      if (model.provider.isA('LegendProvider') && model.singleModeName) {
        var _model$provider$getLe = model.provider.getLegend(model.singleModeName);

        var color = _model$provider$getLe.color;
        var shape = _model$provider$getLe.shape;

        _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeaderSingleField).html('<svg class=\'' + _HistogramSelector2.default.legendSvg + '\' width=\'' + legendSize + '\' height=\'' + legendSize + '\'\n                fill=\'' + color + '\' stroke=\'black\'><use xlink:href=\'' + shape + '\'/></svg>');
      } else {
        _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsHeaderSingleField).text(function () {
          var name = model.singleModeName;
          if (!name) return '';
          if (name.length > 10) {
            name = name.slice(0, 9) + '...';
          }
          return name;
        });
      }
    }

    publicAPI.getMouseCoords = function (tdsl) {
      // y-coordinate is not handled correctly for svg or svgGr or overlay inside scrolling container.
      var coord = _d3.default.mouse(tdsl.node());
      return [coord[0] - model.histMargin.left, coord[1] - model.histMargin.top];
    };

    publicAPI.resize = function () {
      if (!model.container) return;

      var clientRect = model.container.getBoundingClientRect();
      var deltaHeader = model.singleModeSticky ? 0 : model.headerSize;
      if (clientRect.width !== 0 && clientRect.height > deltaHeader) {
        model.containerHidden = false;
        _d3.default.select(model.listContainer).style('height', clientRect.height - deltaHeader + 'px');
        // scrollbarWidth = model.listContainer.offsetWidth - clientRect.width;
        publicAPI.render();
      } else {
        model.containerHidden = true;
      }
    };

    function toggleSingleModeEvt(d) {
      if (!model.singleModeSticky) {
        if (model.singleModeName === null) {
          model.singleModeName = d.name;
        } else {
          model.singleModeName = null;
        }
        model.scrollToName = d.name;
        publicAPI.render();
      }
      if (_d3.default.event) _d3.default.event.stopPropagation();
    }

    // Display a single histogram. If disableSwitch is true, switching to
    // other histograms in the fields list is disabled.
    // Calling requestNumBoxesPerRow() re-enables switching.
    publicAPI.displaySingleHistogram = function (fieldName, disableSwitch) {
      model.singleModeName = null;
      model.singleModeSticky = false;
      if (model.fieldData[fieldName]) {
        toggleSingleModeEvt(model.fieldData[fieldName]);
      }
      if (model.singleModeName && disableSwitch) {
        model.singleModeSticky = true;
      } else {
        model.singleModeSticky = false;
      }
      publicAPI.resize();
    };

    publicAPI.disableFieldActions = function (fieldName, actionNames) {
      if (!model.disabledFieldsActions) {
        model.disabledFieldsActions = {};
      }
      if (!model.disabledFieldsActions[fieldName]) {
        model.disabledFieldsActions[fieldName] = [];
      }
      var disableActionList = model.disabledFieldsActions[fieldName];
      [].concat(actionNames).forEach(function (action) {
        if (disableActionList.indexOf(action) === -1) {
          disableActionList.push(action);
        }
      });
    };

    publicAPI.enableFieldActions = function (fieldName, actionNames) {
      if (!model.disabledFieldsActions) {
        return;
      }
      if (!model.disabledFieldsActions[fieldName]) {
        return;
      }
      var disableActionList = model.disabledFieldsActions[fieldName];
      [].concat(actionNames).forEach(function (action) {
        var idx = disableActionList.indexOf(action);
        if (idx !== -1) {
          disableActionList.splice(idx, 1);
        }
      });
    };

    publicAPI.isFieldActionDisabled = function (fieldName, actionName) {
      if (!model.disabledFieldsActions) {
        return false;
      }
      if (!model.disabledFieldsActions[fieldName]) {
        return false;
      }
      var disableActionList = model.disabledFieldsActions[fieldName];
      return disableActionList.indexOf(actionName) !== -1;
    };

    publicAPI.render = function () {
      var onlyFieldName = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (!model.fieldData || onlyFieldName !== null && !model.fieldData[onlyFieldName]) {
        return;
      }

      if (!model.container || model.container.offsetParent === null) return;
      if (!model.listContainer) return;
      if (model.containerHidden) {
        publicAPI.resize();
        return;
      }

      var updateBoxPerRow = updateSizeInformation(model.singleModeName !== null);

      var fieldNames = getCurrentFieldNames();

      updateHeader(fieldNames.length);
      if (model.singleModeName !== null) {
        // display only one histogram at a time.
        fieldNames = [model.singleModeName];
      }

      if (updateBoxPerRow || fieldNames.length !== lastNumFields) {
        lastNumFields = fieldNames.length;

        // get the data and put it into the nest based on the
        // number of boxesPerRow
        var mungedData = fieldNames.map(function (name) {
          var d = model.fieldData[name];
          return d;
        });

        model.nest = mungedData.reduce(function (prev, item, i) {
          var group = Math.floor(i / model.boxesPerRow);
          if (prev[group]) {
            prev[group].value.push(item);
          } else {
            prev.push({
              key: group,
              value: [item]
            });
          }
          return prev;
        }, []);
      }

      // resize the div area to be tall enough to hold all our
      // boxes even though most are 'virtual' and lack DOM
      var newHeight = Math.ceil(model.nest.length * model.rowHeight) + 'px';
      model.parameterList.style('height', newHeight);

      if (!model.nest) return;

      // if we've changed view modes, single <==> contact sheet,
      // we need to re-scroll.
      if (model.scrollToName !== null) {
        var topRow = getFieldRow(model.scrollToName);
        model.listContainer.scrollTop = topRow * model.rowHeight;
        model.scrollToName = null;
      }

      // scroll distance, in pixels.
      var scrollY = model.listContainer.scrollTop;
      // convert scroll from pixels to rows, get one row above (-1)
      var offset = Math.max(0, Math.floor(scrollY / model.rowHeight) - 1);

      // extract the visible graphs from the data based on how many rows
      // we have scrolled down plus one above and one below (+2)
      var count = model.rowsPerPage + 2;
      var dataSlice = model.nest.slice(offset, offset + count);

      // attach our slice of data to the rows
      var rows = model.parameterList.selectAll('div').data(dataSlice, function (d) {
        return d.key;
      });

      // here is the code that reuses the exit nodes to fill entry
      // nodes. If there are not enough exit nodes then additional ones
      // will be created as needed. The boxes start off as hidden and
      // later have the class removed when their data is ready
      var exitNodes = rows.exit();
      rows.enter().append(function () {
        var reusableNode = 0;
        for (var i = 0; i < exitNodes[0].length; i++) {
          reusableNode = exitNodes[0][i];
          if (reusableNode) {
            exitNodes[0][i] = undefined;
            _d3.default.select(reusableNode).selectAll('table').classed(_HistogramSelector2.default.hiddenBox, true);
            return reusableNode;
          }
        }
        return document.createElement('div');
      });
      rows.call(styleRows, model);

      // if there are exit rows remaining that we
      // do not need we can delete them
      rows.exit().remove();

      // now put the data into the boxes
      var boxes = rows.selectAll('table').data(function (d) {
        return d.value;
      });
      boxes.enter().append('table').classed(_HistogramSelector2.default.hiddenBox, true);

      // free up any extra boxes
      boxes.exit().remove();

      // scoring interface - create floating controls to set scores, values, when needed.
      scoreHelper.createPopups();

      // for every item that has data, create all the sub-elements
      // and size them correctly based on our data
      function prepareItem(def, idx) {
        // updateData is called in response to UI events; it tells
        // the dataProvider to update the data to match the UI.
        //
        // updateData must be inside prepareItem() since it uses idx;
        // d3's listener method cannot guarantee the index passed to
        // updateData will be correct:
        function updateData(data) {
          // data.selectedGen++;
          // model.provider.updateField(data.name, { active: data.selected });
          model.provider.toggleFieldSelection(data.name);
        }

        // get existing sub elements
        var ttab = _d3.default.select(this);
        var trow1 = ttab.select('tr.' + _HistogramSelector2.default.jsLegendRow);
        var trow2 = ttab.select('tr.' + _HistogramSelector2.default.jsTr2);
        var tdsl = trow2.select('td.' + _HistogramSelector2.default.jsSparkline);
        var legendCell = trow1.select('.' + _HistogramSelector2.default.jsLegend);
        var fieldCell = trow1.select('.' + _HistogramSelector2.default.jsFieldName);
        var iconCell = trow1.select('.' + _HistogramSelector2.default.jsLegendIcons);
        var iconCellViz = iconCell.select('.' + _HistogramSelector2.default.jsLegendIconsViz);
        var svgGr = tdsl.select('svg').select('.' + _HistogramSelector2.default.jsGHist);
        // let svgOverlay = svgGr.select(`.${style.jsOverlay}`);

        // if they are not created yet then create them
        if (trow1.empty()) {
          trow1 = ttab.append('tr').classed(_HistogramSelector2.default.legendRow, true).on('click', (0, _D3MultiClick2.default)([function singleClick(d, i) {
            // single click handler
            // const overCoords = d3.mouse(model.listContainer);
            updateData(d);
          },
          // double click handler
          toggleSingleModeEvt]));
          trow2 = ttab.append('tr').classed(_HistogramSelector2.default.jsTr2, true);
          tdsl = trow2.append('td').classed(_HistogramSelector2.default.sparkline, true).attr('colspan', '3');
          legendCell = trow1.append('td').classed(_HistogramSelector2.default.legend, true);

          fieldCell = trow1.append('td').classed(_HistogramSelector2.default.fieldName, true);
          iconCell = trow1.append('td').classed(_HistogramSelector2.default.legendIcons, true);
          iconCellViz = iconCell.append('span').classed(_HistogramSelector2.default.legendIconsViz, true);
          scoreHelper.createScoreIcons(iconCellViz);
          iconCellViz.append('i').classed(_HistogramSelector2.default.expandIcon, true).on('click', toggleSingleModeEvt);

          // Create SVG, and main group created inside the margins for use by axes, title, etc.
          svgGr = tdsl.append('svg').classed(_HistogramSelector2.default.sparklineSvg, true).append('g').classed(_HistogramSelector2.default.jsGHist, true).attr('transform', 'translate( ' + model.histMargin.left + ', ' + model.histMargin.top + ' )');
          // nested groups inside main group
          svgGr.append('g').classed(_HistogramSelector2.default.axis, true);
          svgGr.append('g').classed(_HistogramSelector2.default.jsGRect, true);
          // scoring interface
          scoreHelper.createGroups(svgGr);
          svgGr.append('rect').classed(_HistogramSelector2.default.overlay, true).style('cursor', 'default');
        }
        var dataActive = def.active;
        // Apply legend
        if (model.provider.isA('LegendProvider')) {
          var _model$provider$getLe2 = model.provider.getLegend(def.name);

          var color = _model$provider$getLe2.color;
          var shape = _model$provider$getLe2.shape;

          legendCell.html('<svg class=\'' + _HistogramSelector2.default.legendSvg + '\' width=\'' + legendSize + '\' height=\'' + legendSize + '\'\n                  fill=\'' + color + '\' stroke=\'black\'><use xlink:href=\'' + shape + '\'/></svg>');
        } else {
          legendCell.html('<i></i>').select('i');
        }
        trow1.classed(!dataActive ? _HistogramSelector2.default.selectedLegendRow : _HistogramSelector2.default.unselectedLegendRow, false).classed(dataActive ? _HistogramSelector2.default.selectedLegendRow : _HistogramSelector2.default.unselectedLegendRow, true);
        // selection outline
        ttab.classed(_HistogramSelector2.default.hiddenBox, false).classed(!dataActive ? _HistogramSelector2.default.selectedBox : _HistogramSelector2.default.unselectedBox, false).classed(dataActive ? _HistogramSelector2.default.selectedBox : _HistogramSelector2.default.unselectedBox, true);

        // Change interaction icons based on state.
        // scoreHelper has save icon and score icon.
        var numIcons = (model.singleModeSticky ? 0 : 1) + scoreHelper.numScoreIcons(def);
        iconCell.style('width', numIcons * 15 + 6 + 'px');
        scoreHelper.updateScoreIcons(iconCellViz, def);
        iconCellViz.select('.' + _HistogramSelector2.default.jsExpandIcon).attr('class', model.singleModeName === null ? _HistogramSelector2.default.expandIcon : _HistogramSelector2.default.shrinkIcon).style('display', model.singleModeSticky ? 'none' : null);
        // Apply field name
        fieldCell.style('width', model.histWidth - numIcons * 19 + 'px').text(def.name);

        // adjust some settings based on current size
        tdsl.select('svg').attr('width', publicAPI.svgWidth()).attr('height', publicAPI.svgHeight());

        // get the histogram data and rebuild the histogram based on the results
        var hobj = def.hobj;
        if (hobj) {
          (function () {
            var cmax = 1.0 * _d3.default.max(hobj.counts);
            var hsize = hobj.counts.length;
            var hdata = svgGr.select('.' + _HistogramSelector2.default.jsGRect).selectAll('.' + _HistogramSelector2.default.jsHistRect).data(hobj.counts);

            hdata.enter().append('rect');
            // changes apply to both enter and update data join:
            hdata.attr('class', function (d, i) {
              return i % 2 === 0 ? _HistogramSelector2.default.histRectEven : _HistogramSelector2.default.histRectOdd;
            }).attr('pname', def.name).attr('y', function (d) {
              return model.histHeight * (1.0 - d / cmax);
            }).attr('x', function (d, i) {
              return model.histWidth / hsize * i;
            }).attr('height', function (d) {
              return model.histHeight * (d / cmax);
            }).attr('width', Math.ceil(model.histWidth / hsize));

            hdata.exit().remove();

            var svgOverlay = svgGr.select('.' + _HistogramSelector2.default.jsOverlay);
            svgOverlay.attr('x', -model.histMargin.left).attr('y', -model.histMargin.top).attr('width', publicAPI.svgWidth()).attr('height', publicAPI.svgHeight()); // allow clicks inside x-axis.

            if (!scoreHelper.editingScore(def)) {
              if (model.provider.isA('HistogramBinHoverProvider')) {
                svgOverlay.on('mousemove.hs', function (d, i) {
                  var mCoords = publicAPI.getMouseCoords(tdsl);
                  var binNum = Math.floor(mCoords[0] / model.histWidth * hsize);
                  var state = {};
                  state[def.name] = [binNum];
                  model.provider.setHoverState({ state: state });
                }).on('mouseout.hs', function (d, i) {
                  var state = {};
                  state[def.name] = [-1];
                  model.provider.setHoverState({ state: state });
                });
              }
              svgOverlay.on('click.hs', function (d) {
                var overCoords = publicAPI.getMouseCoords(tdsl);
                if (overCoords[1] <= model.histHeight) {
                  updateData(d);
                }
              });
            } else {
              // disable when score editing is happening - it's distracting.
              // Note we still respond to hovers over other components.
              svgOverlay.on('.hs', null);
            }

            // Show an x-axis with just min/max displayed.
            // Attach scale, axis objects to this box's
            // data (the 'def' object) to allow persistence when scrolled.
            if (typeof def.xScale === 'undefined') {
              def.xScale = _d3.default.scale.linear();
            }

            var _scoreHelper$getHistR = scoreHelper.getHistRange(def);

            var _scoreHelper$getHistR2 = _slicedToArray(_scoreHelper$getHistR, 2);

            var minRange = _scoreHelper$getHistR2[0];
            var maxRange = _scoreHelper$getHistR2[1];

            def.xScale.rangeRound([0, model.histWidth]).domain([minRange, maxRange]);

            if (typeof def.xAxis === 'undefined') {
              var formatter = _d3.default.format('.3s');
              def.xAxis = _d3.default.svg.axis().tickFormat(formatter).orient('bottom');
            }
            def.xAxis.scale(def.xScale);
            var numTicks = 2;
            if (model.histWidth >= model.moreTicksSize) {
              numTicks = 5;
              // using .ticks() results in skipping min/max values,
              // if they aren't 'nice'. Make exactly 5 ticks.
              var myTicks = _d3.default.range(numTicks).map(function (d) {
                return minRange + d / (numTicks - 1) * (maxRange - minRange);
              });
              def.xAxis.tickValues(myTicks);
            } else {
              def.xAxis.tickValues(def.xScale.domain());
            }
            // nested group for the x-axis min/max display.
            var gAxis = svgGr.select('.' + _HistogramSelector2.default.jsAxis);
            gAxis.attr('transform', 'translate(0, ' + model.histHeight + ')').call(def.xAxis);
            var tickLabels = gAxis.selectAll('text').classed(_HistogramSelector2.default.axisText, true);
            numTicks = tickLabels.size();
            tickLabels.style('text-anchor', function (d, i) {
              return i === 0 ? 'start' : i === numTicks - 1 ? 'end' : 'middle';
            });
            gAxis.selectAll('line').classed(_HistogramSelector2.default.axisLine, true);
            gAxis.selectAll('path').classed(_HistogramSelector2.default.axisPath, true);

            scoreHelper.prepareItem(def, idx, svgGr, tdsl);
          })();
        }
      }

      // make sure all the elements are created
      // and updated
      if (onlyFieldName === null) {
        boxes.each(prepareItem);
        boxes.call(styleBoxes, model);
      } else {
        boxes.filter(function (def) {
          return def.name === onlyFieldName;
        }).each(prepareItem);
      }
    };

    publicAPI.setContainer = function (element) {
      if (model.container) {
        while (model.container.firstChild) {
          model.container.removeChild(model.container.firstChild);
        }
        model.container = null;
      }

      model.container = element;

      if (model.container) {
        var cSel = _d3.default.select(model.container);
        createHeader(cSel);
        // wrapper height is set insize resize()
        var wrapper = cSel.append('div').style('overflow-y', 'auto').style('overflow-x', 'hidden').on('scroll', function () {
          publicAPI.render();
        });

        model.listContainer = wrapper.node();
        model.parameterList = wrapper.append('div').classed(_HistogramSelector2.default.histogramSelector, true);

        publicAPI.resize();

        setImmediate(scoreHelper.updateFieldAnnotations);
      }
    };

    function handleHoverUpdate(data) {
      var everything = _d3.default.select(model.container);
      Object.keys(data.state).forEach(function (pName) {
        var binList = data.state[pName];
        everything.selectAll('rect[pname=\'' + pName + '\']').classed(_HistogramSelector2.default.binHilite, function (d, i) {
          return binList.indexOf(i) >= 0;
        });
      });
    }

    // Auto unmount on destroy
    model.subscriptions.push({ unsubscribe: publicAPI.setContainer });

    if (model.provider.isA('FieldProvider')) {
      var fieldNames = model.provider.getFieldNames();
      if (!model.fieldData) {
        model.fieldData = {};
      }

      fieldNames.forEach(function (name) {
        model.fieldData[name] = Object.assign(model.fieldData[name] || {}, model.provider.getField(name), scoreHelper.defaultFieldData());
      });

      model.subscriptions.push(model.provider.onFieldChange(function (field) {
        Object.assign(model.fieldData[field.name], field);
        publicAPI.render();
      }));
    }

    if (model.provider.isA('HistogramBinHoverProvider')) {
      model.subscriptions.push(model.provider.onHoverBinChange(handleHoverUpdate));
    }

    if (model.provider.isA('Histogram1DProvider')) {
      model.histogram1DDataSubscription = model.provider.subscribeToHistogram1D(function (data) {
        // Below, we're asking for partial updates, so we just update our
        // cache with anything that came in.
        Object.keys(data).forEach(function (name) {
          if (!model.fieldData[name]) model.fieldData[name] = {};
          if (model.fieldData[name].hobj) {
            var oldRangeMin = model.fieldData[name].hobj.min;
            var oldRangeMax = model.fieldData[name].hobj.max;
            model.fieldData[name].hobj = data[name];
            scoreHelper.rescaleDividers(name, oldRangeMin, oldRangeMax);
          } else {
            model.fieldData[name].hobj = data[name];
          }
        });

        publicAPI.render();
      }, Object.keys(model.fieldData), {
        numberOfBins: model.numberOfBins,
        partial: true
      });

      model.subscriptions.push(model.histogram1DDataSubscription);
    }

    if (model.provider.isA('AnnotationStoreProvider')) {
      (function () {
        // Preload annotation from store
        var partitionSelectionToLoad = {};
        var annotations = model.provider.getStoredAnnotations();
        Object.keys(annotations).forEach(function (id) {
          var annotation = annotations[id];
          if (annotation && annotation.selection.type === 'partition') {
            partitionSelectionToLoad[annotation.selection.partition.variable] = annotation;
          }
        });
        if (Object.keys(partitionSelectionToLoad).length) {
          scoreHelper.updateFieldAnnotations(partitionSelectionToLoad);
        }

        model.subscriptions.push(model.provider.onStoreAnnotationChange(function (event) {
          if (event.action === 'delete' && event.annotation) {
            var annotation = event.annotation;
            if (annotation.selection.type === 'partition') {
              var fieldName = annotation.selection.partition.variable;
              if (model.fieldData[fieldName]) {
                model.fieldData[fieldName].annotation = null;
                model.fieldData[fieldName].dividers = undefined;
                model.fieldData[fieldName].editScore = false;
                publicAPI.render(fieldName);
              }
            }
          }
        }));
      })();
    }

    // scoring interface
    scoreHelper.addSubscriptions();

    // Make sure default values get applied
    publicAPI.setContainer(model.container);

    // Expose update fields partitions
    publicAPI.updateFieldAnnotations = scoreHelper.updateFieldAnnotations;

    publicAPI.getAnnotationForField = function (fieldName) {
      return model.fieldData[fieldName].annotation;
    };
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {
    container: null,
    provider: null,
    listContainer: null,
    needData: true,
    containerHidden: false,

    parameterList: null,
    nest: null, // nested aray of data nest[rows][boxes]
    boxesPerRow: 0,
    rowsPerPage: 0,
    boxWidth: 120,
    boxHeight: 120,
    // show 1 per row?
    singleModeName: null,
    singleModeSticky: false,
    scrollToName: null,
    // margins inside the SVG element.
    histMargin: { top: 6, right: 12, bottom: 23, left: 12 },
    histWidth: 90,
    histHeight: 70,
    // what's the smallest histogram size that shows 5 ticks, instead of min/max? in pixels
    moreTicksSize: 300,
    lastOffset: -1,
    headerSize: 25,
    // scoring interface activated by passing in 'scores' array externally.
    // scores: [{ name: 'Yes', color: '#00C900' }, ... ],
    defaultScore: 0,
    dragMargin: 8,
    selectedDef: null,

    numberOfBins: 32
  };

  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, 'VizComponent');
    _CompositeClosureHelper2.default.get(publicAPI, model, ['provider', 'container', 'numberOfBins']);
    _CompositeClosureHelper2.default.set(publicAPI, model, ['numberOfBins']);
    _CompositeClosureHelper2.default.dynamicArray(publicAPI, model, 'readOnlyFields');

    histogramSelector(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});