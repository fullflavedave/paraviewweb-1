'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _plotly = require('plotly.js');

var _plotly2 = _interopRequireDefault(_plotly);

var _PlotlyRenderer = require('PVWStyle/ReactRenderers/PlotlyRenderer.mcss');

var _PlotlyRenderer2 = _interopRequireDefault(_PlotlyRenderer);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'PlotlyRenderer',

  propTypes: {
    chartBuilder: _react2.default.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {};
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    // Listen to window resize
    this.sizeSubscription = _SizeHelper2.default.onSizeChange(this.updateDimensions);

    // Make sure we monitor window size if it is not already the case
    _SizeHelper2.default.startListening();

    this.dataSubscription = this.props.chartBuilder.onDataReady(function (data) {
      var container = _this.chartRenderer;
      if (!container) {
        return;
      }
      if (!data.forceNewPlot && container.data && container.data.length > 0 && container.data[0].type === data.traces[0].type) {
        container.data = data.traces;
        _plotly2.default.redraw(container);
      } else {
        var layout = {
          title: data.title,
          showlegend: true,
          legend: { // Somehow positions legend in lower right of div
            x: 100,
            y: 0
          }
        };
        var config = {
          showLink: false,
          scrollZoom: true,
          displayModeBar: false
        };

        _plotly2.default.newPlot(container, data.traces, data.layout || layout, config);
      }

      if (data.hover && data.hover.enable === true) {
        _plotly2.default.Fx.hover(container, data.hover.hoverList);
      }
    });
  },
  componentDidMount: function componentDidMount() {
    this.updateDimensions();
  },
  componentDidUpdate: function componentDidUpdate(nextProps, nextState) {
    this.updateDimensions();
  },
  componentWillUnmount: function componentWillUnmount() {
    // Remove window listener
    if (this.sizeSubscription) {
      this.sizeSubscription.unsubscribe();
      this.sizeSubscription = null;
    }

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;
    }
  },
  updateDimensions: function updateDimensions() {
    var elt = this.chartRenderer;
    if (elt.layout) {
      _plotly2.default.relayout(elt, elt.layout);
    }
  },
  render: function render() {
    var _this2 = this;

    return _react2.default.createElement('div', { className: _PlotlyRenderer2.default.chartContainer, ref: function ref(c) {
        _this2.chartRenderer = c;
      } });
  }
});