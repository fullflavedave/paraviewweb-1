'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Probe3DViewer = require('PVWStyle/ReactViewers/Probe3DViewer.mcss');

var _Probe3DViewer2 = _interopRequireDefault(_Probe3DViewer);

var _AbstractViewerMenu = require('../AbstractViewerMenu');

var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

var _LineChartViewer = require('../LineChartViewer');

var _LineChartViewer2 = _interopRequireDefault(_LineChartViewer);

var _LookupTableManagerControl = require('../../CollapsibleControls/LookupTableManagerControl');

var _LookupTableManagerControl2 = _interopRequireDefault(_LookupTableManagerControl);

var _ProbeControl = require('../../CollapsibleControls/ProbeControl');

var _ProbeControl2 = _interopRequireDefault(_ProbeControl);

var _CollapsibleWidget = require('../../Widgets/CollapsibleWidget');

var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

var _QueryDataModelWidget = require('../../Widgets/QueryDataModelWidget');

var _QueryDataModelWidget2 = _interopRequireDefault(_QueryDataModelWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderAxisMap = {
  XY: [0, 1, 2],
  ZY: [2, 1, 0],
  XZ: [0, 2, 1]
},
    chartAxisNames = ['x', 'y', 'z'];

exports.default = _react2.default.createClass({

  displayName: 'Probe3DViewer',

  propTypes: {
    imageBuilder: _react2.default.PropTypes.object.isRequired,
    probe: _react2.default.PropTypes.bool,
    queryDataModel: _react2.default.PropTypes.object.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      probe: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      probe: [this.props.imageBuilder.getProbe()[0], this.props.imageBuilder.getProbe()[1], this.props.imageBuilder.getProbe()[2]],
      chartVisible: false,
      chartSize: {
        width: 300,
        height: 300
      },
      chartData: {
        xRange: [0, 1],
        fields: []
      },
      chartAxis: 0
    };
  },


  // Auto mount listener unless notified otherwise
  componentWillMount: function componentWillMount() {
    var _this = this;

    var queryDataModel = this.props.queryDataModel,
        imageBuilder = this.props.imageBuilder;

    this.dragChartFlag = false;

    // Update probe chart data if data change
    this.queryDataModelDataSubscription = queryDataModel.onDataChange(function (data, envelope) {
      _this.setState({ chartData: imageBuilder.getProbeLine(_this.liveChartAxis) });
    });

    // Render method change
    imageBuilder.setRenderMethodMutable();
    this.renderMethodChangeSubscription = imageBuilder.onRenderMethodChange(function (data, envelope) {
      if (_this.state.chartVisible) {
        _this.validateChartAxis();
      }
    });

    // Chart management
    imageBuilder.setProbeLineNotification(true);
    this.chartListenerSubscription = imageBuilder.onProbeLineReady(function (data, envelope) {
      var chartData = data[chartAxisNames[_this.liveChartAxis]];
      _this.setState({ chartData: chartData });
    });

    this.probeListenerSubscription = imageBuilder.onProbeChange(function (probe, envelope) {
      _this.setState({ probe: probe });
    });
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.chartVisible) {
      this.chartViewer.updateDimensions();
    }
  },


  // Auto unmount listener
  componentWillUnmount: function componentWillUnmount() {
    if (this.queryDataModelDataSubscription) {
      this.queryDataModelDataSubscription.unsubscribe();
      this.queryDataModelDataSubscription = null;
    }
    if (this.renderMethodChangeSubscription) {
      this.renderMethodChangeSubscription.unsubscribe();
      this.renderMethodChangeSubscription = null;
    }
    if (this.chartListenerSubscription) {
      this.chartListenerSubscription.unsubscribe();
      this.chartListenerSubscription = null;
    }
    if (this.probeListenerSubscription) {
      this.probeListenerSubscription.unsubscribe();
      this.probeListenerSubscription = null;
    }
  },
  onChartVisibilityChange: function onChartVisibilityChange(isOpen) {
    if (isOpen) {
      this.validateChartAxis();
    }
    this.setState({ chartVisible: isOpen });
  },
  validateChartAxis: function validateChartAxis() {
    var renderCoords = this.props.imageBuilder.getRenderMethod(),
        chartAxis = 'XYZ'[this.liveChartAxis];

    if (renderCoords.indexOf(chartAxis) === -1) {
      var chartData = this.props.imageBuilder.getProbeLine(chartAxis);

      chartAxis = 'XYZ'.indexOf(renderCoords[0]);

      this.liveChartAxis = chartAxis;
      this.setState({ chartAxis: chartAxis, chartData: chartData });
    }
  },
  updateChart: function updateChart(event) {
    var idx = Number(event.target.getAttribute('data-index')),
        imageBuilder = this.props.imageBuilder,
        chartData = imageBuilder.getProbeLine(idx);

    this.liveChartAxis = idx;
    this.setState({ chartData: chartData, chartAxis: idx });
  },
  dragOn: function dragOn(event) {
    var el = this.chartContainer,
        top = Number(el.style.top.replace('px', '')),
        left = Number(el.style.left.replace('px', ''));

    this.dragChartFlag = true;
    this.dragPosition = [event.clientX - left, event.clientY - top];
  },
  dragOff: function dragOff() {
    this.dragChartFlag = false;
  },
  dragChart: function dragChart(event) {
    if (this.dragChartFlag) {
      var el = this.chartContainer;
      el.style.left = event.clientX - this.dragPosition[0] + 'px';
      el.style.top = event.clientY - this.dragPosition[1] + 'px';
    }
  },
  render: function render() {
    var _this2 = this;

    var queryDataModel = this.props.queryDataModel,
        imageBuilder = this.props.imageBuilder,
        dimensions = imageBuilder.metadata.dimensions,
        axisMap = renderAxisMap[this.props.imageBuilder.getRenderMethod()];

    var buttonClasses = [];
    [0, 1, 2].forEach(function (el) {
      var classes = [];
      if (axisMap[2] === el) {
        classes.push(_Probe3DViewer2.default.hidden);
      } else if (_this2.state.chartAxis === el) {
        classes.push(_Probe3DViewer2.default.selectedButton);
      } else {
        classes.push(_Probe3DViewer2.default.button);
      }
      buttonClasses.push(classes.join(' '));
    });

    return _react2.default.createElement(
      'div',
      { className: _Probe3DViewer2.default.container },
      _react2.default.createElement(
        _AbstractViewerMenu2.default,
        { queryDataModel: queryDataModel, imageBuilder: imageBuilder, mouseListener: imageBuilder.getListeners() },
        _react2.default.createElement(_LookupTableManagerControl2.default, {
          key: 'LookupTableManagerWidget',
          lookupTableManager: imageBuilder.lookupTableManager,
          field: imageBuilder.getField()
        }),
        _react2.default.createElement(_ProbeControl2.default, {
          imageBuilder: imageBuilder
        }),
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          {
            title: 'Chart',
            visible: this.props.probe && imageBuilder.isCrossHairEnabled(),
            onChange: this.onChartVisibilityChange,
            open: this.state.chartVisible
          },
          _react2.default.createElement(
            'div',
            {
              className: _Probe3DViewer2.default.row
            },
            _react2.default.createElement(
              'button',
              {
                className: buttonClasses[0],
                type: 'button',
                'data-index': '0',
                onClick: this.updateChart
              },
              'X'
            ),
            _react2.default.createElement(
              'button',
              {
                className: buttonClasses[1],
                type: 'button',
                'data-index': '1',
                onClick: this.updateChart
              },
              'Y'
            ),
            _react2.default.createElement(
              'button',
              {
                className: buttonClasses[2],
                type: 'button',
                'data-index': '2',
                onClick: this.updateChart
              },
              'Z'
            )
          )
        ),
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          {
            title: 'Parameters',
            visible: queryDataModel.originalData.arguments_order.length > 0
          },
          _react2.default.createElement(_QueryDataModelWidget2.default, { model: queryDataModel })
        )
      ),
      _react2.default.createElement(
        'div',
        {
          ref: function ref(c) {
            _this2.chartContainer = c;
          },
          className: this.state.chartVisible && imageBuilder.isCrossHairEnabled() ? _Probe3DViewer2.default.chartContainer : _Probe3DViewer2.default.hidden,
          onMouseMove: this.dragChart,
          onMouseUp: this.dragOff,
          onMouseDown: this.dragOn
        },
        _react2.default.createElement(_LineChartViewer2.default, {
          ref: function ref(c) {
            _this2.chartViewer = c;
          },
          cursor: this.state.probe[this.state.chartAxis] / dimensions[this.state.chartAxis],
          data: this.state.chartData,
          width: this.state.chartSize.width,
          height: this.state.chartSize.height
        })
      )
    );
  }
});