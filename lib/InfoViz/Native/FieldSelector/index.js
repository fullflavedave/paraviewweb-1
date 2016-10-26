define(['exports', 'd3', 'PVWStyle/InfoVizNative/FieldSelector.mcss', '../../../Common/Core/CompositeClosureHelper', './template.html'], function (exports, _d, _FieldSelector, _CompositeClosureHelper, _template) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.extend = extend;

  var _d2 = _interopRequireDefault(_d);

  var _FieldSelector2 = _interopRequireDefault(_FieldSelector);

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _template2 = _interopRequireDefault(_template);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // ----------------------------------------------------------------------------
  // Global
  // ----------------------------------------------------------------------------

  // ----------------------------------------------------------------------------
  // Field Selector
  // ----------------------------------------------------------------------------

  function fieldSelector(publicAPI, model) {
    // private variables
    var hideField = {
      minMax: false,
      hist: false,
      minMaxWidth: 0,
      histWidth: 0
    };

    // storage for 1d histograms
    if (!model.histograms) {
      model.histograms = {};
    }

    // public API
    publicAPI.resize = function () {
      publicAPI.render();
    };

    publicAPI.setContainer = function (el) {
      if (model.container) {
        while (model.container.firstChild) {
          model.container.removeChild(model.container.firstChild);
        }
        model.container = null;
      }

      model.container = el;

      if (el) {
        _d2.default.select(model.container).html(_template2.default);
        _d2.default.select(model.container).select('.fieldSelector').classed(_FieldSelector2.default.fieldSelector, true);

        model.fieldShowHistogram = model.fieldShowHistogram && model.provider.isA('Histogram1DProvider');
        // append headers for histogram columns
        if (model.fieldShowHistogram) {
          var header = _d2.default.select(model.container).select('thead').select('tr');
          header.append('th').text('Min').classed(_FieldSelector2.default.jsHistMin, true);
          header.append('th').text('Histogram').classed(_FieldSelector2.default.jsSparkline, true);
          header.append('th').text('Max').classed(_FieldSelector2.default.jsHistMax, true);
        }
        publicAPI.render();
      }
    };

    publicAPI.render = function () {
      if (!model.container) {
        return;
      }

      var legendSize = 15;

      // Apply style
      _d2.default.select(model.container).select('thead').classed(_FieldSelector2.default.thead, true);
      _d2.default.select(model.container).select('tbody').classed(_FieldSelector2.default.tbody, true);
      _d2.default.select(model.container).select('th.field-selector-mode').on('click', function (d) {
        model.displayUnselected = !model.displayUnselected;
        publicAPI.render();
      }).select('i')
      // apply class - 'false' should come first to not remove common base class.
      .classed(!model.displayUnselected ? _FieldSelector2.default.allFieldsIcon : _FieldSelector2.default.selectedFieldsIcon, false).classed(model.displayUnselected ? _FieldSelector2.default.allFieldsIcon : _FieldSelector2.default.selectedFieldsIcon, true);

      var data = model.displayUnselected ? model.provider.getFieldNames() : model.provider.getActiveFieldNames();
      var totalNum = model.displayUnselected ? data.length : model.provider.getFieldNames().length;

      // Update header label
      _d2.default.select(model.container).select('th.field-selector-label').style('text-align', 'left').text(model.displayUnselected ? 'Only Selected (' + data.length + ' total)' : 'Only Selected (' + data.length + ' / ' + totalNum + ' total)').on('click', function (d) {
        model.displayUnselected = !model.displayUnselected;
        publicAPI.render();
      });

      // test for too-long rows
      var hideMore = model.container.scrollWidth > model.container.clientWidth;
      if (hideMore) {
        if (!hideField.minMax) {
          hideField.minMax = true;
          hideField.minMaxWidth = model.container.scrollWidth;
          // if we hide min/max, we may also need to hide hist, so trigger another resize
          setTimeout(publicAPI.resize, 0);
        } else if (!hideField.hist) {
          hideField.hist = true;
          hideField.histWidth = model.container.scrollWidth;
        }
      } else if (hideField.minMax) {
        // if we've hidden something, see if we can re-show it.
        if (hideField.hist) {
          if (model.container.scrollWidth - hideField.histWidth > 0) {
            hideField.hist = false;
            hideField.histWidth = 0;
            // if we show hist, we may also need to show min/max, so trigger another resize
            setTimeout(publicAPI.resize, 0);
          }
        } else if (hideField.minMax) {
          if (model.container.scrollWidth - hideField.minMaxWidth > 0) {
            hideField.minMax = false;
            hideField.minMaxWidth = 0;
          }
        }
      }
      var header = _d2.default.select(model.container).select('thead').select('tr');
      header.selectAll('.' + _FieldSelector2.default.jsHistMin).style('display', hideField.minMax ? 'none' : null);
      header.selectAll('.' + _FieldSelector2.default.jsSparkline).style('display', hideField.hist ? 'none' : null);
      header.selectAll('.' + _FieldSelector2.default.jsHistMax).style('display', hideField.minMax ? 'none' : null);

      // Handle variables
      var variablesContainer = _d2.default.select(model.container).select('tbody.fields').selectAll('tr').data(data);

      variablesContainer.enter().append('tr');
      variablesContainer.exit().remove();

      // Apply on each data item
      function renderField(fieldName, index) {
        var field = model.provider.getField(fieldName);
        var fieldContainer = _d2.default.select(this);
        var legendCell = fieldContainer.select('.' + _FieldSelector2.default.jsLegend);
        var fieldCell = fieldContainer.select('.' + _FieldSelector2.default.jsFieldName);

        // Apply style to row (selected/unselected)
        fieldContainer.classed(!field.active ? _FieldSelector2.default.selectedRow : _FieldSelector2.default.unselectedRow, false).classed(field.active ? _FieldSelector2.default.selectedRow : _FieldSelector2.default.unselectedRow, true).on('click', function (name) {
          model.provider.toggleFieldSelection(name);
        });

        // Create missing DOM element if any
        if (legendCell.empty()) {
          legendCell = fieldContainer.append('td').classed(_FieldSelector2.default.legend, true);

          fieldCell = fieldContainer.append('td').classed(_FieldSelector2.default.fieldName, true);
        }

        // Apply legend
        if (model.provider.isA('LegendProvider')) {
          var _model$provider$getLe = model.provider.getLegend(fieldName);

          var color = _model$provider$getLe.color;
          var shape = _model$provider$getLe.shape;

          legendCell.html('<svg class=\'' + _FieldSelector2.default.legendSvg + '\' width=\'' + legendSize + '\' height=\'' + legendSize + '\'\n                  fill=\'' + color + '\' stroke=\'black\'><use xlink:href=\'' + shape + '\'/></svg>');
        } else {
          legendCell.html('<i></i>').select('i').classed(!field.active ? _FieldSelector2.default.selectedRow : _FieldSelector2.default.unselectedRow, false).classed(field.active ? _FieldSelector2.default.selectedRow : _FieldSelector2.default.unselectedRow, true);
        }

        // Apply field name
        fieldCell.text(fieldName);

        if (model.fieldShowHistogram) {
          var minCell = fieldContainer.select('.' + _FieldSelector2.default.jsHistMin);
          var histCell = fieldContainer.select('.' + _FieldSelector2.default.jsSparkline);
          var maxCell = fieldContainer.select('.' + _FieldSelector2.default.jsHistMax);

          if (histCell.empty()) {
            minCell = fieldContainer.append('td').classed(_FieldSelector2.default.jsHistMin, true);
            histCell = fieldContainer.append('td').classed(_FieldSelector2.default.sparkline, true);
            maxCell = fieldContainer.append('td').classed(_FieldSelector2.default.jsHistMax, true);
            histCell.append('svg').classed(_FieldSelector2.default.sparklineSvg, true).attr('width', model.fieldHistWidth).attr('height', model.fieldHistHeight);
          }

          // make sure our data is ready. If not, render will be called when loaded.
          var hobj = model.histograms ? model.histograms[fieldName] : null;
          if (hobj) {
            histCell.style('display', hideField.hist ? 'none' : null);

            // only do work if histogram is displayed.
            if (!hideField.hist) {
              (function () {
                var cmax = 1.0 * _d2.default.max(hobj.counts);
                var hsize = hobj.counts.length;
                var hdata = histCell.select('svg').selectAll('.' + _FieldSelector2.default.jsHistRect).data(hobj.counts);

                hdata.enter().append('rect');
                // changes apply to both enter and update data join:
                hdata.attr('class', function (d, i) {
                  return i % 2 === 0 ? _FieldSelector2.default.histRectEven : _FieldSelector2.default.histRectOdd;
                }).attr('pname', fieldName).attr('y', function (d) {
                  return model.fieldHistHeight * (1.0 - d / cmax);
                }).attr('x', function (d, i) {
                  return model.fieldHistWidth / hsize * i;
                }).attr('height', function (d) {
                  return model.fieldHistHeight * (d / cmax);
                }).attr('width', model.fieldHistWidth / hsize);

                hdata.exit().remove();

                if (model.provider.isA('HistogramBinHoverProvider')) {
                  histCell.select('svg').on('mousemove', function inner(d, i) {
                    var mCoords = _d2.default.mouse(this);
                    var binNum = Math.floor(mCoords[0] / model.fieldHistWidth * hsize);
                    var state = {};
                    state[fieldName] = [binNum];
                    model.provider.setHoverState({ state: state });
                  }).on('mouseout', function (d, i) {
                    var state = {};
                    state[fieldName] = [-1];
                    model.provider.setHoverState({ state: state });
                  });
                }
              })();
            }

            var formatter = _d2.default.format('.3s');
            minCell.text(formatter(hobj.min)).style('display', hideField.minMax ? 'none' : null);
            maxCell.text(formatter(hobj.max)).style('display', hideField.minMax ? 'none' : null);
          }
        }
      }

      // Render all fields
      variablesContainer.each(renderField);
    };

    function handleHoverUpdate(data) {
      var svg = _d2.default.select(model.container);
      Object.keys(data.state).forEach(function (pName) {
        var binList = data.state[pName];
        svg.selectAll('rect[pname=\'' + pName + '\']').classed(_FieldSelector2.default.histoHilite, function (d, i) {
          return binList.indexOf(-1) === -1;
        }).classed(_FieldSelector2.default.binHilite, function (d, i) {
          return binList.indexOf(i) >= 0;
        });
      });
    }

    // Make sure default values get applied
    publicAPI.setContainer(model.container);
    model.subscriptions.push({ unsubscribe: publicAPI.setContainer });
    model.subscriptions.push(model.provider.onFieldChange(publicAPI.render));
    if (model.fieldShowHistogram) {
      if (model.provider.isA('Histogram1DProvider')) {
        model.histogram1DDataSubscription = model.provider.subscribeToHistogram1D(function (allHistogram1d) {
          // Below, we're asking for partial updates, so we just update our
          // cache with anything that came in.
          Object.keys(allHistogram1d).forEach(function (paramName) {
            model.histograms[paramName] = allHistogram1d[paramName];
          });
          publicAPI.render();
        }, model.provider.getFieldNames(), {
          numberOfBins: model.numberOfBins,
          partial: true
        });

        model.subscriptions.push(model.histogram1DDataSubscription);
      }
    }

    if (model.provider.isA('HistogramBinHoverProvider')) {
      model.subscriptions.push(model.provider.onHoverBinChange(handleHoverUpdate));
    }
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {
    container: null,
    provider: null,
    displayUnselected: true,
    fieldShowHistogram: true,
    fieldHistWidth: 120,
    fieldHistHeight: 15,
    numberOfBins: 32
  };

  // ----------------------------------------------------------------------------

  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, 'VizComponent');
    _CompositeClosureHelper2.default.get(publicAPI, model, ['provider', 'container', 'fieldShowHistogram', 'numberOfBins']);
    _CompositeClosureHelper2.default.set(publicAPI, model, ['fieldShowHistogram', 'numberOfBins']);

    fieldSelector(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});