define(['exports', '.', './Axis', '../../../Common/Misc/SelectionBuilder'], function (exports, _, _Axis, _SelectionBuilder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Axis2 = _interopRequireDefault(_Axis);

  var _SelectionBuilder2 = _interopRequireDefault(_SelectionBuilder);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  function toEndpoint(closeLeft, closeRight) {
    var result = [];
    result.push(closeLeft ? '*' : 'o');
    result.push(closeRight ? '*' : 'o');
    return result.join('');
  }

  // ----------------------------------------------------------------------------

  var AxesManager = function () {
    function AxesManager() {
      _classCallCheck(this, AxesManager);

      this.axes = [];
      this.listeners = [];
      this.axisListChangeListeners = [];
    }

    _createClass(AxesManager, [{
      key: 'clearAxes',
      value: function clearAxes() {
        if (this.axes.length) {
          this.axes = [];
          this.triggerAxisListChange();
        }
      }
    }, {
      key: 'updateAxes',
      value: function updateAxes(axisList) {
        var _this = this;

        if (this.axes.length === 0) {
          axisList.forEach(function (entry) {
            _this.addAxis(new _Axis2.default(entry.name, entry.range));
          });
        } else {
          (function () {
            var targetList = [];
            var toAdd = [];

            // index axes
            var nameToAxisMap = {};
            _this.axes.forEach(function (axis) {
              nameToAxisMap[axis.name] = axis;
            });

            axisList.forEach(function (entry) {
              targetList.push(entry.name);
              if (!nameToAxisMap[entry.name]) {
                toAdd.push(new _Axis2.default(entry.name, entry.range));
              }
            });

            // Remove unwanted axis while keeping the previous order
            var previousSize = _this.axes.length;
            _this.axes = _this.axes.filter(function (axis) {
              return targetList.indexOf(axis.name) !== -1;
            }).concat(toAdd);
            if (toAdd.length || _this.axes.length !== previousSize) {
              _this.triggerAxisListChange();
            }
          })();
        }
        // Update index
        this.axes.forEach(function (item, idx) {
          item.idx = idx;
        });
      }
    }, {
      key: 'addAxis',
      value: function addAxis(axis) {
        axis.idx = this.axes.length;
        this.axes.push(axis);
        this.triggerAxisListChange();
      }
    }, {
      key: 'getAxis',
      value: function getAxis(index) {
        return this.axes[index];
      }
    }, {
      key: 'getAxisByName',
      value: function getAxisByName(name) {
        return this.axes.filter(function (axis) {
          return axis.name === name;
        })[0];
      }
    }, {
      key: 'canRender',
      value: function canRender() {
        return this.axes.length > 1;
      }
    }, {
      key: 'getNumberOf2DHistogram',
      value: function getNumberOf2DHistogram() {
        return this.axes.length - 1;
      }
    }, {
      key: 'getNumberOfAxes',
      value: function getNumberOfAxes() {
        return this.axes.length;
      }
    }, {
      key: 'getAxesNames',
      value: function getAxesNames() {
        return this.axes.map(function (axis) {
          return axis.name;
        });
      }
    }, {
      key: 'getAxesPairs',
      value: function getAxesPairs() {
        var axesPairs = [];
        for (var i = 1; i < this.axes.length; i++) {
          axesPairs.push([this.axes[i - 1].name, this.axes[i].name]);
        }
        return axesPairs;
      }
    }, {
      key: 'resetSelections',
      value: function resetSelections() {
        var selection = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var triggerEvent = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        var _this2 = this;

        var scoreMapping = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
        var scoreColorMap = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

        this.clearAllSelections(true);

        // index axes
        var nameToAxisMap = {};
        this.axes.forEach(function (axis) {
          nameToAxisMap[axis.name] = axis;
        });

        // Update selections
        if (selection) {
          if (selection.type === 'range') {
            this.selection = selection;
            Object.keys(selection.range.variables).forEach(function (axisName) {
              if (nameToAxisMap[axisName]) {
                nameToAxisMap[axisName].selections = selection.range.variables[axisName].map(function (i) {
                  return Object.assign({}, i);
                });
                if (scoreMapping && scoreMapping.length === 1) {
                  nameToAxisMap[axisName].selections.forEach(function (axisSelection) {
                    axisSelection.score = scoreMapping[0];
                    axisSelection.color = scoreColorMap[scoreMapping[0]] ? 'rgb(' + scoreColorMap[scoreMapping[0]].join(',') + ')' : 'rgb(105, 195, 255)';
                  });
                }
              }
            });
          } else if (selection.type === 'partition') {
            (function () {
              _this2.selection = selection;
              var axis = nameToAxisMap[selection.partition.variable];
              if (axis) {
                axis.selections = [];
                selection.partition.dividers.forEach(function (divider, idx, array) {
                  if (idx === 0) {
                    axis.selections.push({
                      interval: [axis.range[0], divider.value],
                      endpoints: toEndpoint(true, !divider.closeToLeft),
                      uncertainty: divider.uncertainty, // FIXME that is wrong...
                      color: scoreColorMap[scoreMapping[idx]] ? 'rgb(' + scoreColorMap[scoreMapping[idx]].join(',') + ')' : 'rgb(105, 195, 255)',
                      score: scoreMapping[idx]
                    });
                  } else {
                    axis.selections.push({
                      interval: [array[idx - 1].value, divider.value],
                      endpoints: toEndpoint(array[idx - 1].closeToLeft, !divider.closeToLeft),
                      uncertainty: divider.uncertainty, // FIXME that is wrong...
                      color: scoreColorMap[scoreMapping[idx]] ? 'rgb(' + scoreColorMap[scoreMapping[idx]].join(',') + ')' : 'rgb(105, 195, 255)',
                      score: scoreMapping[idx]
                    });
                  }
                  if (idx + 1 === array.length) {
                    axis.selections.push({
                      interval: [divider.value, axis.range[1]],
                      endpoints: toEndpoint(divider.closeToLeft, true),
                      uncertainty: divider.uncertainty, // FIXME that is wrong...
                      color: scoreColorMap[scoreMapping[idx + 1]] ? 'rgb(' + scoreColorMap[scoreMapping[idx + 1]].join(',') + ')' : 'rgb(105, 195, 255)',
                      score: scoreMapping[idx + 1]
                    });
                  }
                });
              }
            })();
          } else if (selection.type === 'empty') {
            // nothing to do we already cleared the selection
          } else {
              console.error(selection, 'Parallel coordinate does not understand a selection that is not range based');
            }
        }

        if (triggerEvent) {
          this.triggerSelectionChange(false);
        }
      }
    }, {
      key: 'addSelection',
      value: function addSelection(axisIdx, start, end, endpoints, uncertainty) {
        this.axes[axisIdx].addSelection(start < end ? start : end, end < start ? start : end, endpoints, uncertainty);
        this.triggerSelectionChange();
      }
    }, {
      key: 'updateSelection',
      value: function updateSelection(axisIdx, selectionIdx, start, end) {
        this.axes[axisIdx].updateSelection(selectionIdx, start < end ? start : end, end < start ? start : end);
        this.triggerSelectionChange();
      }
    }, {
      key: 'clearSelection',
      value: function clearSelection(axisIdx) {
        this.axes[axisIdx].clearSelection();
        this.triggerSelectionChange();
      }
    }, {
      key: 'getAxisCenter',
      value: function getAxisCenter(index, width) {
        return index * width / (this.axes.length - 1);
      }
    }, {
      key: 'toggleOrientation',
      value: function toggleOrientation(index) {
        this.axes[index].toggleOrientation();
      }
    }, {
      key: 'swapAxes',
      value: function swapAxes(aIdx, bIdx) {
        if (!this.axes[aIdx] || !this.axes[bIdx]) {
          return;
        }
        var a = this.axes[aIdx];
        var b = this.axes[bIdx];
        this.axes[aIdx] = b;
        this.axes[bIdx] = a;
        a.idx = bIdx;
        b.idx = aIdx;
        this.triggerAxisListChange();
      }
    }, {
      key: 'hasSelection',
      value: function hasSelection() {
        return this.axes.filter(function (axis) {
          return axis.hasSelection();
        }).length > 0;
      }
    }, {
      key: 'clearAllSelections',
      value: function clearAllSelections(silence) {
        this.axes.forEach(function (axis) {
          return axis.clearSelection();
        });
        if (!silence) {
          this.triggerSelectionChange();
        }
      }
    }, {
      key: 'onSelectionChange',
      value: function onSelectionChange(callback) {
        var _this3 = this;

        var listenerId = this.listeners.length;
        var unsubscribe = function unsubscribe() {
          _this3.listeners[listenerId] = null;
        };
        this.listeners.push(callback);
        return { unsubscribe: unsubscribe };
      }
    }, {
      key: 'triggerSelectionChange',
      value: function triggerSelectionChange() {
        var _this4 = this;

        var reset = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        setImmediate(function () {
          if (reset) {
            _this4.selection = null;
          }
          var selection = _this4.getSelection();
          // Notify listeners
          _this4.listeners.forEach(function (listener) {
            if (listener) {
              listener(selection);
            }
          });
        });
      }
    }, {
      key: 'onAxisListChange',
      value: function onAxisListChange(callback) {
        var _this5 = this;

        var listenerId = this.axisListChangeListeners.length;
        var unsubscribe = function unsubscribe() {
          _this5.axisListChangeListeners[listenerId] = null;
        };
        this.axisListChangeListeners.push(callback);
        return { unsubscribe: unsubscribe };
      }
    }, {
      key: 'triggerAxisListChange',
      value: function triggerAxisListChange() {
        var _this6 = this;

        setImmediate(function () {
          // Notify listeners
          _this6.axisListChangeListeners.forEach(function (listener) {
            if (listener) {
              listener(_this6.getAxesPairs());
            }
          });
        });
      }
    }, {
      key: 'getSelection',
      value: function getSelection() {
        var _this7 = this;

        if (!this.selection) {
          (function () {
            var vars = {};
            var selectionCount = 0;
            _this7.axes.forEach(function (axis) {
              if (axis.hasSelection()) {
                vars[axis.name] = [].concat(axis.selections);
                selectionCount += 1;
              }
            });
            _this7.selection = selectionCount ? _SelectionBuilder2.default.range(vars) : _SelectionBuilder2.default.EMPTY_SELECTION;
          })();
        }

        return this.selection;
      }
    }, {
      key: 'extractSelections',
      value: function extractSelections(model, drawScore) {
        var _this8 = this;

        var selections = [];
        if (this.hasSelection()) {
          this.axes.forEach(function (axis, index) {
            var screenX = _this8.getAxisCenter(index, model.drawableArea.width) + model.borderOffsetLeft;
            axis.selections.forEach(function (selection, selectionIndex) {
              if (drawScore && selection.score !== undefined) {
                if (!drawScore(selection.score)) {
                  return; // Skip unwanted score
                }
              }
              selections.push({
                index: index,
                selectionIndex: selectionIndex,
                screenX: screenX,
                screenRangeY: [(0, _.dataToScreen)(model, selection.interval[0], axis), (0, _.dataToScreen)(model, selection.interval[1], axis)],
                color: selection.color ? selection.color : 'rgb(105, 195, 255)'
              });
            });
          });
        }
        return selections;
      }
    }, {
      key: 'extractAxesControl',
      value: function extractAxesControl(model) {
        var _this9 = this;

        var controlsDataModel = [];
        this.axes.forEach(function (axis, index) {
          controlsDataModel.push({
            orient: !axis.isUpsideDown(),
            centerX: _this9.getAxisCenter(index, model.drawableArea.width) + model.borderOffsetLeft,
            centerY: model.canvasArea.height - model.borderOffsetBottom + 30 });
        });

        // Tag first/last axis
        // FIXME what is 30?
        controlsDataModel[0].pos = -1;
        controlsDataModel[controlsDataModel.length - 1].pos = 1;

        return controlsDataModel;
      }
    }, {
      key: 'extractLabels',
      value: function extractLabels(model) {
        var _this10 = this;

        var labelModel = [];

        this.axes.forEach(function (axis, index) {
          labelModel.push({
            name: axis.name,
            centerX: _this10.getAxisCenter(index, model.drawableArea.width) + model.borderOffsetLeft,
            annotated: axis.hasSelection(),
            align: 'middle'
          });
        });

        // Tag first/last axis
        labelModel[0].align = 'start';
        labelModel[labelModel.length - 1].align = 'end';

        return labelModel;
      }
    }, {
      key: 'extractAxisTicks',
      value: function extractAxisTicks(model) {
        var _this11 = this;

        var tickModel = [];

        this.axes.forEach(function (axis, index) {
          tickModel.push({
            value: !axis.upsideDown ? axis.range[1] : axis.range[0],
            xpos: _this11.getAxisCenter(index, model.drawableArea.width) + model.borderOffsetLeft,
            ypos: model.borderOffsetTop - 4,
            align: 'middle'
          });
          tickModel.push({
            value: !axis.upsideDown ? axis.range[0] : axis.range[1],
            xpos: _this11.getAxisCenter(index, model.drawableArea.width) + model.borderOffsetLeft,
            ypos: model.borderOffsetTop + model.drawableArea.height + 13,
            align: 'middle'
          });
        });

        // Make adjustments to ticks for first and last axes
        tickModel[0].align = 'start';
        tickModel[1].align = 'start';
        tickModel[0].xpos -= model.axisWidth / 2;
        tickModel[1].xpos -= model.axisWidth / 2;

        tickModel[this.axes.length * 2 - 1].align = 'end';
        tickModel[this.axes.length * 2 - 2].align = 'end';
        tickModel[this.axes.length * 2 - 1].xpos += model.axisWidth / 2;
        tickModel[this.axes.length * 2 - 2].xpos += model.axisWidth / 2;

        return tickModel;
      }
    }, {
      key: 'extractAxesCenters',
      value: function extractAxesCenters(model) {
        var _this12 = this;

        var axesCenters = [];
        this.axes.forEach(function (axis, index) {
          axesCenters.push(_this12.getAxisCenter(index, model.drawableArea.width) + model.borderOffsetLeft);
        });
        return axesCenters;
      }
    }]);

    return AxesManager;
  }();

  exports.default = AxesManager;
});