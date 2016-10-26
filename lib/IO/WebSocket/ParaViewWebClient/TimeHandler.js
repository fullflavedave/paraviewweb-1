define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMethods;
  /* eslint-disable arrow-body-style */
  function createMethods(session) {
    return {
      updateTime: function updateTime(action) {
        return session.call('pv.vcr.action', [action]);
      },
      next: function next() {
        return session.call('pv.vcr.action', ['next']);
      },
      previous: function previous() {
        return session.call('pv.vcr.action', ['prev']);
      },
      first: function first() {
        return session.call('pv.vcr.action', ['first']);
      },
      last: function last() {
        return session.call('pv.vcr.action', ['last']);
      },

      setTimeStep: function setTimeStep(idx) {
        return session.call('pv.time.index.set', [idx]);
      },

      getTimeStep: function getTimeStep() {
        return session.call('pv.time.index.get', []);
      },

      setTimeValue: function setTimeValue(t) {
        return session.call('pv.time.value.set', [t]);
      },

      getTimeValue: function getTimeValue() {
        return session.call('pv.time.value.get', []);
      },

      getTimeValues: function getTimeValues() {
        return session.call('pv.time.values', []);
      },

      play: function play() {
        var deltaT = arguments.length <= 0 || arguments[0] === undefined ? 0.1 : arguments[0];

        return session.call('pv.time.play', [deltaT]);
      },

      stop: function stop() {
        return session.call('pv.time.stop', []);
      }
    };
  }
});