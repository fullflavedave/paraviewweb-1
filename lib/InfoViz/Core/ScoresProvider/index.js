'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _CompositeClosureHelper = require('../../../Common/Core/CompositeClosureHelper');

var _CompositeClosureHelper2 = _interopRequireDefault(_CompositeClosureHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Partition Provider
// ----------------------------------------------------------------------------

function scoresProvider(publicAPI, model) {
  publicAPI.setScores = function (scores) {
    model.scores = [].concat(scores);
    var scoreMapByValue = {};
    model.scores.forEach(function (score) {
      scoreMapByValue[score.value] = score;
    });
    model.scoreMapByValue = scoreMapByValue;
    publicAPI.fireScoresChange(model.scores);
  };

  publicAPI.getScoreColor = function (value) {
    var score = model.scoreMapByValue[value];
    return score ? score.color : undefined;
  };

  publicAPI.getScoreName = function (value) {
    var score = model.scoreMapByValue[value];
    return score ? score.name : undefined;
  };
  publicAPI.getDefaultScore = function () {
    if (model.scores) {
      var index = model.scores.findIndex(function (score) {
        return !!score.isDefault;
      });
      return index === -1 ? 0 : index;
    }
    return 0;
  };
  publicAPI.setDefaultScore = function (value) {
    if (model.scores) {
      model.scores[publicAPI.getDefaultScore()].isDefault = false;
      model.scores[value].isDefault = true;
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // scores: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _CompositeClosureHelper2.default.destroy(publicAPI, model);
  _CompositeClosureHelper2.default.isA(publicAPI, model, 'ScoresProvider');
  _CompositeClosureHelper2.default.event(publicAPI, model, 'scoresChange', false);
  _CompositeClosureHelper2.default.get(publicAPI, model, ['scores']);

  scoresProvider(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _CompositeClosureHelper2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };