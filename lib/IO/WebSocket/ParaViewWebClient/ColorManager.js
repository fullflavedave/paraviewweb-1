define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMethods;
  /* eslint-disable arrow-body-style */
  function createMethods(session) {
    return {
      getScalarBarVisibilities: function getScalarBarVisibilities(proxyIdList) {
        return session.call('pv.color.manager.scalarbar.visibility.get', [proxyIdList]);
      },
      setScalarBarVisibilities: function setScalarBarVisibilities(proxyIdMap) {
        return session.call('pv.color.manager.scalarbar.visibility.set', [proxyIdMap]);
      },
      rescaleTransferFunction: function rescaleTransferFunction(options) {
        return session.call('pv.color.manager.rescale.transfer.function', [options]);
      },
      getCurrentScalarRange: function getCurrentScalarRange(proxyId) {
        return session.call('pv.color.manager.scalar.range.get', [proxyId]);
      },
      colorBy: function colorBy(representation, colorMode) {
        var arrayLocation = arguments.length <= 2 || arguments[2] === undefined ? 'POINTS' : arguments[2];
        var arrayName = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
        var vectorMode = arguments.length <= 4 || arguments[4] === undefined ? 'Magnitude' : arguments[4];
        var vectorComponent = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
        var rescale = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

        return session.call('pv.color.manager.color.by', [representation, colorMode, arrayLocation, arrayName, vectorMode, vectorComponent, rescale]);
      },
      setOpacityFunctionPoints: function setOpacityFunctionPoints(arrayName, pointArray) {
        return session.call('pv.color.manager.opacity.points.set', [arrayName, pointArray]);
      },
      getOpacityFunctionPoints: function getOpacityFunctionPoints(arrayName) {
        return session.call('pv.color.manager.opacity.points.get', [arrayName]);
      },
      getRgbPoints: function getRgbPoints(arrayName) {
        return session.call('pv.color.manager.rgb.points.get', [arrayName]);
      },
      setRgbPoints: function setRgbPoints(arrayName, rgbInfo) {
        return session.call('pv.color.manager.rgb.points.set', [arrayName, rgbInfo]);
      },
      getLutImage: function getLutImage(representation, numSamples) {
        var customRange = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        return session.call('pv.color.manager.lut.image.get', [representation, numSamples, customRange]);
      },
      setSurfaceOpacity: function setSurfaceOpacity(representation, enabled) {
        return session.call('pv.color.manager.surface.opacity.set', [representation, enabled]);
      },
      getSurfaceOpacity: function getSurfaceOpacity(representation) {
        return session.call('pv.color.manager.surface.opacity.get', [representation]);
      },
      selectColorMap: function selectColorMap(representation, paletteName) {
        return session.call('pv.color.manager.select.preset', [representation, paletteName]);
      },
      listColorMapNames: function listColorMapNames() {
        return session.call('pv.color.manager.list.preset', []);
      },
      listColorMapImages: function listColorMapImages() {
        var numSamples = arguments.length <= 0 || arguments[0] === undefined ? 256 : arguments[0];

        return session.call('pv.color.manager.lut.image.all', [numSamples]);
      }
    };
  }
});