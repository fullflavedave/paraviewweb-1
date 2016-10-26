define(['exports', 'd3', 'PVWStyle/InfoVizNative/ParallelCoordinates.mcss', '../../../Common/Misc/AnnotationBuilder', './AxesManager', '../../../Common/Core/CompositeClosureHelper', './body.html', './ParallelCoordsIconSmall.png'], function (exports, _d, _ParallelCoordinates, _AnnotationBuilder, _AxesManager, _CompositeClosureHelper, _body, _ParallelCoordsIconSmall) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.newInstance = undefined;
  exports.affine = affine;
  exports.perfRound = perfRound;
  exports.dataToScreen = dataToScreen;
  exports.screenToData = screenToData;
  exports.toColorArray = toColorArray;
  exports.extend = extend;

  var _d2 = _interopRequireDefault(_d);

  var _ParallelCoordinates2 = _interopRequireDefault(_ParallelCoordinates);

  var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

  var _AxesManager2 = _interopRequireDefault(_AxesManager);

  var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

  var _body2 = _interopRequireDefault(_body);

  var _ParallelCoordsIconSmall2 = _interopRequireDefault(_ParallelCoordsIconSmall);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  // ----------------------------------------------------------------------------
  // Global
  // ----------------------------------------------------------------------------

  function affine(inMin, val, inMax, outMin, outMax) {
    return (val - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
  }

  function perfRound(val) {
    /* eslint-disable no-bitwise */
    return 0.5 + val | 0;
    /* eslint-enable no-bitwise */
  }

  function dataToScreen(model, dataY, axis) {
    return perfRound(!axis.isUpsideDown() ? affine(axis.range[0], dataY, axis.range[1], model.canvasArea.height - model.borderOffsetBottom, model.borderOffsetTop) : affine(axis.range[0], dataY, axis.range[1], model.borderOffsetTop, model.canvasArea.height - model.borderOffsetBottom));
  }

  function screenToData(model, screenY, axis) {
    return !axis.isUpsideDown() ? affine(model.canvasArea.height - model.borderOffsetBottom, screenY, model.borderOffsetTop, axis.range[0], axis.range[1]) : affine(model.borderOffsetTop, screenY, model.canvasArea.height - model.borderOffsetBottom, axis.range[0], axis.range[1]);
  }

  function toColorArray(colorString) {
    return [Number.parseInt(colorString.slice(1, 3), 16), Number.parseInt(colorString.slice(3, 5), 16), Number.parseInt(colorString.slice(5, 7), 16)];
  }

  // ----------------------------------------------------------------------------
  // Parallel Coordinate
  // ----------------------------------------------------------------------------

  function parallelCoordinate(publicAPI, model) {
    // Private internal
    var scoreToColor = [];
    var lastAnnotationPushed = null;

    function updateSizeInformation() {
      if (!model.canvas) {
        return;
      }
      model.canvasArea = {
        width: model.canvas.width,
        height: model.canvas.height
      };
      model.drawableArea = {
        width: model.canvasArea.width - (model.borderOffsetLeft + model.borderOffsetRight),
        height: model.canvasArea.height - (model.borderOffsetTop + model.borderOffsetBottom)
      };
    }

    // -======================================================
    model.canvas = document.createElement('canvas');
    model.canvas.style.position = 'absolute';
    model.canvas.style.top = 0;
    model.canvas.style.right = 0;
    model.canvas.style.bottom = 0;
    model.canvas.style.left = 0;
    model.ctx = model.canvas.getContext('2d');

    model.fgCanvas = document.createElement('canvas');
    model.fgCtx = model.fgCanvas.getContext('2d');
    model.bgCanvas = document.createElement('canvas');
    model.bgCtx = model.bgCanvas.getContext('2d');

    model.axes = new _AxesManager2.default();

    // Local cache of the selection data
    model.selectionData = null;
    model.visibleScores = [0, 1, 2];

    function drawSelectionData(score) {
      if (model.axes.selection && model.visibleScores) {
        return model.visibleScores.indexOf(score) !== -1;
      }
      return true;
    }

    function drawSelectionBars(selectionBarModel) {
      var svg = _d2.default.select(model.container).select('svg');
      var selBarGroup = svg.select('g.selection-bars');

      // Make the selection bars
      var selectionBarNodes = selBarGroup.selectAll('rect.selection-bars').data(selectionBarModel);

      selectionBarNodes.enter().append('rect').classed('selection-bars', true).classed(_ParallelCoordinates2.default.selectionBars, true);

      selectionBarNodes.exit().remove();

      selBarGroup.selectAll('rect.selection-bars').classed(_ParallelCoordinates2.default.controlItem, true).style('fill', function (d, i) {
        return d.color;
      }).attr('width', model.selectionBarWidth).attr('height', function (d, i) {
        var barHeight = d.screenRangeY[1] - d.screenRangeY[0];
        if (barHeight < 0) {
          barHeight = d.screenRangeY[0] - d.screenRangeY[1];
        }
        return barHeight;
      }).attr('transform', function (d, i) {
        var startPoint = d.screenRangeY[0] > d.screenRangeY[1] ? d.screenRangeY[1] : d.screenRangeY[0];
        return 'translate(' + (d.screenX - model.selectionBarWidth / 2) + ', ' + startPoint + ')';
      }).on('mousedown', function inner(d, i) {
        var _this = this;

        _d2.default.event.preventDefault();
        var downCoords = _d2.default.mouse(model.container);

        svg.on('mousemove', function (md, mi) {
          var moveCoords = _d2.default.mouse(model.container);
          var deltaYScreen = moveCoords[1] - downCoords[1];
          var startPoint = d.screenRangeY[0] > d.screenRangeY[1] ? d.screenRangeY[1] : d.screenRangeY[0];
          _d2.default.select(_this).attr('transform', 'translate(' + (d.screenX - model.selectionBarWidth / 2) + ', ' + (startPoint + deltaYScreen) + ')');
        });

        svg.on('mouseup', function (md, mi) {
          var upCoords = _d2.default.mouse(model.container);
          var deltaYScreen = upCoords[1] - downCoords[1];
          var startPoint = d.screenRangeY[0] > d.screenRangeY[1] ? d.screenRangeY[1] : d.screenRangeY[0];
          var barHeight = d.screenRangeY[1] - d.screenRangeY[0];
          if (barHeight < 0) {
            barHeight = d.screenRangeY[0] - d.screenRangeY[1];
          }
          var newStart = startPoint + deltaYScreen;
          var newEnd = newStart + barHeight;
          svg.on('mousemove', null);
          svg.on('mouseup', null);

          var axis = model.axes.getAxis(d.index);
          model.axes.updateSelection(d.index, d.selectionIndex, screenToData(model, newStart, axis), screenToData(model, newEnd, axis));
        });
      });
    }

    function drawAxisControls(controlsDataModel) {
      // Manipulate the control widgets svg DOM
      var svgGr = _d2.default.select(model.container).select('svg').select('g.axis-control-elements');

      var axisControlNodes = svgGr.selectAll('g.axis-control-element').data(controlsDataModel);

      var axisControls = axisControlNodes.enter().append('g').classed('axis-control-element', true).classed(_ParallelCoordinates2.default.axisControlElements, true)
      // Can't use .html on svg without polyfill: https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#html
      // fails in IE11. Replace by explicit DOM manipulation.
      // .html(axisControlSvg);
      .append('g').classed('axis-controls-group-container', true).attr('width', 108).attr('height', 50).attr('viewBox', '0 0 108 50').append('g').classed('axis-controls-group', true);

      axisControls.append('rect').classed('center-rect', true).attr('x', 28).attr('y', 1).attr('width', 52).attr('height', 48);
      axisControls.append('rect').classed('right-rect', true).attr('x', 82).attr('y', 1).attr('width', 25).attr('height', 48);
      axisControls.append('rect').classed('left-rect', true).attr('x', 1).attr('y', 1).attr('width', 25).attr('height', 48);
      axisControls.append('polygon').classed('top', true).attr('points', '54 1 78 23 30 23 ');
      axisControls.append('polygon').classed('right', true).attr('points', '94 14 118 36 70 36 ').attr('transform', 'translate(94.0, 25.0) rotate(-270.0) translate(-94.0, -25.0) ');
      axisControls.append('polygon').classed('left', true).attr('points', '14 14 38 36 -10 36 ').attr('transform', 'translate(14.0, 25.0) scale(-1, 1) rotate(-270.0) translate(-14.0, -25.0) ');
      axisControls.append('polygon').classed('bottom', true).attr('points', '54 27 78 49 30 49 ').attr('transform', 'translate(54.0, 38.0) scale(1, -1) translate(-54.0, -38.0) ');

      axisControlNodes.exit().remove();

      var scale = 0.5;
      axisControlNodes.classed(_ParallelCoordinates2.default.upsideDown, function (d, i) {
        return !d.orient;
      }).classed(_ParallelCoordinates2.default.rightsideUp, function (d, i) {
        return d.orient;
      }).attr('transform', function inner(d, i) {
        var elt = _d2.default.select(this).select('g.axis-controls-group-container');
        var tx = d.centerX - elt.attr('width') * scale / 2;
        var ty = d.centerY - elt.attr('height') * scale / 2;
        return 'translate(' + tx + ', ' + ty + ') scale(' + scale + ')';
      }).on('click', function inner(d, i) {
        var cc = _d2.default.mouse(this);
        var elt = _d2.default.select(this).select('g.axis-controls-group-container');
        var ratio = cc[0] / elt.attr('width');
        if (ratio < 0.28) {
          // left arrow click
          model.axes.swapAxes(i - 1, i);
        } else if (ratio < 0.73) {
          // up/down click
          model.axes.toggleOrientation(i);
          publicAPI.render();
        } else {
          // right arrow click
          model.axes.swapAxes(i, i + 1);
        }
      }).selectAll('.axis-controls-group-container').classed(_ParallelCoordinates2.default.axisControlsGroupContainer, true);
    }

    function drawAxisLabels(labelDataModel) {
      var ypos = 15;
      var glyphRegion = 22;
      var glyphPadding = 3;
      var svg = _d2.default.select(model.container).select('svg');

      if (model.provider && model.provider.isA('LegendProvider')) {
        (function () {
          // Add legend key
          labelDataModel.forEach(function (entry) {
            entry.legend = model.provider.getLegend(entry.name);
          });
          var glyphSize = glyphRegion - glyphPadding - glyphPadding;
          if (glyphSize % 2 !== 0) {
            glyphSize += 1;
          }

          var glyphGroup = svg.selectAll('g.glyphs').data(labelDataModel);

          glyphGroup.exit().remove();

          glyphGroup.enter().append('g').classed('glyphs', true);

          // Create nested structure
          var svgGroup = glyphGroup.selectAll('svg').data([0]);
          svgGroup.enter().append('svg');
          var useGroup = svgGroup.selectAll('use').data([0]);
          useGroup.enter().append('use');

          glyphGroup.attr('transform', function (d, i) {
            return 'translate(' + (d.centerX - glyphSize * 0.5) + ', ' + glyphPadding + ')';
          }).on('click', function (d, i) {
            if (d.annotated) {
              model.axes.clearSelection(i);
            }
          });

          glyphGroup.each(function applyLegendStyle(d, i) {
            _d2.default.select(this).select('svg').attr('fill', d.legend.color).attr('stroke', 'black').attr('width', glyphSize).attr('height', glyphSize).style('color', d.legend.color) // Firefox SVG use color bug workaround fix
            .classed(_ParallelCoordinates2.default.clickable, d.annotated).select('use').classed(_ParallelCoordinates2.default.colorToFill, true) // Firefox SVG use color bug workaround fix
            .classed(_ParallelCoordinates2.default.blackStroke, true).attr('xlink:href', d.legend.shape);
          });

          // Augment the legend glyphs with extra DOM for annotated axes
          var indicatorGroup = svg.select('g.axis-annotation-indicators');
          var indicatorNodes = indicatorGroup.selectAll('rect.axis-annotation-indicators').data(labelDataModel);

          indicatorNodes.enter().append('rect').classed('axis-annotation-indicators', true).classed(_ParallelCoordinates2.default.axisAnnotationIndicators, true);

          indicatorNodes.exit().remove();

          indicatorGroup.selectAll('rect.axis-annotation-indicators').attr('width', glyphSize + 3).attr('height', glyphSize + 3).attr('transform', function (d, i) {
            return 'translate(' + (d.centerX - (glyphSize * 0.5 + 1)) + ', ' + (glyphPadding - 1.5) + ')';
          }).classed(_ParallelCoordinates2.default.axisAnnotated, function (d, i) {
            return d.annotated;
          });
        })();
      } else {
        // Now manage the svg dom for the axis labels
        var axisLabelNodes = svg.selectAll('text.axis-labels').data(labelDataModel);

        axisLabelNodes.enter().append('text').classed('axis-labels', true).classed(_ParallelCoordinates2.default.axisLabels, true);

        axisLabelNodes.exit().remove();

        svg.selectAll('text.axis-labels').text(function (d, i) {
          return d.name;
        }).classed(_ParallelCoordinates2.default.annotatedAxisText, function (d, i) {
          return d.annotated;
        }).on('click', function (d, i) {
          model.axes.clearSelection(i);
        }).attr('text-anchor', function (d, i) {
          return d.align;
        }).attr('transform', function (d, i) {
          return 'translate(' + d.centerX + ', ' + ypos + ')';
        });
      }
    }

    function drawAxisTicks(tickDataModel) {
      // Manage the svg dom for the axis ticks
      var svg = _d2.default.select(model.container).select('svg');
      var ticksGroup = svg.select('g.axis-ticks');
      var axisTickNodes = ticksGroup.selectAll('text.axis-ticks').data(tickDataModel);

      axisTickNodes.enter().append('text').classed('axis-ticks', true).classed(_ParallelCoordinates2.default.axisTicks, true);

      axisTickNodes.exit().remove();

      var formatter = _d2.default.format('.3s');
      ticksGroup.selectAll('text.axis-ticks').text(function (d, i) {
        return formatter(d.value);
      }).attr('text-anchor', function (d, i) {
        return d.align;
      }).attr('transform', function (d, i) {
        return 'translate(' + d.xpos + ', ' + d.ypos + ')';
      });
    }

    function axisMouseDragHandler(data, index) {
      var svg = _d2.default.select(model.container).select('svg');
      var coords = _d2.default.mouse(model.container);
      var pendingSelection = svg.select('rect.axis-selection-pending');
      if (pendingSelection) {
        var rectHeight = coords[1] - pendingSelection.attr('data-initial-y');
        if (rectHeight >= 0) {
          pendingSelection.attr('height', rectHeight);
        } else {
          pendingSelection.attr('transform', 'translate(' + pendingSelection.attr('data-initial-x') + ', ' + coords[1] + ')').attr('height', -rectHeight);
        }
      }
    }

    function drawAxes(axesCenters) {
      if (axesCenters.length <= 1) {
        // let's not do anything if we don't have enough axes for rendering.
        return;
      }

      var svg = _d2.default.select(model.container).select('svg');
      var axisLineGroup = svg.select('g.axis-lines');

      // Now manage the svg dom
      var axisLineNodes = axisLineGroup.selectAll('rect.axis-lines').data(axesCenters);

      axisLineNodes.enter().append('rect').classed('axis-lines', true).classed(_ParallelCoordinates2.default.axisLines, true);

      axisLineNodes.exit().remove();

      axisLineGroup.selectAll('rect.axis-lines').classed(_ParallelCoordinates2.default.controlItem, true).attr('height', model.canvasArea.height - model.borderOffsetBottom - model.borderOffsetTop).attr('width', model.axisWidth).attr('transform', function (d, i) {
        return 'translate(' + (d - model.axisWidth / 2) + ', ' + model.borderOffsetTop + ')';
      }).on('mousedown', function (d, i) {
        _d2.default.event.preventDefault();
        var coords = _d2.default.mouse(model.container);
        var initialY = coords[1];
        var initialX = d - model.selectionBarWidth / 2;
        var prect = svg.append('rect');
        prect.classed('axis-selection-pending', true).classed(_ParallelCoordinates2.default.selectionBars, true).attr('height', 0.5).attr('width', model.selectionBarWidth).attr('transform', 'translate(' + initialX + ', ' + initialY + ')').attr('data-initial-x', initialX).attr('data-initial-y', initialY).attr('data-index', i);

        svg.on('mousemove', axisMouseDragHandler);
        svg.on('mouseup', function (data, index) {
          var finalY = _d2.default.mouse(model.container)[1];
          svg.select('rect.axis-selection-pending').remove();
          svg.on('mousemove', null);
          svg.on('mouseup', null);

          var axis = model.axes.getAxis(i);
          model.axes.addSelection(i, screenToData(model, initialY, axis), screenToData(model, finalY, axis));
        });
      });
    }

    function drawPolygons(axesCenters, gCtx, idxOne, idxTwo, histogram, colors) {
      if (!histogram) {
        return;
      }
      var axisOne = model.axes.getAxis(idxOne);
      var axisTwo = model.axes.getAxis(idxTwo);
      var xleft = axesCenters[idxOne];
      var xright = axesCenters[idxTwo];
      var bin = null;
      var opacity = 0.0;
      var yleft1 = 0.0;
      var yleft2 = 0.0;
      var yright1 = 0.0;
      var yright2 = 0.0;
      var yLeftMin = 0;
      var yLeftMax = 0;
      var yRightMin = 0;
      var yRightMax = 0;

      // Ensure proper range for X
      var deltaOne = (axisOne.range[1] - axisOne.range[0]) / (histogram.numberOfBins || model.numberOfBins);
      var deltaTwo = (axisTwo.range[1] - axisTwo.range[0]) / (histogram.numberOfBins || model.numberOfBins);

      for (var i = 0; i < histogram.bins.length; ++i) {
        bin = histogram.bins[i];
        opacity = affine(0, bin.count, model.maxBinCountForOpacityCalculation, 0.0, 1.0);
        yleft1 = dataToScreen(model, bin.x, axisOne);
        yleft2 = dataToScreen(model, bin.x + deltaOne, axisOne);
        yright1 = dataToScreen(model, bin.y, axisTwo);
        yright2 = dataToScreen(model, bin.y + deltaTwo, axisTwo);
        yLeftMin = 0;
        yLeftMax = 0;
        yRightMin = 0;
        yRightMax = 0;

        if (yleft1 <= yleft2) {
          yLeftMin = yleft1;
          yLeftMax = yleft2;
        } else {
          yLeftMin = yleft2;
          yLeftMax = yleft1;
        }

        if (yright1 <= yright2) {
          yRightMin = yright1;
          yRightMax = yright2;
        } else {
          yRightMin = yright2;
          yRightMax = yright1;
        }

        gCtx.beginPath();
        gCtx.moveTo(xleft, yLeftMin);
        gCtx.lineTo(xleft, yLeftMax);
        gCtx.lineTo(xright, yRightMax);
        gCtx.lineTo(xright, yRightMin);
        gCtx.closePath();
        gCtx.fillStyle = 'rgba(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
        gCtx.fill();
      }
    }

    publicAPI.render = function () {
      if (!model.allBgHistogram2dData || !model.axes.canRender() || !model.container || model.containerHidden === true) {
        _d2.default.select(model.container).select('svg.parallel-coords-overlay').classed(_ParallelCoordinates2.default.hidden, true);
        _d2.default.select(model.container).select('canvas').classed(_ParallelCoordinates2.default.hidden, true);
        _d2.default.select(model.container).select('div.parallel-coords-placeholder').classed(_ParallelCoordinates2.default.hidden, false);
        return;
      }

      _d2.default.select(model.container).select('svg.parallel-coords-overlay').classed(_ParallelCoordinates2.default.hidden, false);
      _d2.default.select(model.container).select('canvas').classed(_ParallelCoordinates2.default.hidden, false);
      _d2.default.select(model.container).select('div.parallel-coords-placeholder').classed(_ParallelCoordinates2.default.hidden, true);

      model.ctx.globalAlpha = 1.0;

      // Update canvas area and drawable info
      updateSizeInformation();

      model.hoverIndicatorHeight = model.drawableArea.height / model.numberOfBins;

      model.fgCanvas.width = model.canvas.width;
      model.fgCanvas.height = model.canvas.height;
      model.bgCanvas.width = model.canvas.width;
      model.bgCanvas.height = model.canvas.height;

      var svg = _d2.default.select(model.container).select('svg');
      svg.attr('width', model.canvas.width).attr('height', model.canvas.height).classed('parallel-coords-overlay', true).classed(_ParallelCoordinates2.default.parallelCoordsOverlay, true);

      if (_d2.default.select(model.container).selectAll('g').empty()) {
        // Have not added groups yet, do so now.  Order matters.
        svg.append('g').classed('axis-lines', true);
        svg.append('g').classed('selection-bars', true);
        svg.append('g').classed('hover-bins', true);
        svg.append('g').classed('axis-annotation-indicators', true);
        svg.append('g').classed('axis-control-elements', true);
        svg.append('g').classed('axis-ticks', true);
        svg.append('g').classed('glyphs', true);
      }

      model.ctx.clearRect(0, 0, model.canvasArea.width, model.canvasArea.height);
      model.fgCtx.clearRect(0, 0, model.canvasArea.width, model.canvasArea.height);
      model.bgCtx.clearRect(0, 0, model.canvasArea.width, model.canvasArea.height);

      // First lay down the "context" polygons
      model.maxBinCountForOpacityCalculation = model.allBgHistogram2dData.maxCount;

      var nbPolyDraw = model.axes.getNumberOf2DHistogram();
      var axesCenters = model.axes.extractAxesCenters(model);
      if (!model.showOnlySelection) {
        for (var j = 0; j < nbPolyDraw; ++j) {
          var axisOne = model.axes.getAxis(j);
          var axisTwo = model.axes.getAxis(j + 1);
          var histo2D = model.allBgHistogram2dData[axisOne.name] ? model.allBgHistogram2dData[axisOne.name][axisTwo.name] : null;
          drawPolygons(axesCenters, model.bgCtx, j, j + 1, histo2D, model.polygonColors);
        }

        model.ctx.globalAlpha = model.polygonOpacityAdjustment;
        model.ctx.drawImage(model.bgCanvas, 0, 0, model.canvasArea.width, model.canvasArea.height, 0, 0, model.canvasArea.width, model.canvasArea.height);
      }

      // If there is a selection, draw that (the "focus") on top of the polygons
      if (model.selectionData) {
        (function () {
          // Extract selection histogram2d
          var polygonsQueue = [];
          var maxCount = 0;
          var missingData = false;

          var processHistogram = function processHistogram(h, k) {
            if (drawSelectionData(h.role.score)) {
              maxCount = maxCount > h.maxCount ? maxCount : h.maxCount;
              // Add in queue
              polygonsQueue.push([axesCenters, model.fgCtx, k, k + 1, h, scoreToColor[h.role.score] || model.selectionColors]);
            }
          };

          var _loop = function _loop(k) {
            var histo = model.selectionData && model.selectionData[model.axes.getAxis(k).name] ? model.selectionData[model.axes.getAxis(k).name][model.axes.getAxis(k + 1).name] : null;
            missingData = !histo;

            if (histo) {
              histo.forEach(function (h) {
                return processHistogram(h, k);
              });
            }
          };

          for (var k = 0; k < nbPolyDraw && !missingData; ++k) {
            _loop(k);
          }

          if (!missingData) {
            model.maxBinCountForOpacityCalculation = maxCount;
            polygonsQueue.forEach(function (req) {
              return drawPolygons.apply(undefined, _toConsumableArray(req));
            });
            model.ctx.globalAlpha = model.selectionOpacityAdjustment;
            model.ctx.drawImage(model.fgCanvas, 0, 0, model.canvasArea.width, model.canvasArea.height, 0, 0, model.canvasArea.width, model.canvasArea.height);
          }
        })();
      }

      model.ctx.globalAlpha = 1.0;

      // Now draw all the decorations and controls
      drawAxisLabels(model.axes.extractLabels(model));
      drawAxisTicks(model.axes.extractAxisTicks(model));
      drawAxes(axesCenters);
      drawSelectionBars(model.axes.extractSelections(model, drawSelectionData));
      drawAxisControls(model.axes.extractAxesControl(model));
    };

    // -------------- Used to speed up action of opacity sliders ----------------
    // function fastRender() {
    //   model.ctx.clearRect(0, 0, model.canvasArea.width, model.canvasArea.height);

    //   model.ctx.globalAlpha = model.polygonOpacityAdjustment;
    //   model.ctx.drawImage(model.bgCanvas,
    //     0, 0, model.canvasArea.width, model.canvasArea.height,
    //     0, 0, model.canvasArea.width, model.canvasArea.height);

    //   model.ctx.globalAlpha = model.selectionOpacityAdjustment;
    //   model.ctx.drawImage(model.fgCanvas,
    //     0, 0, model.canvasArea.width, model.canvasArea.height,
    //     0, 0, model.canvasArea.width, model.canvasArea.height);

    //   model.ctx.globalAlpha = 1.0;

    //   const axesCenters = model.axes.extractAxesCenters(model);

    //   drawAxes(axesCenters);
    //   drawSelectionBars(model.axes.extractSelections(model));
    //   drawAxisLabels(model.axes.extractLabels(model));
    //   drawAxisControls(model.axes.extractAxesControl(model));
    // }

    publicAPI.propagateAnnotationInsteadOfSelection = function () {
      var useAnnotation = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      var defaultScore = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var defaultWeight = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      model.useAnnotation = useAnnotation;
      model.defaultScore = defaultScore;
      model.defaultWeight = defaultWeight;
    };

    publicAPI.setVisibleScoresForSelection = function (scoreList) {
      model.visibleScores = scoreList;
      if (model.selectionDataSubscription && model.visibleScores && model.propagatePartitionScores) {
        model.selectionDataSubscription.update(model.axes.getAxesPairs(), model.visibleScores);
      }
    };

    publicAPI.setScores = function (scores) {
      model.scores = scores;
      if (!model.visibleScores && scores) {
        publicAPI.setVisibleScoresForSelection(scores.map(function (score, idx) {
          return idx;
        }));
      }
      if (model.scores) {
        model.scores.forEach(function (score, idx) {
          scoreToColor[idx] = toColorArray(score.color);
        });
      }
    };

    if (model.provider && model.provider.isA('ScoresProvider')) {
      publicAPI.setScores(model.provider.getScores());
      model.subscriptions.push(model.provider.onScoresChange(publicAPI.setScores));
    }

    publicAPI.resize = function () {
      if (!model.container) {
        return;
      }
      var clientRect = model.canvas.parentElement.getBoundingClientRect();
      model.canvas.setAttribute('width', clientRect.width);
      model.canvas.setAttribute('height', clientRect.height);
      _d2.default.select(model.container).select('svg').selectAll('rect.hover-bin-indicator').remove();
      if (clientRect.width !== 0 && clientRect.height !== 0) {
        model.containerHidden = false;
        publicAPI.render();
      } else {
        model.containerHidden = true;
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
        model.container.innerHTML = _body2.default;
        _d2.default.select(model.container).select('div.parallel-coords-placeholder').select('img').attr('src', _ParallelCoordsIconSmall2.default);
        model.container.appendChild(model.canvas);
        _d2.default.select(model.container).append('svg');
        publicAPI.resize();
      }
    };

    function binNumberToScreenOffset(binNumber, rightSideUp) {
      var screenY = affine(0, binNumber, model.numberOfBins, model.canvasArea.height - model.borderOffsetBottom, model.borderOffsetTop);
      screenY -= model.hoverIndicatorHeight;

      if (rightSideUp === false) {
        screenY = affine(0, binNumber, model.numberOfBins, model.borderOffsetTop, model.canvasArea.height - model.borderOffsetBottom);
      }

      return perfRound(screenY);
    }

    function handleHoverBinUpdate(data) {
      if (!model.axes.canRender() || model.containerHidden === true) {
        // let's not do anything if we don't have enough axes for rendering.
        return;
      }

      // First update our internal data model
      model.hoverBinData = [];
      Object.keys(data.state).forEach(function (pName) {
        var binList = data.state[pName];
        if (model.axes.getAxisByName(pName) && binList.indexOf(-1) === -1) {
          for (var i = 0; i < binList.length; ++i) {
            model.hoverBinData.push({
              name: pName,
              bin: binList[i]
            });
          }
        }
      });

      // Now manage the svg dom
      var hoverBinNodes = _d2.default.select(model.container).select('svg').select('g.hover-bins').selectAll('rect.hover-bin-indicator').data(model.hoverBinData);

      hoverBinNodes.enter().append('rect').classed(_ParallelCoordinates2.default.hoverBinIndicator, true).classed('hover-bin-indicator', true);

      hoverBinNodes.exit().remove();

      var axesCenters = model.axes.extractAxesCenters(model);
      _d2.default.select(model.container).select('svg').select('g.hover-bins').selectAll('rect.hover-bin-indicator').attr('height', model.hoverIndicatorHeight).attr('width', model.hoverIndicatorWidth).attr('transform', function (d, i) {
        var axis = model.axes.getAxisByName(d.name);
        var screenOffset = binNumberToScreenOffset(d.bin, !axis.isUpsideDown());
        return 'translate(' + (axesCenters[axis.idx] - model.hoverIndicatorWidth / 2) + ', ' + screenOffset + ')';
      });
    }

    // Attach listener to provider
    model.subscriptions.push({ unsubscribe: publicAPI.setContainer });

    // Handle active field change, update axes
    if (model.provider.isA('FieldProvider')) {
      // Monitor any change
      model.subscriptions.push(model.provider.onFieldChange(function () {
        model.axes.updateAxes(model.provider.getActiveFieldNames().map(function (name) {
          return { name: name, range: model.provider.getField(name).range };
        }));
      }));
      // Use initial state
      model.axes.updateAxes(model.provider.getActiveFieldNames().map(function (name) {
        return { name: name, range: model.provider.getField(name).range };
      }));
    }

    // Handle bin hovering
    if (model.provider.onHoverBinChange) {
      model.subscriptions.push(model.provider.onHoverBinChange(handleHoverBinUpdate));
    }

    if (model.provider.isA('Histogram2DProvider')) {
      model.histogram2DDataSubscription = model.provider.subscribeToHistogram2D(function (allBgHistogram2d) {
        // Update axis range
        model.axes.getAxesPairs().forEach(function (pair, idx) {
          var hist2d = allBgHistogram2d[pair[0]][pair[1]];
          if (hist2d) {
            model.axes.getAxis(idx).updateRange(hist2d.x.extent);
            model.axes.getAxis(idx + 1).updateRange(hist2d.y.extent);
          }
        });

        var topLevelList = Object.keys(allBgHistogram2d);
        // We always get a maxCount, anything additional must be histogram2d
        if (topLevelList.length > 1) {
          model.allBgHistogram2dData = allBgHistogram2d;
          publicAPI.render();
        } else {
          model.allBgHistogram2dData = null;
          publicAPI.render();
        }
      }, model.axes.getAxesPairs(), {
        numberOfBins: model.numberOfBins,
        partial: false
      });

      model.subscriptions.push(model.axes.onAxisListChange(function (axisPairs) {
        model.histogram2DDataSubscription.update(axisPairs);
      }));

      model.subscriptions.push(model.histogram2DDataSubscription);
    }

    if (model.provider.isA('SelectionProvider')) {
      model.selectionDataSubscription = model.provider.subscribeToDataSelection('histogram2d', function (data) {
        model.selectionData = data;
        if (model.provider.getAnnotation()) {
          model.axes.resetSelections(model.provider.getAnnotation().selection, false, model.provider.getAnnotation().score, scoreToColor);
          if (data['##annotationGeneration##'] !== undefined) {
            if (model.provider.getAnnotation().generation === data['##annotationGeneration##']) {
              // render from selection data change (same generation)
              publicAPI.render();
            }
          } else {
            // render from selection data change (no generation)
            publicAPI.render();
          }
        } else {
          // render from selection data change (no annotation)
          publicAPI.render();
        }
      }, model.axes.getAxesPairs(), {
        partitionScores: model.visibleScores,
        numberOfBins: model.numberOfBins
      });

      model.subscriptions.push(model.selectionDataSubscription);

      model.subscriptions.push(model.provider.onSelectionChange(function (sel) {
        if (!model.useAnnotation) {
          if (sel && sel.type === 'empty') {
            model.selectionData = null;
          }
          model.axes.resetSelections(sel, false);
          publicAPI.render();
        }
      }));
      model.subscriptions.push(model.provider.onAnnotationChange(function (annotation) {
        if (annotation && annotation.selection.type === 'empty') {
          model.selectionData = null;
        }

        if (lastAnnotationPushed && annotation.selection.type === 'range' && annotation.id === lastAnnotationPushed.id && annotation.generation === lastAnnotationPushed.generation + 1) {
          // Assume that it is still ours but edited by someone else
          lastAnnotationPushed = annotation;

          // Capture the score and update our default
          model.defaultScore = lastAnnotationPushed.score[0];
        }
        model.axes.resetSelections(annotation.selection, false, annotation.score, scoreToColor);
      }));
      model.subscriptions.push(model.axes.onSelectionChange(function () {
        if (model.useAnnotation) {
          lastAnnotationPushed = model.provider.getAnnotation();

          // If parttion annotation special handle
          if (lastAnnotationPushed && lastAnnotationPushed.selection.type === 'partition') {
            var axisIdxToClear = model.axes.getAxesNames().indexOf(lastAnnotationPushed.selection.partition.variable);
            if (axisIdxToClear !== -1) {
              model.axes.getAxis(axisIdxToClear).clearSelection();
              model.axes.selection = null;
            }
          }

          var selection = model.axes.getSelection();
          if (selection.type === 'empty') {
            lastAnnotationPushed = _AnnotationBuilder2.default.EMPTY_ANNOTATION;
          } else if (!lastAnnotationPushed || model.provider.shouldCreateNewAnnotation() || lastAnnotationPushed.selection.type !== 'range') {
            lastAnnotationPushed = _AnnotationBuilder2.default.annotation(selection, [model.defaultScore], model.defaultWeight);
          } else {
            lastAnnotationPushed = _AnnotationBuilder2.default.update(lastAnnotationPushed, {
              selection: selection,
              score: [model.defaultScore],
              weight: model.defaultWeight
            });
          }
          _AnnotationBuilder2.default.updateReadOnlyFlag(lastAnnotationPushed, model.readOnlyFields);
          model.provider.setAnnotation(lastAnnotationPushed);
        } else {
          model.provider.setSelection(model.axes.getSelection());
        }
      }));
      model.subscriptions.push(model.axes.onAxisListChange(function (axisPairs) {
        model.selectionDataSubscription.update(axisPairs);
      }));
    } else {
      model.subscriptions.push(model.axes.onSelectionChange(function () {
        publicAPI.render();
      }));
    }

    publicAPI.setContainer(model.container);
    updateSizeInformation();

    publicAPI.setNumberOfBins = function (numberOfBins) {
      model.numberOfBins = numberOfBins;
      if (model.selectionDataSubscription) {
        model.selectionDataSubscription.update(model.axes.getAxesPairs(), { numberOfBins: numberOfBins });
      }
      if (model.histogram2DDataSubscription) {
        model.histogram2DDataSubscription.update(model.axes.getAxesPairs(), { numberOfBins: numberOfBins });
      }
    };
  }

  // ----------------------------------------------------------------------------
  // Object factory
  // ----------------------------------------------------------------------------

  var DEFAULT_VALUES = {
    container: null,
    provider: null,
    needData: true,

    containerHidden: false,

    borderOffsetTop: 35,
    borderOffsetRight: 12,
    borderOffsetBottom: 45,
    borderOffsetLeft: 12,

    axisWidth: 6,
    selectionBarWidth: 8,

    polygonColors: [0, 0, 0],
    selectionColors: [70, 130, 180],

    maxBinCountForOpacityCalculation: 0,

    selectionOpacityAdjustment: 1,
    polygonOpacityAdjustment: 1,

    hoverIndicatorHeight: 10,
    hoverIndicatorWidth: 7,

    numberOfBins: 32,

    useAnnotation: false,
    defaultScore: 0,
    defaultWeight: 1,

    showOnlySelection: false,

    visibleScores: [],
    propagatePartitionScores: false
  };

  // ----------------------------------------------------------------------------

  // scores: [{ name: 'Yes', color: '#00C900', value: 1 }, ...]
  function extend(publicAPI, model) {
    var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    Object.assign(model, DEFAULT_VALUES, initialValues);

    _CompositeClosureHelper2.default.destroy(publicAPI, model);
    _CompositeClosureHelper2.default.isA(publicAPI, model, 'VizComponent');
    _CompositeClosureHelper2.default.get(publicAPI, model, ['provider', 'container', 'showOnlySelection', 'visibleScores', 'propagatePartitionScores', 'numberOfBins']);
    _CompositeClosureHelper2.default.set(publicAPI, model, ['showOnlySelection', 'propagatePartitionScores']);
    _CompositeClosureHelper2.default.dynamicArray(publicAPI, model, 'readOnlyFields');

    parallelCoordinate(publicAPI, model);
  }

  // ----------------------------------------------------------------------------

  var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

  // ----------------------------------------------------------------------------

  exports.default = { newInstance: newInstance, extend: extend };
});