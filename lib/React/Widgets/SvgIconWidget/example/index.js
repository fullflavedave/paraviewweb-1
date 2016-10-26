define(['react', 'react-dom', '..', './style.mcss', '../../../../../svg/paraview.svg', '../../../../../svg/paraviewweb.svg', '../../../../../svg/function-gaussian.svg', '../../../../../svg/function-linear.svg', 'babel-polyfill'], function (_react, _reactDom, _, _style, _paraview, _paraviewweb, _functionGaussian, _functionLinear) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _2 = _interopRequireDefault(_);

  var _style2 = _interopRequireDefault(_style);

  var _paraview2 = _interopRequireDefault(_paraview);

  var _paraviewweb2 = _interopRequireDefault(_paraviewweb);

  var _functionGaussian2 = _interopRequireDefault(_functionGaussian);

  var _functionLinear2 = _interopRequireDefault(_functionLinear);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var container = document.querySelector('.content');

  _reactDom2.default.render(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_2.default, { width: '30px', height: '30px' }),
    _react2.default.createElement(_2.default, { className: _style2.default.smallIcon, icon: _paraview2.default }),
    _react2.default.createElement(_2.default, { className: _style2.default.mediumIcon, icon: _paraviewweb2.default }),
    _react2.default.createElement(_2.default, { className: _style2.default.bigIcon, icon: _functionGaussian2.default }),
    _react2.default.createElement(_2.default, { className: _style2.default.redIcon, icon: _functionLinear2.default })
  ), container);

  document.body.style.margin = '10px';
});