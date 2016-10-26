'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* global document */

// import multiClicker from '../../Core/D3MultiClick';


exports.extend = extend;

var _d2 = require('d3');

var _d3 = _interopRequireDefault(_d2);

var _InformationDiagram = require('PVWStyle/InfoVizNative/InformationDiagram.mcss');

var _InformationDiagram2 = _interopRequireDefault(_InformationDiagram);

var _CompositeClosureHelper = require('../../../Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

var _body = require('./body.html');

var _body2 = _interopRequireDefault(_body);

var _InfoDiagramIconSmall = require('./InfoDiagramIconSmall.png');

var _InfoDiagramIconSmall2 = _interopRequireDefault(_InfoDiagramIconSmall);

var _SelectionBuilder = require('../../../Common/Misc/SelectionBuilder');

var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

var _AnnotationBuilder = require('../../../Common/Misc/AnnotationBuilder');

var _AnnotationBuilder2 = _interopRequireDefault(_AnnotationBuilder);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PMI_CHORD_MODE_NONE = 0;
var PMI_CHORD_MODE_ONE_BIN_ALL_VARS = 1;
var PMI_CHORD_MODE_ALL_BINS_TWO_VARS = 2;

var miCount = 0;

/* eslint-disable no-use-before-define */

// ----------------------------------------------------------------------------
// Information Diagram
// ----------------------------------------------------------------------------

function informationDiagram(publicAPI, model) {
  var lastAnnotationPushed = null;

  if (!model.provider || !model.provider.isA('MutualInformationProvider') || !model.provider.isA('Histogram1DProvider') || !model.provider.isA('FieldProvider')) {
    console.log('Invalid provider:', model.provider);
    return;
  }

  model.renderState = {
    pmiAllBinsTwoVars: null,
    pmiOneBinAllVars: null,
    pmiHighlight: null
  };

  model.clientRect = null;

  miCount += 1;
  // unique id, based on count
  model.instanceID = 'pvwInformationDiagram-' + miCount;

  // Handle style for status bar
  function updateStatusBarVisibility() {
    var cntnr = _d3.default.select(model.container);
    if (model.statusBarVisible) {
      cntnr.select('.status-bar-container').style('width', function updateWidth() {
        return this.dataset.width;
      });
      cntnr.select('.show-button').classed(_InformationDiagram2.default.hidden, true);
      cntnr.select('.hide-button').classed(_InformationDiagram2.default.hidden, false);
      cntnr.select('.status-bar-text').classed(_InformationDiagram2.default.hidden, false);
    } else {
      cntnr.select('.status-bar-container').style('width', '20px');
      cntnr.select('.show-button').classed(_InformationDiagram2.default.hidden, false);
      cntnr.select('.hide-button').classed(_InformationDiagram2.default.hidden, true);
      cntnr.select('.status-bar-text').classed(_InformationDiagram2.default.hidden, true);
    }
  }

  publicAPI.propagateAnnotationInsteadOfSelection = function () {
    var useAnnotation = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
    var defaultScore = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var defaultWeight = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    model.useAnnotation = useAnnotation;
    model.defaultScore = defaultScore;
    model.defaultWeight = defaultWeight;
  };

  publicAPI.resize = function () {
    if (!model.container) {
      return; // no shirt, no shoes, no service.
    }

    model.clientRect = model.container.getBoundingClientRect();

    _d3.default.select(model.container).select('div.status-bar-container').attr('data-width', model.clientRect.width - 20 + 'px');

    publicAPI.render();
  };

  publicAPI.setContainer = function (el) {
    if (model.container) {
      while (model.container.firstChild) {
        model.container.removeChild(model.container.firstChild);
      }
    }

    model.container = el;

    if (model.container) {
      // Create placeholder
      model.container.innerHTML = _body2.default;

      // Apply style
      var d3Container = _d3.default.select(model.container).select('.info-diagram-container').classed(_InformationDiagram2.default.infoDiagramContainer, true);

      d3Container.select('.status-bar-container').classed(_InformationDiagram2.default.statusBarContainer, true);

      d3Container.select('.status-bar-text').classed(_InformationDiagram2.default.statusBarText, true);

      d3Container.select('.show-button').classed(_InformationDiagram2.default.showButton, true);

      d3Container.select('.hide-button').classed(_InformationDiagram2.default.hideButton, true);

      d3Container.select('.info-diagram-placeholder').classed(_InformationDiagram2.default.infoDiagramPlaceholder, true).select('img').attr('src', _InfoDiagramIconSmall2.default);

      // Attach listener for show/hide status bar
      d3Container.selectAll('.show-button, .hide-button').on('click', function () {
        model.statusBarVisible = !model.statusBarVisible;
        updateStatusBarVisibility();
        _d3.default.event.preventDefault();
        _d3.default.event.stopPropagation();
      });

      updateStatusBarVisibility();
    }
  };

  publicAPI.updateStatusBarText = function (msg) {
    return _d3.default.select(model.container).select('input.status-bar-text').attr('value', msg);
  };

  publicAPI.selectStatusBarText = function () {
    // select text so user can press ctrl-c if desired.
    if (model.statusBarVisible) {
      // https://www.sitepoint.com/javascript-copy-to-clipboard/
      _d3.default.select(model.container).select('input.status-bar-text').node().select();
      // Copy-to-clipboard works because status bar text is an 'input':
      try {
        document.execCommand('copy');
      } catch (err) {
        console.log('Copy to clipboard failed. Press Ctrl-C to copy');
      }
    }
  };

  // need a unique groupID whenever a group is added.
  var groupID = 0;

  publicAPI.render = function () {
    // Extract provider data for local access
    var getLegend = model.provider.isA('LegendProvider') ? model.provider.getLegend : null;
    var histogram1DnumberOfBins = model.numberOfBins;
    var variableList = model.provider.getActiveFieldNames();

    if (variableList.length < 2 || !model.container) {
      // Select the main circle and hide it and unhide placeholder
      _d3.default.select(model.container).select('svg.information-diagram').classed(_InformationDiagram2.default.informationDiagramSvgShow, false).classed(_InformationDiagram2.default.informationDiagramSvgHide, true);
      _d3.default.select(model.container).select('div.info-diagram-placeholder').classed(_InformationDiagram2.default.hidden, false);
      publicAPI.updateStatusBarText('');
      return;
    }

    // Guard against rendering if container is non-null but has no size (as
    // in the case when workbench layout doesn't include our container)
    if (model.clientRect === null || model.clientRect.width === 0 || model.clientRect.height === 0) {
      return;
    }

    var width = model.clientRect.width;
    var height = model.clientRect.height;

    // Make sure we have all the data we need
    if (!model.mutualInformationData || !model.histogramData) {
      return;
    }

    // Update
    updateStatusBarVisibility();

    _d3.default.select(model.container).select('div.info-diagram-placeholder').classed(_InformationDiagram2.default.hidden, true);
    _d3.default.select(model.container).select('svg.information-diagram').classed(_InformationDiagram2.default.informationDiagramSvgHide, false).classed(_InformationDiagram2.default.informationDiagramSvgShow, true);

    var pmiChordMode = {
      mode: PMI_CHORD_MODE_NONE,
      srcParam: null,
      srcBin: null,
      miIndex: -1
    };

    var outerHistoRadius = Math.min(width, height) / 2;
    var veryOutermostRadius = outerHistoRadius + 80;
    var histoRadius = outerHistoRadius - 20;
    var outerRadius = histoRadius - 50;
    var innerRadius = outerRadius - 24;
    var deltaRadius = outerRadius - innerRadius;

    var formatPercent = _d3.default.format('.1%');
    var formatMI = _d3.default.format('.2f');
    var formatVal = _d3.default.format('.2s');

    var arc = _d3.default.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    var histoArc = _d3.default.svg.arc().innerRadius(outerRadius + 10);

    var layout = _d3.default.layout.chord().padding(0.04).sortSubgroups(_d3.default.descending).sortChords(_d3.default.ascending);

    var path = _d3.default.svg.chord().radius(innerRadius);

    // Remove previous SVG
    var svgParent = _d3.default.select(model.container).select('svg');
    var svg = svgParent.select('.main-circle');
    if (svgParent.empty()) {
      svgParent = _d3.default.select(model.container).append('svg').style('float', 'left').attr('class', _InformationDiagram2.default.informationDiagramSvgShow).classed('information-diagram', true);
      svg = svgParent.append('g').classed('main-circle', true).classed(_InformationDiagram2.default.mainCircle, true);
    }

    svgParent.attr('width', width).attr('height', height);
    svg.attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');

    function findGroupAndBin(relCoords) {
      var result = {
        found: false,
        group: null,
        bin: -1,
        radius: 0
      };

      var _calculateAngleAndRad = (0, _utils.calculateAngleAndRadius)(relCoords, [width, height]);

      var _calculateAngleAndRad2 = _slicedToArray(_calculateAngleAndRad, 2);

      var angle = _calculateAngleAndRad2[0];
      var radius = _calculateAngleAndRad2[1];

      result.radius = radius;
      for (var groupIdx = 0; groupIdx < layout.groups().length; ++groupIdx) {
        var groupData = layout.groups()[groupIdx];
        var groupName = model.mutualInformationData.vmap[groupData.index].name;
        if (angle > groupData.startAngle && angle <= groupData.endAngle) {
          var binSizeRadians = (groupData.endAngle - groupData.startAngle) / model.numberOfBins;
          var binIndex = Math.floor((angle - groupData.startAngle) / binSizeRadians);
          result.found = true;
          result.group = groupName;
          result.bin = binIndex;
          break;
        }
      }
      return result;
    }

    function unHoverBin(param) {
      if (model.provider.isA('HistogramBinHoverProvider')) {
        var state = {};
        state[param] = [-1];
        model.provider.setHoverState({
          source: 'MutualInformationDiagram',
          state: state
        });
      }
    }

    function hoverBins(binMap) {
      if (model.provider.isA('HistogramBinHoverProvider')) {
        model.provider.setHoverState({
          source: 'MutualInformationDiagram',
          state: binMap
        });
      }
    }

    function updateActiveSelection(binMap) {
      if (!model.provider.isA('SelectionProvider') || !model.provider.isA('FieldProvider')) {
        return;
      }

      var vars = {};
      var proceed = false;

      Object.keys(binMap).forEach(function (pName) {
        var paramRange = model.provider.getField(pName).range;
        var binList = binMap[pName];
        var rangeList = [];
        for (var i = 0; i < binList.length; ++i) {
          if (binList[i] !== -1) {
            rangeList.push({
              interval: getBinRange(binList[i], histogram1DnumberOfBins, [paramRange[0], paramRange[1], paramRange[1] - paramRange[0]])
            });
          }
        }
        if (rangeList.length > 0) {
          proceed = true;
          vars[pName] = rangeList;
        }
      });

      if (proceed) {
        var selection = _SelectionBuilder2.default.range(vars);
        if (model.useAnnotation) {
          lastAnnotationPushed = model.provider.getAnnotation();
          if (!lastAnnotationPushed || model.provider.shouldCreateNewAnnotation() || lastAnnotationPushed.selection.type !== 'range') {
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
          model.provider.setSelection(selection);
        }
      }
    }

    // function findPmiChordsToHighlight(param, bin, highlight = true, oneBinAllVarsMode = false) {
    function findPmiChordsToHighlight() {
      var _model$renderState$pm = model.renderState.pmiHighlight;
      var param = _model$renderState$pm.group;
      var bin = _model$renderState$pm.bin;
      var highlight = _model$renderState$pm.highlight;
      var oneBinAllVarsMode = _model$renderState$pm.mode;

      if (highlight) {
        svg.select('g.pmiChords').selectAll('path.pmiChord').classed('highlight-pmi', false);
      }

      var binMap = {};

      function addBin(pName, bIdx) {
        if (!binMap[pName]) {
          binMap[pName] = [];
        }
        if (binMap[pName].indexOf(bIdx) === -1) {
          binMap[pName].push(bIdx);
        }
      }

      if (oneBinAllVarsMode) {
        svg.select('g.pmiChords').selectAll('path[data-source-name="' + param + '"]:not(.fade)').classed('highlight-pmi', highlight).each(function highlightPMI(d, i) {
          var elt = _d3.default.select(this);
          addBin(param, bin);
          addBin(elt.attr('data-target-name'), Number.parseInt(elt.attr('data-target-bin'), 10));
        });

        svg.select('g.pmiChords').selectAll('path[data-target-name="' + param + '"]:not(.fade)').each(function inner(d, i) {
          var elt = _d3.default.select(this);
          addBin(param, Number.parseInt(elt.attr('data-target-bin'), 10));
          addBin(elt.attr('data-source-name'), Number.parseInt(elt.attr('data-source-bin'), 10));
        });

        if (binMap[param] && binMap[param].indexOf(bin) >= 0) {
          binMap[param] = [bin];
        }

        svg.select('g.pmiChords').selectAll('path[data-target-name="' + param + '"]:not(.fade)').classed('highlight-pmi', function inner(d, i) {
          var elt = _d3.default.select(this);
          return binMap[param].indexOf(Number.parseInt(elt.attr('data-target-bin'), 10)) >= 0;
        });
      } else {
        svg.select('g.pmiChords').selectAll('path[data-source-name="' + param + '"][data-source-bin="' + bin + '"]:not(.fade)').classed('highlight-pmi', highlight).each(function highlightPMI(d, i) {
          var elt = _d3.default.select(this);
          addBin(param, bin);
          addBin(elt.attr('data-target-name'), Number.parseInt(elt.attr('data-target-bin'), 10));
        });

        svg.select('g.pmiChords').selectAll('path[data-target-name="' + param + '"][data-target-bin="' + bin + '"]:not(.fade)').classed('highlight-pmi', highlight).each(function highlightPMI(d, i) {
          var elt = _d3.default.select(this);
          addBin(param, bin);
          addBin(elt.attr('data-source-name'), Number.parseInt(elt.attr('data-source-bin'), 10));
        });
      }

      return binMap;
    }

    // Chord handling ---------------------------------------------------------

    function updateChordVisibility(options) {
      if (options.mi && options.mi.show === true) {
        if (options.mi.index !== undefined) {
          chord.classed('fade', function (p) {
            return p.source.index !== options.mi.index && p.target.index !== options.mi.index;
          });
        } else {
          chord.classed('fade', false);
        }
        svg.selectAll('g.pmiChords path.pmiChord').classed('fade', true);
      } else if (options.pmi && options.pmi.show === true) {
        // Currently drawing pmi chords fades all mi chords, so we
        // don't have to do anything here to keep things consistent.
      }
    }

    function drawPMIAllBinsTwoVars() {
      var d = model.renderState.pmiAllBinsTwoVars.d;
      if (d.source.index === d.target.index) {
        console.log('Cannot render self-PMI', model.mutualInformationData.vmap[d.source.index].name);
        return;
      }

      pmiChordMode.mode = PMI_CHORD_MODE_ALL_BINS_TWO_VARS;
      pmiChordMode.srcParam = null;
      pmiChordMode.srcBin = null;

      // Turn off MI rendering
      chord.classed('fade', true);
      // Turn on PMI rendering
      var va = model.mutualInformationData.vmap[d.source.index].name;
      var vb = model.mutualInformationData.vmap[d.target.index].name;
      var swap = false;
      if (vb < va) {
        var tmp = vb;
        vb = va;
        va = tmp;
        swap = true;
      }

      var cAB = (0, _utils.downsample)(model.mutualInformationData.joint[va][vb], histogram1DnumberOfBins, swap);
      var probDict = (0, _utils.freqToProb)(cAB);
      var linksToDraw = (0, _utils.topPmi)(probDict, 0.95);

      // Make mutual info chords invisible.
      svg.selectAll('g.group path.chord').classed('fade', true);

      var linkData = svg.select('g.pmiChords').selectAll('path.pmiChord').data(_d3.default.zip(linksToDraw.idx, linksToDraw.pmi, new Array(linksToDraw.idx.length).fill([va, vb])));

      linkData.enter().append('path').classed('pmiChord', true).classed(_InformationDiagram2.default.pmiChord, true);
      linkData.exit().remove();

      var vaGroup = layout.groups()[d.source.index];
      var vbGroup = layout.groups()[d.target.index];
      var vaRange = [vaGroup.startAngle, vaGroup.endAngle - vaGroup.startAngle, (vaGroup.endAngle - vaGroup.startAngle) / histogram1DnumberOfBins];
      var vbRange = [vbGroup.startAngle, vbGroup.endAngle - vbGroup.startAngle, (vbGroup.endAngle - vbGroup.startAngle) / histogram1DnumberOfBins];

      linkData.classed('fade', false).attr('d', function (data, index) {
        return path({
          source: {
            startAngle: vaRange[0] + data[0][0] * vaRange[2],
            endAngle: vaRange[0] + (data[0][0] + 1) * vaRange[2]
          },
          target: {
            startAngle: vbRange[0] + data[0][1] * vbRange[2],
            endAngle: vbRange[0] + (data[0][1] + 1) * vbRange[2]
          }
        });
      }).attr('data-source-name', swap ? vb : va).attr('data-source-bin', function (data, index) {
        return '' + data[0][0];
      }).attr('data-target-name', swap ? va : vb).attr('data-target-bin', function (data, iindex) {
        return '' + data[0][1];
      }).classed('highlight-pmi', false).classed('positive', function (data, index) {
        return data[1] >= 0.0;
      }).classed('negative', function (data, index) {
        return data[1] < 0.0;
      }).attr('data-details', function (data, index) {
        var sIdx = swap ? 1 : 0;
        var tIdx = swap ? 0 : 1;
        var sourceBinRange = getParamBinRange(data[0][sIdx], histogram1DnumberOfBins, data[2][0]);
        var targetBinRange = getParamBinRange(data[0][tIdx], histogram1DnumberOfBins, data[2][1]);
        return 'PMI: ' + (data[2][0] + ' ∈ [ ' + formatVal(sourceBinRange[0]) + ', ' + formatVal(sourceBinRange[1]) + '] ↔︎ ') + (data[2][1] + ' ∈ [ ' + formatVal(targetBinRange[0]) + ', ' + formatVal(targetBinRange[1]) + '] ' + formatMI(data[1]));
      }).on('mouseover', function mouseOver() {
        publicAPI.updateStatusBarText(_d3.default.select(this).attr('data-details'));
      }).on('mouseout', function () {
        publicAPI.updateStatusBarText('');
      }).on('click', function () {
        publicAPI.selectStatusBarText();
      });
    }

    // Mouse move handling ----------------------------------------------------

    svgParent
    /* eslint-disable prefer-arrow-callback */
    // need d3 provided 'this', below.
    .on('mousemove', function mouseMove(d, i) {
      /* xxeslint-enable prefer-arrow-callback */
      var overCoords = _d3.default.mouse(model.container);
      var info = findGroupAndBin(overCoords);
      var clearStatusBar = false;
      var groupHoverName = null;
      var highlightAllGroups = false;

      for (var idx = 0; idx < variableList.length; ++idx) {
        unHoverBin(variableList[idx]);
      }

      if (info.radius > veryOutermostRadius) {
        highlightAllGroups = true;
        clearStatusBar = true;
      } else if (info.found) {
        if (info.radius > innerRadius && info.radius <= outerRadius) groupHoverName = info.group;

        var binMap = {};
        if (!(info.radius <= innerRadius && pmiChordMode.mode === PMI_CHORD_MODE_NONE)) {
          var oneBinAllVarsMode = info.radius <= innerRadius && pmiChordMode.mode === PMI_CHORD_MODE_ONE_BIN_ALL_VARS;
          model.renderState.pmiHighlight = { group: info.group, bin: info.bin, highlight: true, mode: oneBinAllVarsMode };
          var pmiBinMap = findPmiChordsToHighlight();
          if (info.radius <= innerRadius) {
            binMap = pmiBinMap;
          } else {
            svg.select('g.group[param-name=\'' + info.group + '\'').selectAll('path.htile').each(function hTileInner(data, index) {
              if (index === info.bin) {
                publicAPI.updateStatusBarText(_d3.default.select(this).attr('data-details'));
              }
            });
          }
          if (!oneBinAllVarsMode) {
            binMap[info.group] = [info.bin];
          }
        }
        hoverBins(binMap);
      } else {
        clearStatusBar = true;
      }
      // show a clickable variable legend arc, if hovered, or
      // highlight all groups if a click will reset to default view (veryOutermostRadius)
      svg.selectAll('g.group path[id^=\'' + model.instanceID + '-group\']').classed(_InformationDiagram2.default.hoverOutline, function (data, idx) {
        return highlightAllGroups || model.mutualInformationData.vmap[idx].name === groupHoverName;
      });

      if (clearStatusBar === true) {
        publicAPI.updateStatusBarText('');
      }
    }).on('mouseout', function (d, i) {
      for (var idx = 0; idx < variableList.length; ++idx) {
        unHoverBin(variableList[idx]);
      }
    }).on('click', // multiClicker([
    function singleClick(d, i) {
      // single click handler
      var overCoords = _d3.default.mouse(model.container);
      var info = findGroupAndBin(overCoords);
      if (info.radius > veryOutermostRadius) {
        showAllChords();
      } else if (info.radius > outerRadius || info.radius <= innerRadius && pmiChordMode.mode === PMI_CHORD_MODE_ONE_BIN_ALL_VARS && info.group === pmiChordMode.srcParam) {
        if (info.found) {
          model.renderState.pmiAllBinsTwoVars = null;
          model.renderState.pmiOneBinAllVars = { group: info.group, bin: info.bin, d: d, i: i };
          drawPMIOneBinAllVars()(d, i);
          publicAPI.selectStatusBarText();
        }
      }
      // },
    }).on('dblclick', function doubleClick(d, i) {
      // double click handler
      var overCoords = _d3.default.mouse(model.container);
      var info = findGroupAndBin(overCoords);

      if (info.found) {
        var binMap = {};
        var oneBinAllVarsMode = info.radius <= innerRadius && pmiChordMode.mode === PMI_CHORD_MODE_ONE_BIN_ALL_VARS;
        if (info.radius <= innerRadius) {
          model.renderState.pmiHighlight = { group: info.group, bin: info.bin, highlight: true, mode: oneBinAllVarsMode };
          binMap = findPmiChordsToHighlight();
        }
        if (!oneBinAllVarsMode) {
          binMap[info.group] = [info.bin];
        }
        updateActiveSelection(binMap);
      }

      _d3.default.event.stopPropagation();
      //   },
      // ])
    });
    var miChordsG = svg.select('g.mutualInfoChords');
    if (miChordsG.empty()) {
      svg.append('circle').attr('r', outerRadius);
      miChordsG = svg.append('g').classed('mutualInfoChords', true);
      svg.append('g').classed('pmiChords', true);

      // add a straight path so IE/Edge can measure text lengths usefully.
      // Otherwise, along a curved path, they return the horizontal space covered.
      svg.append('defs').append('path').attr('id', 'straight-text-path').attr('d', 'M0,0L' + width + ',0');
    }
    // Compute the chord layout.
    layout.matrix(model.mutualInformationData.matrix);

    // Get lookups for pmi chords
    model.mutualInformationData.lkup = {};
    Object.keys(model.mutualInformationData.vmap).forEach(function (i) {
      model.mutualInformationData.lkup[model.mutualInformationData.vmap[i].name] = i;
    });

    // Only used when there is no legend service
    var cmap = _d3.default.scale.category20();

    // Add a group per neighborhood.
    var group = svg.selectAll('.group').data(layout.groups, function () {
      groupID += 1;return groupID;
    });
    var groupEnter = group.enter().append('g').classed('group', true).classed(_InformationDiagram2.default.group, true);

    // Add the group arc.
    groupEnter.append('path').attr('id', function (d, i) {
      return model.instanceID + '-group' + i;
    });

    // Add a text label.
    var groupText = groupEnter.append('text')
    // .attr('x', 6) // prevents ie11 from seeing text-anchor and startOffset.
    .attr('dy', 15);

    if (!model.textLengthMap) model.textLengthMap = {};
    // pull a stunt to measure text length - use a straight path, then switch to the real curved one.
    var textPath = groupText.append('textPath').attr('xlink:href', '#straight-text-path').attr('startOffset', '25%').text(function (d, i) {
      return model.mutualInformationData.vmap[i].name;
    }).each(function textLen(d, i) {
      model.textLengthMap[model.mutualInformationData.vmap[i].name] = this.getComputedTextLength();
    });

    textPath.attr('xlink:href', function (d, i) {
      return '#' + model.instanceID + '-group' + i;
    });

    // enter + update items.
    var groupPath = group.select('path').attr('d', arc);
    // Remove the labels that don't fit, or shorten label, using ...
    group.select('text').select('textPath').each(function truncate(d, i) {
      d.textShown = true;
      var availLength = groupPath[0][d.index].getTotalLength() / 2 - deltaRadius - model.glyphSize;
      // shorten text based on string length vs initial total length.
      var fullText = model.mutualInformationData.vmap[d.index].name;
      var textLength = model.textLengthMap[fullText];
      var strLength = fullText.length;
      // we fit! done.
      if (textLength <= availLength) {
        d.textLength = textLength;
        return;
      }
      // if we don't have 15 pixels left, or short string, don't show label.
      if (availLength < 15 || strLength < 9) {
        d.textShown = false;
        return;
      }
      // drop the middle 50%.
      var testStrLen = Math.floor(strLength * 0.25);
      // estimate new length, +2 to account for adding '...'
      d.textLength = (testStrLen * 2 + 2) / strLength * textLength;
      if (d.textLength < availLength) {
        _d3.default.select(this).text(fullText.slice(0, testStrLen) + '...' + fullText.slice(-testStrLen));
        return;
      }
      // start at 1/3 of the string, go down to 3 chars plus ...
      testStrLen = Math.floor(strLength / 2.99);
      while (testStrLen >= 3) {
        d.textLength = (testStrLen + 2) / strLength * textLength;
        if (d.textLength < availLength) {
          _d3.default.select(this).text(fullText.slice(0, testStrLen) + '...');
          return;
        }
        testStrLen -= 1;
      }
      // small string doesn't fit - hide.
      d.textShown = false;
    }).attr('display', function (d, i) {
      return d.textShown ? null : 'none';
    });
    // .remove(); ie11 throws errors if we use .remove() - hide instead.

    // Add group for glyph
    if (getLegend) {
      group.each(function addLegend(glyphData) {
        var glyph = _d3.default.select(this).select('g.glyph');
        if (glyph.empty()) {
          glyph = _d3.default.select(this).append('g').classed('glyph', true).classed(_InformationDiagram2.default.glyph, true);
          glyph.append('svg').append('use');
        }

        var legend = getLegend(model.mutualInformationData.vmap[glyphData.index].name);
        // Add the glyph to the group
        var textLength = glyphData.textShown ? glyphData.textLength : 0;
        var pathLength = groupPath[0][glyphData.index].getTotalLength();
        var avgRadius = (innerRadius + outerRadius) / 2;
        // Start at edge of arc, move to text anchor, back up half of text length and glyph size
        var glyphAngle = glyphData.startAngle + pathLength * 0.25 / outerRadius - (textLength + model.glyphSize) * 0.5 / avgRadius;
        // console.log(model.mutualInformationData.vmap[glyphData.index].name, textLength, pathLength, glyphAngle);

        glyph.attr('transform', 'translate(\n            ' + (avgRadius * Math.sin(glyphAngle) - model.glyphSize / 2) + ',\n            ' + (-avgRadius * Math.cos(glyphAngle) - model.glyphSize / 2) + ')').select('svg').attr('width', model.glyphSize).attr('height', model.glyphSize).attr('stroke', 'black').attr('fill', legend.color).select('use').attr('xlink:href', legend.shape);

        model.mutualInformationData.vmap[glyphData.index].color = legend.color;

        // Remove the glyphs that don't fit
        if (groupPath[0][glyphData.index].getTotalLength() / 2 - deltaRadius < model.glyphSize) {
          // glyph.remove(); ie11 objects, hide instead.
          glyph.attr('display', 'none');
        }
      });
    }

    function getParamBinRange(index, numberOfBins, paramName) {
      var paramRange = model.provider.getField(paramName).range;
      return getBinRange(index, numberOfBins, [paramRange[0], paramRange[1], paramRange[1] - paramRange[0]]);
    }

    function getBinRange(index, numberOfBins, paramRange) {
      return [index / numberOfBins * paramRange[2] + paramRange[0], (index + 1) / numberOfBins * paramRange[2] + paramRange[0]];
    }

    // Zip histogram info into layout.groups() (which we initially have no control over as it is
    // generated for us).
    group.each(function buildHistogram(groupData) {
      var gname = model.mutualInformationData.vmap[groupData.index].name;
      var gvar = model.histogramData[gname];

      if (!gvar) return;

      // Set the color if it hasn't already been set
      if (!getLegend) {
        model.mutualInformationData.vmap[groupData.index].color = cmap(groupData.index);
      }

      // Add the color to the group arc
      _d3.default.select(this).select('path').style('fill', model.mutualInformationData.vmap[groupData.index].color || 'red');

      groupData.range = [gvar.min, gvar.max, gvar.max - gvar.min];

      var delta = (groupData.endAngle - groupData.startAngle) / gvar.counts.length;
      var total = Number(gvar.counts.reduce(function (a, b) {
        return a + b;
      }));
      var maxcnt = Number(gvar.counts.reduce(function (a, b) {
        return a > b ? a : b;
      }));

      /* eslint-disable arrow-body-style */
      groupData.histo = gvar.counts.map(function (d, i) {
        return {
          startAngle: i * delta + groupData.startAngle,
          endAngle: (i + 1) * delta + groupData.startAngle,
          innerRadius: outerRadius + 10,
          outerRadius: outerRadius + 10 + d / maxcnt * (histoRadius - outerRadius),
          index: i,
          value: d / total
        };
      });

      var htile = _d3.default.select(this).attr('param-name', gname).selectAll('path.htile').data(groupData.histo);
      htile.enter().append('path').classed('htile', true);
      htile.attr('d', function (d, i) {
        return histoArc.outerRadius(d.outerRadius)(d);
      }).attr('data-details', function (d, i) {
        var binRange = getBinRange(i, histogram1DnumberOfBins, groupData.range);
        return 'p(' + gname + ' ∈ [' + formatVal(binRange[0]) + ', ' + formatVal(binRange[1]) + ']) = ' + formatPercent(d.value);
      }).attr('fill', function (d, i) {
        return i % 2 ? '#bebebe' : '#a9a9a9';
      });
    });

    function showAllChords() {
      pmiChordMode.mode = PMI_CHORD_MODE_NONE;
      pmiChordMode.srcParam = null;
      pmiChordMode.srcBin = null;
      pmiChordMode.miIndex = -1;
      updateChordVisibility({ mi: { show: true } });
    }
    // do we need to reset?
    var groupExit = group.exit();
    var needReset = !groupEnter.empty() || !groupExit.empty();
    groupExit.remove();

    // Add the chords. Color only chords that show self-mutual-information.
    var chord = miChordsG.selectAll('.chord').data(layout.chords);
    chord.enter().append('path').classed('chord', true).classed(_InformationDiagram2.default.chord, true);

    chord.exit().remove();

    chord.classed('selfchord', function (d) {
      return d.source.index === d.target.index;
    }).attr('d', path).style('fill', null).on('click', function (d, i) {
      model.renderState.pmiOneBinAllVars = null;
      model.renderState.pmiAllBinsTwoVars = { d: d, i: i };
      drawPMIAllBinsTwoVars();
      publicAPI.selectStatusBarText();
    }).on('mouseover', function inner(d, i) {
      publicAPI.updateStatusBarText(_d3.default.select(this).attr('data-details'));
    }).on('mouseout', function () {
      publicAPI.updateStatusBarText('');
    });

    miChordsG.selectAll('.selfchord').style('fill', function (d) {
      return model.mutualInformationData.vmap[d.source.index].color;
    });

    chord.attr('data-details', function (d, i) {
      return 'Mutual information: ' + model.mutualInformationData.vmap[d.source.index].name + ' ↔︎ ' + model.mutualInformationData.vmap[d.target.index].name + ' ' + ('' + formatMI(model.mutualInformationData.matrix[d.source.index][d.target.index]));
    });
    // The lines below are for the case when the MI matrix has been row-normalized:
    // model.mutualInformationData.matrix[d.source.index][d.target.index] *
    // model.mutualInformationData.vmap[d.source.index].autoInfo/model.mutualInformationData.matrix[d.source.index][d.source.index]);

    // after chord is defined.
    if (needReset) {
      showAllChords();
      publicAPI.updateStatusBarText('');
    }

    svg.selectAll('g.group path[id^=\'' + model.instanceID + '-group\']').on('click', function (d, i) {
      if (pmiChordMode.mode !== PMI_CHORD_MODE_NONE || pmiChordMode.miIndex !== i) {
        pmiChordMode.mode = PMI_CHORD_MODE_NONE;
        pmiChordMode.srcParam = null;
        pmiChordMode.srcBin = null;
        pmiChordMode.miIndex = i;
        updateChordVisibility({ mi: { show: true, index: i } });
      } else {
        showAllChords();
      }
    });

    if (model.renderState.pmiAllBinsTwoVars !== null) {
      drawPMIAllBinsTwoVars();
    } else if (model.renderState.pmiOneBinAllVars !== null) {
      var _model$renderState$pm2 = model.renderState.pmiOneBinAllVars;
      var g = _model$renderState$pm2.group;
      var b = _model$renderState$pm2.bin;
      var d = _model$renderState$pm2.d;
      var i = _model$renderState$pm2.i;

      drawPMIOneBinAllVars(g, b)(d, i);
    }

    if (model.renderState.pmiHighlight !== null) {
      findPmiChordsToHighlight();
    }

    function drawPMIOneBinAllVars() {
      var binVar = model.renderState.pmiOneBinAllVars.group; // Hold on to the name of the variable whose bin we should draw.
      var binIdx = model.renderState.pmiOneBinAllVars.bin;

      pmiChordMode.mode = PMI_CHORD_MODE_ONE_BIN_ALL_VARS;
      pmiChordMode.srcParam = binVar;
      pmiChordMode.srcBin = binIdx;

      // Return a function that, given a bin datum, renders the highest PMI (or probability)
      // links from that bin to any/all other bins in other variables it co-occurs with.
      return function (d, i) {
        // Turn off MI rendering
        chord.classed('fade', true);

        // Turn on PMI rendering
        var linkAccum = [];
        Object.keys(model.mutualInformationData.vmap).forEach(function (iother) {
          var other = model.mutualInformationData.vmap[iother];
          var va = binVar;
          var vb = other.name;
          if (!vb || vb === va) {
            return; // Can't draw links to self...
          }
          var swap = false;
          if (vb < va) {
            var tmp = vb;
            vb = va;
            va = tmp;
            swap = true;
          }

          var cAB = (0, _utils.downsample)(model.mutualInformationData.joint[va][vb], histogram1DnumberOfBins, swap);
          var probDict = (0, _utils.freqToProb)(cAB);
          var linksToDraw = (0, _utils.topBinPmi)(probDict, true, binIdx, 0.8);
          linkAccum = linkAccum.concat(_d3.default.zip(linksToDraw.idx, linksToDraw.pmi, linksToDraw.pAB, new Array(linksToDraw.idx.length).fill([binVar, other.name])));
        });

        // Make mutual info chords invisible.
        svg.selectAll('g.group path.chord').classed('fade', true);

        var linkData = svg.select('g.pmiChords').selectAll('path.pmiChord').data(linkAccum);

        linkData.enter().append('path').classed('pmiChord', true).classed(_InformationDiagram2.default.pmiChord, true);
        linkData.exit().remove();

        linkData.classed('fade', false).attr('d', function (data, index) {
          var vaGrp = layout.groups()[model.mutualInformationData.lkup[data[3][0]]];
          var vbGrp = layout.groups()[model.mutualInformationData.lkup[data[3][1]]];
          var vaRange = [vaGrp.startAngle, vaGrp.endAngle - vaGrp.startAngle, (vaGrp.endAngle - vaGrp.startAngle) / histogram1DnumberOfBins];
          var vbRange = [vbGrp.startAngle, vbGrp.endAngle - vbGrp.startAngle, (vbGrp.endAngle - vbGrp.startAngle) / histogram1DnumberOfBins];
          return path({
            source: {
              startAngle: vaRange[0] + data[0][0] * vaRange[2],
              endAngle: vaRange[0] + (data[0][0] + 1) * vaRange[2]
            },
            target: {
              startAngle: vbRange[0] + data[0][1] * vbRange[2],
              endAngle: vbRange[0] + (data[0][1] + 1) * vbRange[2]
            }
          });
        }).attr('data-source-name', function (data) {
          return data[3][0];
        }).attr('data-source-bin', function (data) {
          return data[0][0];
        }).attr('data-target-name', function (data) {
          return data[3][1];
        }).attr('data-target-bin', function (data) {
          return data[0][1];
        }).classed('highlight-pmi', false).classed('positive', function (data) {
          return data[1] >= 0.0;
        }).classed('negative', function (data) {
          return data[1] < 0.0;
        }).attr('data-details', function (data) {
          var sourceBinRange = getParamBinRange(data[0][0], histogram1DnumberOfBins, data[3][0]);
          var targetBinRange = getParamBinRange(data[0][1], histogram1DnumberOfBins, data[3][1]);
          return 'PMI: ' + (data[3][0] + ' ∈ [ ' + formatVal(sourceBinRange[0]) + ', ' + formatVal(sourceBinRange[1]) + '] ↔︎ ') + (data[3][1] + ' ∈ [ ' + formatVal(targetBinRange[0]) + ', ' + formatVal(targetBinRange[1]) + '] ' + formatMI(data[1]));
        }).on('mouseover', function mouseOver() {
          publicAPI.updateStatusBarText(_d3.default.select(this).attr('data-details'));
        }).on('mouseout', function () {
          publicAPI.updateStatusBarText('');
        }).on('click', function () {
          publicAPI.selectStatusBarText();
        });
      };
    }
  };

  function handleHoverUpdate(data) {
    var svg = _d3.default.select(model.container);
    Object.keys(data.state).forEach(function (pName) {
      var binList = data.state[pName];
      svg.selectAll('g.group[param-name=\'' + pName + '\'] > path.htile').classed('hilite', function (d, i) {
        return binList.indexOf(-1) === -1 && binList.indexOf(i) >= 0;
      });
    });
  }

  // Make sure default values get applied
  publicAPI.setContainer(model.container);

  model.subscriptions.push({ unsubscribe: publicAPI.setContainer });
  model.subscriptions.push(model.provider.onFieldChange(function () {
    model.renderState = {
      pmiAllBinsTwoVars: null,
      pmiOneBinAllVars: null,
      pmiHighlight: null
    };
    if (model.provider.setMutualInformationParameterNames) {
      model.provider.setMutualInformationParameterNames(model.provider.getActiveFieldNames());
    }
  }));

  if (model.provider.isA('Histogram1DProvider')) {
    model.histogram1DDataSubscription = model.provider.subscribeToHistogram1D(function (data) {
      model.histogramData = data;
      publicAPI.render();
    }, model.provider.getFieldNames(), {
      numberOfBins: model.numberOfBins,
      partial: false
    });

    model.subscriptions.push(model.histogram1DDataSubscription);
  }

  if (model.provider.isA('MutualInformationProvider')) {
    model.mutualInformationDataSubscription = model.provider.onMutualInformationReady(function (data) {
      model.mutualInformationData = data;
      publicAPI.render();
    });

    model.subscriptions.push(model.mutualInformationDataSubscription);
    model.provider.setMutualInformationParameterNames(model.provider.getActiveFieldNames());
  }

  if (model.provider.isA('HistogramBinHoverProvider')) {
    model.subscriptions.push(model.provider.onHoverBinChange(handleHoverUpdate));
  }

  if (model.provider.isA('SelectionProvider')) {
    model.subscriptions.push(model.provider.onAnnotationChange(function (annotation) {
      if (lastAnnotationPushed && annotation.selection.type === 'range' && annotation.id === lastAnnotationPushed.id && annotation.generation === lastAnnotationPushed.generation + 1) {
        // Assume that it is still ours but edited by someone else
        lastAnnotationPushed = annotation;
        // Capture the score and update our default
        model.defaultScore = lastAnnotationPushed.score[0];
      }
    }));
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  container: null,
  provider: null,

  needData: true,

  glyphSize: 15,

  statusBarVisible: false,

  useAnnotation: false,
  defaultScore: 0,
  defaultWeight: 1,

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

  informationDiagram(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };