'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FloatImageControl = require('PVWStyle/ReactCollapsibleControls/FloatImageControl.mcss');

var _FloatImageControl2 = _interopRequireDefault(_FloatImageControl);

var _CollapsibleWidget = require('../../Widgets/CollapsibleWidget');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

var _LayerItem = require('./LayerItem');

var _LayerItem2 = _interopRequireDefault(_LayerItem);

var _NumberSliderWidget = require('../../Widgets/NumberSliderWidget');

var _NumberSliderWidget2 = _interopRequireDefault(_NumberSliderWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'FloatImageControl',

  propTypes: {
    model: _react2.default.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    this.attachListener(this.props.model);
    return {
      change: false,
      x: this.props.model.dimensions[0] / 2,
      y: this.props.model.dimensions[1] / 2
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var previous = this.props.model,
        next = nextProps.model;

    if (previous !== next) {
      this.detachListener();
      this.attachListener(next);

      // Force redraw
      this.setState({ change: !this.state.change });
    }
  },
  onProbeChange: function onProbeChange(e) {
    var name = e.target.name,
        newVal = Number(e.target.value),
        newState = { x: this.state.x, y: this.state.y };

    newState[name] = newVal;
    this.setState(newState);
    this.props.model.getTimeChart(newState.x, newState.y);
  },
  attachListener: function attachListener(model) {
    var _this = this;

    this.changeSubscription = model.onProbeChange(function (data, envelope) {
      _this.forceUpdate();
    });
  },
  detachListener: function detachListener() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      this.changeSubscription = null;
    }
  },
  updateLight: function updateLight(event) {
    this.props.model.setLight(255 - event.target.value);
    this.setState({ change: !this.state.change });
  },
  toggleProbe: function toggleProbe(newVal) {
    this.props.model.getTimeProbe().enabled = !!newVal;

    if (this.props.model.getTimeProbe().enabled) {
      this.props.model.getTimeChart();
    }

    this.setState({ change: !this.state.change });

    this.props.model.getTimeProbe().triggerChange();
    this.props.model.render();
  },
  render: function render() {
    var floatImageModel = this.props.model,
        timeProbe = floatImageModel.getTimeProbe(),
        width = floatImageModel.dimensions[0],
        height = floatImageModel.dimensions[1];

    return _react2.default.createElement(
      'div',
      { className: _FloatImageControl2.default.container },
      _react2.default.createElement(
        _CollapsibleWidget2.default,
        { title: 'Scene' },
        floatImageModel.getLayers().map(function (item, idx) {
          return _react2.default.createElement(_LayerItem2.default, { key: idx, item: item, model: floatImageModel });
        }),
        _react2.default.createElement(
          'div',
          { className: _FloatImageControl2.default.item },
          _react2.default.createElement(
            'div',
            { className: _FloatImageControl2.default.label },
            'Light'
          ),
          _react2.default.createElement(
            'div',
            { className: _FloatImageControl2.default.actions },
            _react2.default.createElement('input', {
              className: _FloatImageControl2.default.lightSlider,
              type: 'range', min: '0', max: '128',
              value: 255 - floatImageModel.getLight(),
              onChange: this.updateLight
            })
          )
        )
      ),
      _react2.default.createElement(
        _CollapsibleWidget2.default,
        {
          title: 'Time probe',
          open: timeProbe.enabled,
          subtitle: timeProbe.enabled ? timeProbe.value : '',
          visible: floatImageModel.isMultiView(),
          onChange: this.toggleProbe
        },
        _react2.default.createElement(
          'div',
          { className: _FloatImageControl2.default.item },
          _react2.default.createElement(
            'div',
            { className: _FloatImageControl2.default.label },
            'X'
          ),
          _react2.default.createElement(
            'div',
            { className: _FloatImageControl2.default.actions },
            _react2.default.createElement(_NumberSliderWidget2.default, {
              step: 1, min: 0.0, max: width,
              key: 'x', value: this.state.x, name: 'x',
              onChange: this.onProbeChange
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _FloatImageControl2.default.item },
          _react2.default.createElement(
            'div',
            { className: _FloatImageControl2.default.label },
            'Y'
          ),
          _react2.default.createElement(
            'div',
            { className: _FloatImageControl2.default.actions },
            _react2.default.createElement(_NumberSliderWidget2.default, {
              step: 1, min: 0.0, max: height,
              key: 'y', value: this.state.y, name: 'y', onChange: this.onProbeChange
            })
          )
        )
      )
    );
  }
});