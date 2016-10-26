'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = init;

var _d2 = require('d3');

var _d3 = _interopRequireDefault(_d2);

var _HistogramSelector = require('PVWStyle/InfoVizNative/HistogramSelector.mcss');

var _HistogramSelector2 = _interopRequireDefault(_HistogramSelector);

var _SelectionBuilder = require('../../../Common/Misc/SelectionBuilder');

var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

var _AnnotationBuilder = require('../../../Common/Misc/AnnotationBuilder');

var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import downArrowImage from './down_arrow.png';

function init(inPublicAPI, inModel) {
  var publicAPI = inPublicAPI;
  var model = inModel;
  var displayOnlyScored = false;
  var scorePopupDiv = null;
  var dividerPopupDiv = null;
  var dividerValuePopupDiv = null;

  publicAPI.setScores = function (scores, defaultScore) {
    // TODO make sure model.scores has the right format?
    model.scores = scores;
    model.defaultScore = defaultScore;
    if (model.scores) {
      // setup a bgColor
      model.scores.forEach(function (score, i) {
        var lightness = _d3.default.hsl(score.color).l;
        // make bg darker for light colors.
        var blend = lightness >= 0.45 ? 0.4 : 0.2;
        var interp = _d3.default.interpolateRgb('#fff', score.color);
        score.bgColor = interp(blend);
      });
    }
  };

  function enabled() {
    return model.scores !== undefined;
  }

  if (model.provider.isA('ScoresProvider')) {
    publicAPI.setScores(model.provider.getScores(), model.provider.getDefaultScore());
  }

  function defaultFieldData() {
    return {
      scoreDirty: false,
      annotation: null
    };
  }

  function createDefaultDivider(val, uncert) {
    return {
      value: val,
      uncertainty: uncert
    };
  }

  function getHistRange(def) {
    var minRange = def.range[0];
    var maxRange = def.range[1];
    if (def.hobj) {
      minRange = def.hobj.min;
      maxRange = def.hobj.max;
    }
    if (minRange === maxRange) maxRange += 1;
    return [minRange, maxRange];
  }
  // add implicit bounds for the histogram min/max to dividers list
  function getRegionBounds(def) {
    var _getHistRange = getHistRange(def);

    var _getHistRange2 = _slicedToArray(_getHistRange, 2);

    var minRange = _getHistRange2[0];
    var maxRange = _getHistRange2[1];

    return [minRange].concat(def.dividers.map(function (div) {
      return div.value;
    }), maxRange);
  }

  function getUncertScale(def) {
    // handle a zero range (like from the cumulative score histogram)
    // const [minRange, maxRange] = getHistRange(def);
    // return (maxRange - minRange);

    // We are not going to scale uncertainty - use values in
    // the same units as the histogram itself
    return 1.0;
  }

  // Translate our dividers and regions into an annotation
  // suitable for scoring this histogram.
  function dividersToPartition(def, scores) {
    if (!def.regions || !def.dividers || !scores) return null;
    if (def.regions.length !== def.dividers.length + 1) return null;
    var uncertScale = getUncertScale(def);

    var partitionSelection = _SelectionBuilder2.default.partition(def.name, def.dividers);
    partitionSelection.partition.dividers.forEach(function (div, index) {
      div.uncertainty *= uncertScale;
    });
    // console.log('DBG partitionSelection', JSON.stringify(partitionSelection, 2));

    // Construct a partition annotation:
    var partitionAnnotation = null;
    if (def.annotation && !model.provider.shouldCreateNewAnnotation()) {
      partitionAnnotation = _AnnotationBuilder2.default.update(def.annotation, { selection: partitionSelection, score: def.regions });
    } else {
      partitionAnnotation = _AnnotationBuilder2.default.annotation(partitionSelection, def.regions, 1, '');
    }
    _AnnotationBuilder2.default.updateReadOnlyFlag(partitionAnnotation, model.readOnlyFields);
    return partitionAnnotation;
  }

  // retrieve annotation, and re-create dividers and regions
  function partitionToDividers(scoreData, def, scores) {
    // console.log('DBG return', JSON.stringify(scoreData, null, 2));
    var uncertScale = getUncertScale(def);
    var regions = scoreData.score;
    var dividers = JSON.parse(JSON.stringify(scoreData.selection.partition.dividers));
    dividers.forEach(function (div, index) {
      div.uncertainty *= 1 / uncertScale;
    });

    // don't replace the default region with an empty region, so UI can display the default region.
    if (regions.length > 0 && !(regions.length === 1 && regions[0] === model.defaultScore)) {
      def.regions = [].concat(regions);
      def.dividers = dividers;
    }
  }

  // communicate with the server which regions/dividers have changed.
  function sendScores(def) {
    var scoreData = dividersToPartition(def, model.scores);
    if (scoreData === null) {
      console.error('Cannot translate scores to send to provider');
      return;
    }
    if (model.provider.isA('PartitionProvider')) {
      model.provider.changePartition(def.name, scoreData);
      def.scoreDirty = true;
      // set def.scoreDirty, to trigger a load of data. We'll use the current data
      // until the server returns new data - see addSubscriptions() ..
      // model.provider.onPartitionReady() below, which sets scoreDirty again to
      // begin using the new data.
    }
    if (model.provider.isA('SelectionProvider')) {
      if (!scoreData.name) {
        scoreData.name = scoreData.selection.partition.variable + ' (partition)';
      }
      model.provider.setAnnotation(scoreData);
    }
  }

  // retrieve regions/dividers from the server.
  function getScores(def) {
    if (def.scoreDirty && model.provider.isA('PartitionProvider')) {
      if (model.provider.loadPartition(def.name)) {
        var scoreData = model.provider.getPartition(def.name);
        partitionToDividers(scoreData, def, model.scores);
        def.scoreDirty = false;
      }
    }
  }

  function showScore(def) {
    // show the regions when: editing, or when they are non-default. CSS rule makes visible on hover.
    return def.editScore || typeof def.regions !== 'undefined' && (def.regions.length > 1 || def.regions[0] !== model.defaultScore);
  }

  function setEditScore(def, newEditScore) {
    def.editScore = newEditScore;
    // set existing annotation as current if we activate for editing
    if (def.editScore && showScore(def) && def.annotation) {
      // TODO special 'active' method to call, instead of an edit?
      sendScores(def);
    }
    publicAPI.render(def.name);
    // if one histogram is being edited, the others should be inactive.
    if (newEditScore) {
      Object.keys(model.fieldData).forEach(function (key) {
        var d = model.fieldData[key];
        if (d !== def) {
          if (d.editScore) {
            d.editScore = false;
            publicAPI.render(d.name);
          }
        }
      });
    }
  }

  publicAPI.setDefaultScorePartition = function (fieldName) {
    var def = model.fieldData[fieldName];
    if (def) {
      // create a divider halfway through.

      var _getHistRange3 = getHistRange(def);

      var _getHistRange4 = _slicedToArray(_getHistRange3, 2);

      var minRange = _getHistRange4[0];
      var maxRange = _getHistRange4[1];

      def.dividers = [createDefaultDivider(0.5 * (minRange + maxRange), 0)];
      // set regions to 'no' | 'yes'
      def.regions = [0, 2];
      sendScores(def);
      // set mode that prevents editing the annotation, except for the single divider.
      def.lockAnnot = true;
      setEditScore(def, true);
    } else {
      def.lockAnnot = false;
    }
  };

  var scoredHeaderClick = function scoredHeaderClick(d) {
    displayOnlyScored = !displayOnlyScored;
    publicAPI.render();
  };

  function getDisplayOnlyScored() {
    return displayOnlyScored;
  }

  function numScoreIcons(def) {
    if (!enabled()) return 0;
    var count = 0;
    if (model.provider.getStoredAnnotation && !publicAPI.isFieldActionDisabled(def.name, 'save')) {
      count += 1;
    }
    if (!publicAPI.isFieldActionDisabled(def.name, 'score')) {
      count += 1;
    }
    return count;
  }

  function createScoreIcons(iconCell) {
    if (!enabled()) return;
    // create/save partition annotation
    if (model.provider.getStoredAnnotation) {
      iconCell.append('i').classed(_HistogramSelector2.default.noSaveIcon, true).on('click', function (d) {
        if (model.provider.getStoredAnnotation) {
          var annotation = d.annotation;
          var isSame = model.provider.getStoredAnnotation(annotation.id) ? annotation.generation === model.provider.getStoredAnnotation(annotation.id).generation : false;
          if (!isSame) {
            model.provider.setStoredAnnotation(annotation.id, annotation);
          } else {
            model.provider.setAnnotation(annotation);
          }
          publicAPI.render(d.name);
          if (_d3.default.event) _d3.default.event.stopPropagation();
        }
      });
    }

    // start/stop scoring
    iconCell.append('i').classed(_HistogramSelector2.default.scoreStartIcon, true).on('click', function (d) {
      setEditScore(d, !d.editScore);
      if (_d3.default.event) _d3.default.event.stopPropagation();
    });
  }

  function updateScoreIcons(iconCell, def) {
    if (!enabled()) return;

    if (model.provider.getStoredAnnotation) {
      // new/modified/unmodified annotation...
      if (def.annotation) {
        if (model.provider.getStoredAnnotation(def.annotation.id)) {
          var isSame = def.annotation.generation === model.provider.getStoredAnnotation(def.annotation.id).generation;
          if (isSame) {
            var isActive = def.annotation === model.provider.getAnnotation();
            iconCell.select('.' + _HistogramSelector2.default.jsSaveIcon).attr('class', isActive ? _HistogramSelector2.default.unchangedActiveSaveIcon : _HistogramSelector2.default.unchangedSaveIcon);
          } else {
            iconCell.select('.' + _HistogramSelector2.default.jsSaveIcon).attr('class', _HistogramSelector2.default.modifiedSaveIcon);
          }
        } else {
          iconCell.select('.' + _HistogramSelector2.default.jsSaveIcon).attr('class', _HistogramSelector2.default.newSaveIcon);
        }
      } else {
        iconCell.select('.' + _HistogramSelector2.default.jsSaveIcon).attr('class', _HistogramSelector2.default.noSaveIcon);
      }
    }

    iconCell.select('.' + _HistogramSelector2.default.jsScoreIcon).attr('class', def.editScore ? _HistogramSelector2.default.scoreEndIcon : _HistogramSelector2.default.scoreStartIcon);

    // Override icon if disabled
    if (publicAPI.isFieldActionDisabled(def.name, 'save')) {
      iconCell.select('.' + _HistogramSelector2.default.jsSaveIcon).attr('class', _HistogramSelector2.default.hideSaveIcon);
    }

    if (publicAPI.isFieldActionDisabled(def.name, 'score')) {
      iconCell.select('.' + _HistogramSelector2.default.jsScoreIcon).attr('class', _HistogramSelector2.default.hideScoreIcon);
    }
  }

  function createGroups(svgGr) {
    // scoring interface background group, must be behind.
    svgGr.insert('g', ':first-child').classed(_HistogramSelector2.default.jsScoreBackground, true);
    svgGr.append('g').classed(_HistogramSelector2.default.score, true);
  }

  function createHeader(header) {
    if (enabled()) {
      header.append('span').on('click', scoredHeaderClick).append('i').classed(_HistogramSelector2.default.jsShowScoredIcon, true);
      header.append('span').classed(_HistogramSelector2.default.jsScoredHeader, true).text('Only Scored').on('click', scoredHeaderClick);
    }
  }

  function updateHeader() {
    if (enabled()) {
      _d3.default.select(model.container).select('.' + _HistogramSelector2.default.jsShowScoredIcon)
      // apply class - 'false' should come first to not remove common base class.
      .classed(getDisplayOnlyScored() ? _HistogramSelector2.default.allScoredIcon : _HistogramSelector2.default.onlyScoredIcon, false).classed(!getDisplayOnlyScored() ? _HistogramSelector2.default.allScoredIcon : _HistogramSelector2.default.onlyScoredIcon, true);
    }
  }

  function createDragDivider(hitIndex, val, def, hobj) {
    var dragD = null;
    if (hitIndex >= 0) {
      // start modifying existing divider
      // it becomes a temporary copy if we go outside our bounds
      dragD = { index: hitIndex,
        newDivider: createDefaultDivider(undefined, def.dividers[hitIndex].uncertainty),
        savedUncert: def.dividers[hitIndex].uncertainty,
        low: hitIndex === 0 ? hobj.min : def.dividers[hitIndex - 1].value,
        high: hitIndex === def.dividers.length - 1 ? hobj.max : def.dividers[hitIndex + 1].value
      };
    } else {
      // create a temp divider to render.
      dragD = { index: -1,
        newDivider: createDefaultDivider(val, 0),
        savedUncert: 0,
        low: hobj.min,
        high: hobj.max
      };
    }
    return dragD;
  }

  // enforce that divider uncertainties can't overlap.
  // Look at neighboring dividers for boundaries on this divider's uncertainty.
  function clampDividerUncertainty(val, def, hitIndex, currentUncertainty) {
    if (hitIndex < 0) return currentUncertainty;

    var _getHistRange5 = getHistRange(def);

    var _getHistRange6 = _slicedToArray(_getHistRange5, 2);

    var minRange = _getHistRange6[0];
    var maxRange = _getHistRange6[1];

    var maxUncertainty = 0.5 * (maxRange - minRange);
    var uncertScale = getUncertScale(def);
    // Note comparison with low/high divider is signed. If val indicates divider has been
    // moved _past_ the neighboring divider, low/high will be negative.
    if (hitIndex > 0) {
      var low = def.dividers[hitIndex - 1].value + def.dividers[hitIndex - 1].uncertainty * uncertScale;
      maxUncertainty = Math.min(maxUncertainty, (val - low) / uncertScale);
    }
    if (hitIndex < def.dividers.length - 1) {
      var high = def.dividers[hitIndex + 1].value - def.dividers[hitIndex + 1].uncertainty * uncertScale;
      maxUncertainty = Math.min((high - val) / uncertScale, maxUncertainty);
    }
    // make sure uncertainty is zero when val has passed a neighbor.
    maxUncertainty = Math.max(maxUncertainty, 0);
    return Math.min(maxUncertainty, currentUncertainty);
  }

  // clamp the drag divider specifically
  function clampDragDividerUncertainty(val, def) {
    if (def.dragDivider.index < 0) return;

    def.dragDivider.newDivider.uncertainty = clampDividerUncertainty(val, def, def.dragDivider.index, def.dragDivider.savedUncert);
    def.dividers[def.dragDivider.index].uncertainty = def.dragDivider.newDivider.uncertainty;
  }

  function moveDragDivider(val, def) {
    if (!def.dragDivider) return;
    if (def.dragDivider.index >= 0) {
      // if we drag outside our bounds, make this a 'temporary' extra divider.
      if (val < def.dragDivider.low) {
        def.dragDivider.newDivider.value = val;
        def.dividers[def.dragDivider.index].value = def.dragDivider.low;
        clampDragDividerUncertainty(val, def);
        def.dividers[def.dragDivider.index].uncertainty = 0;
      } else if (val > def.dragDivider.high) {
        def.dragDivider.newDivider.value = val;
        def.dividers[def.dragDivider.index].value = def.dragDivider.high;
        clampDragDividerUncertainty(val, def);
        def.dividers[def.dragDivider.index].uncertainty = 0;
      } else {
        def.dividers[def.dragDivider.index].value = val;
        clampDragDividerUncertainty(val, def);
        def.dragDivider.newDivider.value = undefined;
      }
    } else {
      def.dragDivider.newDivider.value = val;
    }
  }

  // create a sorting helper method, to sort dividers based on div.value
  // D3 bug: just an accessor didn't work - must use comparator function
  var bisectDividers = _d3.default.bisector(function (a, b) {
    return a.value - b.value;
  }).left;

  // where are we (to the left of) in the divider list?
  // Did we hit one?
  function dividerPick(overCoords, def, marginPx, minVal) {
    var val = def.xScale.invert(overCoords[0]);
    var index = bisectDividers(def.dividers, createDefaultDivider(val));
    var hitIndex = -1;
    if (def.dividers.length > 0) {
      if (index === 0) {
        hitIndex = 0;
      } else if (index === def.dividers.length) {
        hitIndex = index - 1;
      } else {
        hitIndex = def.dividers[index].value - val < val - def.dividers[index - 1].value ? index : index - 1;
      }
      var margin = def.xScale.invert(marginPx) - minVal;
      // don't pick a divider outside the bounds of the histogram - pick the last region.
      if (Math.abs(def.dividers[hitIndex].value - val) > margin || val < def.hobj.min || val > def.hobj.max) {
        // we weren't close enough...
        hitIndex = -1;
      }
    }
    return [val, index, hitIndex];
  }

  function regionPick(overCoords, def, hobj) {
    if (def.dividers.length === 0 || def.regions.length <= 1) return 0;
    var val = def.xScale.invert(overCoords[0]);
    var hitIndex = bisectDividers(def.dividers, createDefaultDivider(val));
    return hitIndex;
  }

  function finishDivider(def, hobj) {
    var forceDelete = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!def.dragDivider) return;
    var val = def.dragDivider.newDivider.value;
    // if val is defined, we moved an existing divider inside
    // its region, and we just need to render. Otherwise...
    if (val !== undefined || forceDelete) {
      // drag 30 pixels out of the hist to delete.
      var dragOut = def.xScale.invert(30) - hobj.min;
      if (!def.lockAnnot && (forceDelete || val < hobj.min - dragOut || val > hobj.max + dragOut)) {
        if (def.dragDivider.index >= 0) {
          // delete a region.
          if (forceDelete || def.dividers[def.dragDivider.index].value === def.dragDivider.high) {
            def.regions.splice(def.dragDivider.index + 1, 1);
          } else {
            def.regions.splice(def.dragDivider.index, 1);
          }
          // delete the divider.
          def.dividers.splice(def.dragDivider.index, 1);
        }
      } else {
        // adding a divider, we make a new region.
        var replaceRegion = true;
        // if we moved a divider, delete the old region, unless it's one of the edge regions - those persist.
        if (def.dragDivider.index >= 0) {
          if (def.dividers[def.dragDivider.index].value === def.dragDivider.low && def.dragDivider.low !== hobj.min) {
            def.regions.splice(def.dragDivider.index, 1);
          } else if (def.dividers[def.dragDivider.index].value === def.dragDivider.high && def.dragDivider.high !== hobj.max) {
            def.regions.splice(def.dragDivider.index + 1, 1);
          } else {
            replaceRegion = false;
          }
          // delete the old divider
          def.dividers.splice(def.dragDivider.index, 1);
        }
        // add a new divider
        def.dragDivider.newDivider.value = Math.min(hobj.max, Math.max(hobj.min, val));
        // find the index based on dividers sorted by divider.value
        var index = bisectDividers(def.dividers, def.dragDivider.newDivider);
        def.dividers.splice(index, 0, def.dragDivider.newDivider);
        // add a new region if needed, copies the score of existing region.
        if (replaceRegion) {
          def.regions.splice(index, 0, def.regions[index]);
        }
      }
    } else if (def.dragDivider.index >= 0 && def.dividers[def.dragDivider.index].uncertainty !== def.dragDivider.newDivider.uncertainty) {
      def.dividers[def.dragDivider.index].uncertainty = def.dragDivider.newDivider.uncertainty;
    }
    // make sure uncertainties don't overlap.
    def.dividers.forEach(function (divider, index) {
      divider.uncertainty = clampDividerUncertainty(divider.value, def, index, divider.uncertainty);
    });
    sendScores(def);
    def.dragDivider = undefined;
  }

  function positionPopup(popupDiv, left, top) {
    var clientRect = model.listContainer.getBoundingClientRect();
    var popupRect = popupDiv.node().getBoundingClientRect();
    if (popupRect.width + left > clientRect.width) {
      popupDiv.style('left', 'auto');
      popupDiv.style('right', 0);
    } else {
      popupDiv.style('right', null);
      popupDiv.style('left', left + 'px');
    }

    if (popupRect.height + top > clientRect.height) {
      popupDiv.style('top', 'auto');
      popupDiv.style('bottom', 0);
    } else {
      popupDiv.style('bottom', null);
      popupDiv.style('top', top + 'px');
    }
  }

  function validateDividerVal(n) {
    // is it a finite float number?
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function showDividerPopup(dPopupDiv, selectedDef, hobj, coord) {
    var topMargin = 4;
    var rowHeight = 28;
    // 's' SI unit label won't work for a number entry field.
    var formatter = _d3.default.format('.4g');
    var uncertDispScale = 1; // was 100 for uncertainty as a %.

    dPopupDiv.style('display', null);
    positionPopup(dPopupDiv, coord[0] - topMargin - 0.5 * rowHeight, coord[1] + model.headerSize - (topMargin + 2 * rowHeight));

    var selDivider = selectedDef.dividers[selectedDef.dragDivider.index];
    var savedVal = selDivider.value;
    selectedDef.dragDivider.savedUncert = selDivider.uncertainty;
    dPopupDiv.on('mouseleave', function () {
      if (selectedDef.dragDivider) {
        moveDragDivider(savedVal, selectedDef);
        finishDivider(selectedDef, hobj);
      }
      dPopupDiv.style('display', 'none');
      selectedDef.dragDivider = undefined;
      publicAPI.render(selectedDef.name);
    });
    var uncertInput = dPopupDiv.select('.' + _HistogramSelector2.default.jsDividerUncertaintyInput);
    var valInput = dPopupDiv.select('.' + _HistogramSelector2.default.jsDividerValueInput).attr('value', formatter(selDivider.value)).property('value', formatter(selDivider.value)).on('input', function () {
      // typing values, show feedback.
      var val = _d3.default.event.target.value;
      if (!validateDividerVal(val)) val = savedVal;
      moveDragDivider(val, selectedDef);
      uncertInput.property('value', formatter(uncertDispScale * selectedDef.dragDivider.newDivider.uncertainty));
      publicAPI.render(selectedDef.name);
    }).on('change', function () {
      // committed to a value, show feedback.
      var val = _d3.default.event.target.value;
      if (!validateDividerVal(val)) val = savedVal;else {
        val = Math.min(hobj.max, Math.max(hobj.min, val));
        _d3.default.event.target.value = val;
        savedVal = val;
      }
      moveDragDivider(val, selectedDef);
      publicAPI.render(selectedDef.name);
    }).on('keyup', function () {
      // revert to last committed value
      if (_d3.default.event.key === 'Escape') {
        moveDragDivider(savedVal, selectedDef);
        dPopupDiv.on('mouseleave')();
      } else if (_d3.default.event.key === 'Enter' || _d3.default.event.key === 'Return') {
        if (selectedDef.dragDivider) {
          savedVal = selectedDef.dragDivider.newDivider.value === undefined ? selectedDef.dividers[selectedDef.dragDivider.index].value : selectedDef.dragDivider.newDivider.value;
        }
        // commit current value
        dPopupDiv.on('mouseleave')();
      }
    });
    // initial select/focus so use can immediately change the value.
    valInput.node().select();
    valInput.node().focus();

    uncertInput.attr('value', formatter(uncertDispScale * selDivider.uncertainty)).property('value', formatter(uncertDispScale * selDivider.uncertainty)).on('input', function () {
      // typing values, show feedback.
      var uncert = _d3.default.event.target.value;
      if (!validateDividerVal(uncert)) {
        if (selectedDef.dragDivider) uncert = selectedDef.dragDivider.savedUncert;
      } else {
        uncert /= uncertDispScale;
      }
      if (selectedDef.dragDivider) {
        selectedDef.dragDivider.newDivider.uncertainty = uncert;
        if (selectedDef.dragDivider.newDivider.value === undefined) {
          // don't use selDivider, might be out-of-date if the server sent us dividers.
          selectedDef.dividers[selectedDef.dragDivider.index].uncertainty = uncert;
        }
      }
      publicAPI.render(selectedDef.name);
    }).on('change', function () {
      // committed to a value, show feedback.
      var uncert = _d3.default.event.target.value;
      if (!validateDividerVal(uncert)) {
        if (selectedDef.dragDivider) uncert = selectedDef.dragDivider.savedUncert;
      } else {
        // uncertainty is a % between 0 and 0.5

        var _getHistRange7 = getHistRange(selectedDef);

        var _getHistRange8 = _slicedToArray(_getHistRange7, 2);

        var minRange = _getHistRange8[0];
        var maxRange = _getHistRange8[1];

        uncert = Math.min(0.5 * (maxRange - minRange), Math.max(0, uncert / uncertDispScale));
        _d3.default.event.target.value = formatter(uncertDispScale * uncert);
        if (selectedDef.dragDivider) selectedDef.dragDivider.savedUncert = uncert;
      }
      if (selectedDef.dragDivider) {
        selectedDef.dragDivider.newDivider.uncertainty = uncert;
        if (selectedDef.dragDivider.newDivider.value === undefined) {
          selectedDef.dividers[selectedDef.dragDivider.index].uncertainty = uncert;
        }
      }
      publicAPI.render(selectedDef.name);
    }).on('keyup', function () {
      if (_d3.default.event.key === 'Escape') {
        if (selectedDef.dragDivider) {
          selectedDef.dragDivider.newDivider.uncertainty = selectedDef.dragDivider.savedUncert;
        }
        dPopupDiv.on('mouseleave')();
      } else if (_d3.default.event.key === 'Enter' || _d3.default.event.key === 'Return') {
        if (selectedDef.dragDivider) {
          selectedDef.dragDivider.savedUncert = selectedDef.dragDivider.newDivider.uncertainty;
        }
        dPopupDiv.on('mouseleave')();
      }
    }).on('blur', function () {
      if (selectedDef.dragDivider) {
        var val = selectedDef.dragDivider.newDivider.value === undefined ? selectedDef.dividers[selectedDef.dragDivider.index].value : selectedDef.dragDivider.newDivider.value;
        clampDragDividerUncertainty(val, selectedDef);
        _d3.default.event.target.value = formatter(uncertDispScale * selectedDef.dragDivider.newDivider.uncertainty);
      }
      publicAPI.render(selectedDef.name);
    });
  }

  function showDividerValuePopup(dPopupDiv, selectedDef, hobj, coord) {
    var topMargin = 4;
    var rowHeight = 28;
    // 's' SI unit label won't work for a number entry field.
    var formatter = _d3.default.format('.4g');

    dPopupDiv.style('display', null);
    positionPopup(dPopupDiv, coord[0] - topMargin - 0.5 * rowHeight, coord[1] + model.headerSize - (topMargin + 0.5 * rowHeight));

    var selDivider = selectedDef.dividers[selectedDef.dragDivider.index];
    var savedVal = selDivider.value;
    selectedDef.dragDivider.savedUncert = selDivider.uncertainty;
    dPopupDiv.on('mouseleave', function () {
      if (selectedDef.dragDivider) {
        moveDragDivider(savedVal, selectedDef);
        finishDivider(selectedDef, hobj);
      }
      dPopupDiv.style('display', 'none');
      selectedDef.dragDivider = undefined;
      publicAPI.render();
    });
    var valInput = dPopupDiv.select('.' + _HistogramSelector2.default.jsDividerValueInput).attr('value', formatter(selDivider.value)).property('value', formatter(selDivider.value)).on('input', function () {
      // typing values, show feedback.
      var val = _d3.default.event.target.value;
      if (!validateDividerVal(val)) val = savedVal;
      moveDragDivider(val, selectedDef);
      publicAPI.render(selectedDef.name);
    }).on('change', function () {
      // committed to a value, show feedback.
      var val = _d3.default.event.target.value;
      if (!validateDividerVal(val)) val = savedVal;else {
        val = Math.min(hobj.max, Math.max(hobj.min, val));
        _d3.default.event.target.value = val;
        savedVal = val;
      }
      moveDragDivider(val, selectedDef);
      publicAPI.render(selectedDef.name);
    }).on('keyup', function () {
      // revert to last committed value
      if (_d3.default.event.key === 'Escape') {
        moveDragDivider(savedVal, selectedDef);
        dPopupDiv.on('mouseleave')();
      } else if (_d3.default.event.key === 'Enter' || _d3.default.event.key === 'Return') {
        // commit current value
        dPopupDiv.on('mouseleave')();
      }
    });
    // initial select/focus so use can immediately change the value.
    valInput.node().select();
    valInput.node().focus();
  }

  // Divider editing popup allows changing its value or uncertainty, or deleting it.
  function createDividerPopup() {
    var dPopupDiv = _d3.default.select(model.listContainer).append('div').classed(_HistogramSelector2.default.dividerPopup, true).style('display', 'none');
    var table = dPopupDiv.append('table');
    var tr1 = table.append('tr');
    tr1.append('td').classed(_HistogramSelector2.default.popupCell, true).text('Value:');
    tr1.append('td').classed(_HistogramSelector2.default.popupCell, true).append('input').classed(_HistogramSelector2.default.jsDividerValueInput, true).attr('type', 'number').attr('step', 'any').style('width', '6em');
    var tr2 = table.append('tr');
    tr2.append('td').classed(_HistogramSelector2.default.popupCell, true).text('Uncertainty:');
    tr2.append('td').classed(_HistogramSelector2.default.popupCell, true).append('input').classed(_HistogramSelector2.default.jsDividerUncertaintyInput, true).attr('type', 'number').attr('step', 'any').style('width', '6em');
    dPopupDiv.append('div').classed(_HistogramSelector2.default.scoreDashSpacer, true);
    dPopupDiv.append('div').style('text-align', 'center').append('input').classed(_HistogramSelector2.default.scoreButton, true).style('align', 'center').attr('type', 'button').attr('value', 'Delete Divider').on('click', function () {
      finishDivider(model.selectedDef, model.selectedDef.hobj, true);
      dPopupDiv.style('display', 'none');
      publicAPI.render();
    });
    return dPopupDiv;
  }
  // Divider editing popup allows changing its value, only.
  function createDividerValuePopup() {
    var dPopupDiv = _d3.default.select(model.listContainer).append('div').classed(_HistogramSelector2.default.dividerValuePopup, true).style('display', 'none');
    var table = dPopupDiv.append('table');
    var tr1 = table.append('tr');
    tr1.append('td').classed(_HistogramSelector2.default.popupCell, true).text('Value:');
    tr1.append('td').classed(_HistogramSelector2.default.popupCell, true).append('input').classed(_HistogramSelector2.default.jsDividerValueInput, true).attr('type', 'number').attr('step', 'any').style('width', '6em');
    return dPopupDiv;
  }

  function showScorePopup(sPopupDiv, coord, selRow) {
    // it seemed like a good idea to use getBoundingClientRect() to determine row height
    // but it returns all zeros when the popup has been invisible...
    var topMargin = 4;
    var rowHeight = 26;

    sPopupDiv.style('display', null);
    positionPopup(sPopupDiv, coord[0] - topMargin - 0.6 * rowHeight, coord[1] + model.headerSize - (topMargin + (0.6 + selRow) * rowHeight));

    sPopupDiv.selectAll('.' + _HistogramSelector2.default.jsScoreLabel).style('background-color', function (d, i) {
      return i === selRow ? d.bgColor : '#fff';
    });
  }

  function createScorePopup() {
    var sPopupDiv = _d3.default.select(model.listContainer).append('div').classed(_HistogramSelector2.default.scorePopup, true).style('display', 'none').on('mouseleave', function () {
      sPopupDiv.style('display', 'none');
      model.selectedDef.dragDivider = undefined;
    });
    // create radio-buttons that allow choosing the score for the selected region
    var scoreChoices = sPopupDiv.selectAll('.' + _HistogramSelector2.default.jsScoreChoice).data(model.scores);
    scoreChoices.enter().append('label').classed(_HistogramSelector2.default.scoreLabel, true).text(function (d) {
      return d.name;
    }).each(function myLabel(data, index) {
      // because we use 'each' and re-select the label, need to use parent 'index'
      // instead of 'i' in the (d, i) => functions below - i is always zero.
      var label = _d3.default.select(this);
      label.append('span').classed(_HistogramSelector2.default.scoreSwatch, true).style('background-color', function (d) {
        return d.color;
      });
      label.append('input').classed(_HistogramSelector2.default.scoreChoice, true).attr('name', 'score_choice_rb').attr('type', 'radio').attr('value', function (d) {
        return d.name;
      }).property('checked', function (d) {
        return index === model.defaultScore;
      }).on('click', function (d) {
        // use click, not change, so we get notified even when current value is chosen.
        var def = model.selectedDef;
        def.regions[def.hitRegionIndex] = index;
        def.dragDivider = undefined;
        sPopupDiv.style('display', 'none');
        sendScores(def);
        publicAPI.render();
      });
    });
    sPopupDiv.append('div').classed(_HistogramSelector2.default.scoreDashSpacer, true);
    // create a button for creating a new divider, so we don't require
    // the invisible alt/ctrl click to create one.
    sPopupDiv.append('input').classed(_HistogramSelector2.default.scoreButton, true).attr('type', 'button').attr('value', 'New Divider').on('click', function () {
      finishDivider(model.selectedDef, model.selectedDef.hobj);
      sPopupDiv.style('display', 'none');
      publicAPI.render();
    });
    return sPopupDiv;
  }

  function createPopups() {
    if (enabled()) {
      scorePopupDiv = _d3.default.select(model.listContainer).select('.' + _HistogramSelector2.default.jsScorePopup);
      if (scorePopupDiv.empty()) {
        scorePopupDiv = createScorePopup();
      }
      dividerPopupDiv = _d3.default.select(model.listContainer).select('.' + _HistogramSelector2.default.jsDividerPopup);
      if (dividerPopupDiv.empty()) {
        dividerPopupDiv = createDividerPopup();
      }
      dividerValuePopupDiv = _d3.default.select(model.listContainer).select('.' + _HistogramSelector2.default.jsDividerValuePopup);
      if (dividerValuePopupDiv.empty()) {
        dividerValuePopupDiv = createDividerValuePopup();
      }
    }
  }

  // when the Histogram1DProvider pushes a new histogram, it may have a new range.
  // If needed, proportionally scale dividers into the new range.
  function rescaleDividers(paramName, oldRangeMin, oldRangeMax) {
    if (model.fieldData[paramName] && model.fieldData[paramName].hobj) {
      (function () {
        var def = model.fieldData[paramName];
        var hobj = model.fieldData[paramName].hobj;
        if (hobj.min !== oldRangeMin || hobj.max !== oldRangeMax) {
          def.dividers.forEach(function (divider, index) {
            if (oldRangeMax === oldRangeMin) {
              // space dividers evenly in the middle - i.e. punt.
              divider.value = (index + 1) / (def.dividers.length + 1) * (hobj.max - hobj.min) + hobj.min;
            } else {
              // this set the divider to hobj.min if the new hobj.min === hobj.max.
              divider.value = (divider.value - oldRangeMin) / (oldRangeMax - oldRangeMin) * (hobj.max - hobj.min) + hobj.min;
            }
          });
          sendScores(def);
        }
      })();
    }
  }

  function editingScore(def) {
    return def.editScore;
  }

  function filterFieldNames(fieldNames) {
    if (getDisplayOnlyScored()) {
      // filter for fields that have scores
      return fieldNames.filter(function (name) {
        return showScore(model.fieldData[name]);
      });
    }
    return fieldNames;
  }

  function prepareItem(def, idx, svgGr, tdsl) {
    if (!enabled()) return;
    if (typeof def.dividers === 'undefined') {
      def.dividers = [];
      def.regions = [model.defaultScore];
      def.editScore = false;
      def.scoreDirty = true;
      def.lockAnnot = false;
    }
    var hobj = def.hobj;

    // retrieve scores from the server, if available.
    getScores(def, hobj);

    var gScore = svgGr.select('.' + _HistogramSelector2.default.jsScore);
    var drag = null;
    if (def.editScore) {
      (function () {
        // add temp dragged divider, if needed.
        var dividerData = typeof def.dragDivider !== 'undefined' && def.dragDivider.newDivider.value !== undefined ? def.dividers.concat(def.dragDivider.newDivider) : def.dividers;
        var dividers = gScore.selectAll('line').data(dividerData);
        dividers.enter().append('line');
        dividers.attr('x1', function (d) {
          return def.xScale(d.value);
        }).attr('y1', 0).attr('x2', function (d) {
          return def.xScale(d.value);
        }).attr('y2', function () {
          return model.histHeight;
        }).attr('stroke-width', 1).attr('stroke', 'black');
        dividers.exit().remove();

        var uncertScale = getUncertScale(def);
        var uncertRegions = gScore.selectAll('.' + _HistogramSelector2.default.jsScoreUncertainty).data(dividerData);
        uncertRegions.enter().append('rect').classed(_HistogramSelector2.default.jsScoreUncertainty, true).attr('rx', 8).attr('ry', 8);
        uncertRegions.attr('x', function (d) {
          return def.xScale(d.value - d.uncertainty * uncertScale);
        }).attr('y', 0)
        // to get a width, need to start from 'zero' of this scale, which is hobj.min
        .attr('width', function (d, i) {
          return def.xScale(hobj.min + 2 * d.uncertainty * uncertScale);
        }).attr('height', function () {
          return model.histHeight;
        }).attr('fill', '#000').attr('opacity', function (d) {
          return d.uncertainty > 0 ? '0.2' : '0';
        });
        uncertRegions.exit().remove();

        var dragDivLabel = gScore.select('.' + _HistogramSelector2.default.jsScoreDivLabel);
        if (typeof def.dragDivider !== 'undefined') {
          if (dragDivLabel.empty()) {
            dragDivLabel = gScore.append('text').classed(_HistogramSelector2.default.jsScoreDivLabel, true).attr('text-anchor', 'middle').attr('stroke', 'none').attr('background-color', '#fff').attr('dy', '.71em');
          }
          var formatter = _d3.default.format('.3s');
          var divVal = def.dragDivider.newDivider.value !== undefined ? def.dragDivider.newDivider.value : def.dividers[def.dragDivider.index].value;
          dragDivLabel.text(formatter(divVal)).attr('x', '' + def.xScale(divVal)).attr('y', '' + (model.histHeight + 2));
        } else if (!dragDivLabel.empty()) {
          dragDivLabel.remove();
        }

        // divider interaction events.
        // Drag flow: drag a divider inside its current neighbors.
        // A divider outside its neighbors or a new divider is a temp divider,
        // added to the end of the list when rendering. Doesn't affect regions that way.
        drag = _d3.default.behavior.drag().on('dragstart', function () {
          var overCoords = publicAPI.getMouseCoords(tdsl);

          var _dividerPick = dividerPick(overCoords, def, model.dragMargin, hobj.min);

          var _dividerPick2 = _slicedToArray(_dividerPick, 3);

          var val = _dividerPick2[0];
          var hitIndex = _dividerPick2[2];

          if (!def.lockAnnot && (_d3.default.event.sourceEvent.altKey || _d3.default.event.sourceEvent.ctrlKey)) {
            // create a temp divider to render.
            def.dragDivider = createDragDivider(-1, val, def, hobj);
            publicAPI.render();
          } else if (hitIndex >= 0) {
            // start dragging existing divider
            // it becomes a temporary copy if we go outside our bounds
            def.dragDivider = createDragDivider(hitIndex, undefined, def, hobj);
            publicAPI.render();
          }
        }).on('drag', function () {
          var overCoords = publicAPI.getMouseCoords(tdsl);
          if (typeof def.dragDivider === 'undefined' || scorePopupDiv.style('display') !== 'none' || dividerPopupDiv.style('display') !== 'none' || dividerValuePopupDiv.style('display') !== 'none') return;
          var val = def.xScale.invert(overCoords[0]);
          moveDragDivider(val, def);
          publicAPI.render(def.name);
        }).on('dragend', function () {
          if (typeof def.dragDivider === 'undefined' || scorePopupDiv.style('display') !== 'none' || dividerPopupDiv.style('display') !== 'none' || dividerValuePopupDiv.style('display') !== 'none') return;
          finishDivider(def, hobj);
          publicAPI.render();
        });
      })();
    } else {
      gScore.selectAll('line').remove();
      gScore.selectAll('.' + _HistogramSelector2.default.jsScoreUncertainty).remove();
    }

    // score regions
    // there are implicit bounds at the min and max.
    var regionBounds = getRegionBounds(def);
    var scoreRegions = gScore.selectAll('.' + _HistogramSelector2.default.jsScoreRect).data(def.regions);
    // duplicate background regions are opaque, for a solid bright color.
    var scoreBgRegions = svgGr.select('.' + _HistogramSelector2.default.jsScoreBackground).selectAll('rect').data(def.regions);
    var numRegions = def.regions.length;
    [{ sel: scoreRegions, opacity: 0.2, class: _HistogramSelector2.default.scoreRegionFg }, { sel: scoreBgRegions, opacity: 1.0, class: _HistogramSelector2.default.scoreRegionBg }].forEach(function (reg) {
      reg.sel.enter().append('rect').classed(reg.class, true);
      // first and last region should hang 6 pixels over the start/end of the axis.
      var overhang = 6;
      reg.sel.attr('x', function (d, i) {
        return def.xScale(regionBounds[i]) - (i === 0 ? overhang : 0);
      }).attr('y', def.editScore ? 0 : model.histHeight)
      // width might be === overhang if a divider is dragged all the way to min/max.
      .attr('width', function (d, i) {
        return def.xScale(regionBounds[i + 1]) - def.xScale(regionBounds[i]) + (i === 0 ? overhang : 0) + (i === numRegions - 1 ? overhang : 0);
      })
      // extend over the x-axis when editing.
      .attr('height', def.editScore ? model.histHeight + model.histMargin.bottom - 3 : model.histMargin.bottom - 3).attr('fill', function (d) {
        return model.scores[d].color;
      }).attr('opacity', showScore(def) ? reg.opacity : '0');
      reg.sel.exit().remove();
    });

    // invisible overlay to catch mouse events. Sized correctly in HistogramSelector
    var svgOverlay = svgGr.select('.' + _HistogramSelector2.default.jsOverlay);
    svgOverlay.on('click.score', function () {
      // preventDefault() in dragstart didn't help, so watch for altKey or ctrlKey.
      if (_d3.default.event.defaultPrevented || _d3.default.event.altKey || _d3.default.event.ctrlKey) return; // click suppressed (by drag handling)
      var overCoords = publicAPI.getMouseCoords(tdsl);
      if (overCoords[1] > model.histHeight) {
        // def.editScore = !def.editScore;
        // svgOverlay.style('cursor', def.editScore ? `url(${downArrowImage}) 12 22, auto` : 'pointer');
        // if (def.editScore && model.provider.isA('HistogramBinHoverProvider')) {
        //   const state = {};
        //   state[def.name] = [-1];
        //   model.provider.setHoverState({ state });
        // }
        // // set existing annotation as current if we activate for editing
        // if (def.editScore && showScore(def) && def.annotation) {
        //   // TODO special 'active' method to call, instead of an edit?
        //   sendScores(def);
        // }
        // publicAPI.render(def.name);
        return;
      }
      if (def.editScore) {
        // if we didn't create or drag a divider, pick a region or divider
        var hitRegionIndex = regionPick(overCoords, def, hobj);
        // select a def, show popup.
        def.hitRegionIndex = hitRegionIndex;
        // create a temp divider in case we choose 'new |' from the popup.

        var _dividerPick3 = dividerPick(overCoords, def, model.dragMargin, hobj.min);

        var _dividerPick4 = _slicedToArray(_dividerPick3, 3);

        var val = _dividerPick4[0];
        var hitIndex = _dividerPick4[2];

        var coord = _d3.default.mouse(model.listContainer);
        model.selectedDef = def;
        if (hitIndex >= 0) {
          // pick an existing divider, popup to edit value, uncertainty, or delete.
          def.dragDivider = createDragDivider(hitIndex, undefined, def, hobj);
          if (!def.lockAnnot) showDividerPopup(dividerPopupDiv, model.selectedDef, hobj, coord);else showDividerValuePopup(dividerValuePopupDiv, model.selectedDef, hobj, coord);
        } else if (!def.lockAnnot) {
          if (typeof def.dragDivider === 'undefined') {
            def.dragDivider = createDragDivider(-1, val, def, hobj);
          } else {
            console.log('Internal: unexpected existing divider');
            def.dragDivider.newDivider.value = val;
          }

          var selRow = def.regions[def.hitRegionIndex];
          showScorePopup(scorePopupDiv, coord, selRow);
        }
      }
    }).on('mousemove.score', function () {
      var overCoords = publicAPI.getMouseCoords(tdsl);
      if (def.editScore) {
        var _dividerPick5 = dividerPick(overCoords, def, model.dragMargin, hobj.min);

        var _dividerPick6 = _slicedToArray(_dividerPick5, 3);

        var hitIndex = _dividerPick6[2];

        var cursor = 'pointer';
        // if we're over the bottom, indicate a click will shrink regions
        if (overCoords[1] > model.histHeight) {// cursor = `url(${downArrowImage}) 12 22, auto`;
          // if we're over a divider, indicate drag-to-move
        } else if (def.dragIndex >= 0 || hitIndex >= 0) cursor = 'ew-resize';
          // if modifiers are held down, we'll create a divider
          else if (_d3.default.event.altKey || _d3.default.event.ctrlKey) cursor = 'crosshair';
        svgOverlay.style('cursor', cursor);
      } else {
        // over the bottom, indicate we can start editing regions
        var pickIt = overCoords[1] > model.histHeight;
        svgOverlay.style('cursor', pickIt ? 'pointer' : 'default');
      }
    });
    if (def.editScore) {
      svgOverlay.call(drag);
    } else {
      svgOverlay.on('.drag', null);
    }
  }

  function addSubscriptions() {
    if (model.provider.isA('PartitionProvider')) {
      model.subscriptions.push(model.provider.onPartitionReady(function (field) {
        model.fieldData[field].scoreDirty = true;
        publicAPI.render(field);
      }));
    }
    if (model.provider.isA('SelectionProvider')) {
      model.subscriptions.push(model.provider.onAnnotationChange(function (annotation) {
        if (annotation.selection.type === 'partition') {
          var field = annotation.selection.partition.variable;
          // respond to annotation.
          model.fieldData[field].annotation = annotation;
          partitionToDividers(annotation, model.fieldData[field], model.scores);

          publicAPI.render(field);
        }
      }));
    }
  }

  // Works if model.fieldData[field].hobj is undefined.
  function updateFieldAnnotations(fieldsData) {
    var fieldAnnotations = fieldsData;
    if (!fieldAnnotations && model.provider.getFieldPartitions) {
      fieldAnnotations = model.provider.getFieldPartitions();
    }
    if (fieldAnnotations) {
      Object.keys(fieldAnnotations).forEach(function (field) {
        var annotation = fieldAnnotations[field];
        if (model.fieldData[field]) {
          model.fieldData[field].annotation = annotation;
          partitionToDividers(annotation, model.fieldData[field], model.scores);
          publicAPI.render(field);
        }
      });
    }
  }

  return {
    addSubscriptions: addSubscriptions,
    createGroups: createGroups,
    createHeader: createHeader,
    createPopups: createPopups,
    createScoreIcons: createScoreIcons,
    defaultFieldData: defaultFieldData,
    editingScore: editingScore,
    enabled: enabled,
    filterFieldNames: filterFieldNames,
    getHistRange: getHistRange,
    init: init,
    numScoreIcons: numScoreIcons,
    prepareItem: prepareItem,
    rescaleDividers: rescaleDividers,
    updateHeader: updateHeader,
    updateFieldAnnotations: updateFieldAnnotations,
    updateScoreIcons: updateScoreIcons
  };
}