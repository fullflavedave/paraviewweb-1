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

var _InlineToggleButtonWidget = require('../../Widgets/InlineToggleButtonWidget');

var _InlineToggleButtonWidget2 = _interopRequireDefault(_InlineToggleButtonWidget);

var _ToggleIconButtonWidget = require('../../Widgets/ToggleIconButtonWidget');

var _ToggleIconButtonWidget2 = _interopRequireDefault(_ToggleIconButtonWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = _react2.default.createClass({

  displayName: 'TimeFloatImageControl',

  propTypes: {
    model: _react2.default.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      change: false
    };
  },
  componentWillMount: function componentWillMount() {
    this.attachListener();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var previous = this.props.model,
        next = nextProps.model;

    if (previous !== next) {
      // Force redraw
      this.attachListener();
      this.setState({ change: !this.state.change });
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.removeListener();
  },
  onActiveView: function onActiveView(obj, activeView) {
    this.props.model.setActiveView(activeView);
    this.forceUpdate();
  },
  attachListener: function attachListener() {
    var _this = this;

    this.removeListener();
    this.subscription = this.props.model.probeManager.onChange(function () {
      _this.forceUpdate();
    });
  },
  removeListener: function removeListener() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  },
  addProbe: function addProbe() {
    this.props.model.probeManager.addProbe();
    this.props.model.render();
    this.forceUpdate();
  },
  removeProbe: function removeProbe() {
    var activeProbe = this.props.model.probeManager.getActiveProbe();
    if (activeProbe) {
      this.props.model.probeManager.removeProbe(activeProbe.name);
      this.props.model.render();
      this.forceUpdate();
    }
  },
  updateProbe: function updateProbe(event) {
    var name = event.target.name;
    var value = event.target.value;
    var activeProbe = this.props.model.probeManager.getActiveProbe();

    if (name === 'name') {
      activeProbe.updateName(value);
    } else {
      var idx = Number(name);
      var extent = [].concat(activeProbe.getExtent());
      extent[idx] = Number(value);
      activeProbe.updateExtent.apply(activeProbe, _toConsumableArray(extent));
    }
  },
  updateActive: function updateActive(e) {
    var name = e.target.value;
    this.props.model.probeManager.setActiveProbe(name);
  },
  toggleProbe: function toggleProbe(e) {
    var target = e.target;
    while (!target.dataset.name) {
      target = target.parentNode;
    }
    var name = target.dataset.name;
    var enable = !Number(target.dataset.active);
    this.props.model.enableProbe(name, enable);
  },
  sortProbes: function sortProbes() {
    this.props.model.sortProbesByName();
  },
  render: function render() {
    var probeManager = this.props.model.probeManager;

    var _props$model$getContr = this.props.model.getControlModels();

    var queryDataModel = _props$model$getContr.queryDataModel;

    var timeIdx = queryDataModel.getIndex('time');
    var chartData = this.props.model.chartData;
    var activeView = this.props.model.getActiveView();
    var buttons = [_react2.default.createElement(_ToggleIconButtonWidget2.default, { key: '0', toggle: false, className: _FloatImageControl2.default.addProbeIcon, icon: '', onChange: this.addProbe })];
    var activeProbe = probeManager.getActiveProbe();
    if (activeProbe) {
      buttons.push(_react2.default.createElement(_ToggleIconButtonWidget2.default, { key: '1', toggle: false, className: _FloatImageControl2.default.removeProbeIcon, icon: '', onChange: this.removeProbe }));
    }
    var sortProbes = _react2.default.createElement(_ToggleIconButtonWidget2.default, { toggle: false, className: _FloatImageControl2.default.sortProbeIcon, icon: '', onChange: this.sortProbes });

    // Put minus before
    buttons.reverse();

    return _react2.default.createElement(
      'div',
      { className: _FloatImageControl2.default.container },
      _react2.default.createElement(
        'div',
        { style: { padding: '10px 5px 5px' } },
        _react2.default.createElement(_InlineToggleButtonWidget2.default, {
          options: [{ icon: _FloatImageControl2.default.imageViewIcon }, { icon: _FloatImageControl2.default.bothViewIcon }],
          activeColor: '#ccc',
          defaultColor: 'rgba(0,0,0,0)',
          active: activeView,
          onChange: this.onActiveView
        })
      ),
      _react2.default.createElement(
        _CollapsibleWidget2.default,
        { title: 'Time probes', activeSubTitle: true, subtitle: buttons, visible: true },
        _react2.default.createElement(
          'section',
          { className: _FloatImageControl2.default.item },
          _react2.default.createElement(
            'label',
            { className: _FloatImageControl2.default.smallLabel },
            'Name'
          ),
          _react2.default.createElement('input', { className: _FloatImageControl2.default.input, type: 'text', name: 'name', value: activeProbe ? activeProbe.name : '' || '', onChange: this.updateProbe }),
          _react2.default.createElement(
            'select',
            { className: _FloatImageControl2.default.dropDown, value: undefined, onChange: this.updateActive },
            probeManager.getProbeNames().map(function (name, index) {
              return _react2.default.createElement(
                'option',
                { key: index, value: name },
                name
              );
            })
          )
        ),
        _react2.default.createElement(
          'section',
          { className: _FloatImageControl2.default.item },
          _react2.default.createElement(
            'label',
            { className: _FloatImageControl2.default.smallLabel },
            'X'
          ),
          _react2.default.createElement('input', { className: _FloatImageControl2.default.input, type: 'number', name: '0', value: activeProbe ? activeProbe.extent[0] : 0, onChange: this.updateProbe }),
          _react2.default.createElement('input', { className: _FloatImageControl2.default.input, type: 'number', name: '1', value: activeProbe ? activeProbe.extent[1] : 5, onChange: this.updateProbe })
        ),
        _react2.default.createElement(
          'section',
          { className: _FloatImageControl2.default.item },
          _react2.default.createElement(
            'label',
            { className: _FloatImageControl2.default.smallLabel },
            'Y'
          ),
          _react2.default.createElement('input', { className: _FloatImageControl2.default.input, type: 'number', name: '2', value: activeProbe ? activeProbe.extent[2] : 0, onChange: this.updateProbe }),
          _react2.default.createElement('input', { className: _FloatImageControl2.default.input, type: 'number', name: '3', value: activeProbe ? activeProbe.extent[3] : 5, onChange: this.updateProbe })
        )
      ),
      _react2.default.createElement(
        _CollapsibleWidget2.default,
        { title: 'Legend', visible: activeView > 0, activeSubTitle: true, subtitle: sortProbes },
        chartData.fields.map(function (field, index) {
          return _react2.default.createElement(
            'section',
            { key: index, className: _FloatImageControl2.default.item, 'data-name': field.name, 'data-active': field.active ? '1' : '0' },
            _react2.default.createElement(
              'label',
              { className: _FloatImageControl2.default.label },
              _react2.default.createElement('i', { className: field.active ? _FloatImageControl2.default.enableLegendIcon : _FloatImageControl2.default.disableLegendIcon, style: { color: field.color } }),
              field.name
            ),
            _react2.default.createElement(
              'span',
              { className: _FloatImageControl2.default.value, title: field.data[timeIdx] },
              field.data[timeIdx]
            )
          );
        })
      )
    );
  }
});