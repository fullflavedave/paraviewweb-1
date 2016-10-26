define(['exports', 'react', '../../Widgets/NumberSliderWidget', '../../Widgets/CollapsibleWidget'], function (exports, _react, _NumberSliderWidget, _CollapsibleWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _NumberSliderWidget2 = _interopRequireDefault(_NumberSliderWidget);

  var _CollapsibleWidget2 = _interopRequireDefault(_CollapsibleWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'ProbeControl',

    propTypes: {
      imageBuilder: _react2.default.PropTypes.object.isRequired,
      imageBuilders: _react2.default.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
      return {
        imageBuilders: {}
      };
    },
    getInitialState: function getInitialState() {
      var imageBuilder = this.getImageBuilder(this.props);
      return {
        probe: [imageBuilder.getProbe()[0], imageBuilder.getProbe()[1], imageBuilder.getProbe()[2]],
        showFieldValue: true
      };
    },
    componentWillMount: function componentWillMount() {
      this.attachImageBuilderListeners(this.getImageBuilder(this.props));
    },


    /* eslint-disable react/no-did-mount-set-state */
    componentDidMount: function componentDidMount() {
      this.setState({
        showFieldValue: this.probeInput.isExpanded()
      });
    },

    /* eslint-enable react/no-did-mount-set-state */

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var previousImageBuilder = this.getImageBuilder(this.props),
          nextImageBuilder = this.getImageBuilder(nextProps);

      if (previousImageBuilder !== nextImageBuilder) {
        this.attachImageBuilderListeners(nextImageBuilder);
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      this.detachImageBuilderListeners();
    },
    onProbeVisibilityChange: function onProbeVisibilityChange(isProbeOpen) {
      var _this = this;

      this.setState({
        showFieldValue: isProbeOpen
      });

      setImmediate(function () {
        if (_this.props.imageBuilders) {
          Object.keys(_this.props.imageBuilders).forEach(function (key) {
            var builder = _this.props.imageBuilders[key].builder;
            builder.setCrossHairEnable(isProbeOpen);
            builder.render();
          });
        }
        if (_this.props.imageBuilder) {
          _this.props.imageBuilder.setCrossHairEnable(isProbeOpen);
          _this.props.imageBuilder.render();
        }
      });
    },
    getImageBuilder: function getImageBuilder(props) {
      var imageBuilder = props.imageBuilder;

      if (!imageBuilder) {
        var key = Object.keys(props.imageBuilders)[0];
        imageBuilder = props.imageBuilders[key].builder;
      }

      return imageBuilder;
    },
    attachImageBuilderListeners: function attachImageBuilderListeners(imageBuilder) {
      var _this2 = this;

      this.detachImageBuilderListeners();
      this.probeListenerSubscription = imageBuilder.onProbeChange(function (probe, envelope) {
        var field = imageBuilder.getFieldValueAtProbeLocation();
        if (_this2.isMounted()) {
          _this2.setState({
            probe: probe, field: field
          });
        }
      });

      this.probeDataListenerSubscription = imageBuilder.onProbeLineReady(function (data, envelope) {
        var field = imageBuilder.getFieldValueAtProbeLocation();
        if (_this2.isMounted() && field !== _this2.state.field) {
          _this2.setState({
            field: field
          });
        }
      });
    },
    detachImageBuilderListeners: function detachImageBuilderListeners() {
      if (this.probeListenerSubscription) {
        this.probeListenerSubscription.unsubscribe();
        this.probeListenerSubscription = null;
      }
      if (this.probeDataListenerSubscription) {
        this.probeDataListenerSubscription.unsubscribe();
        this.probeDataListenerSubscription = null;
      }
    },
    updateRenderMethod: function updateRenderMethod(event) {
      if (this.props.imageBuilder) {
        this.props.imageBuilder.setRenderMethod(event.target.value);
        this.props.imageBuilder.render();
        this.forceUpdate();
      }
    },
    probeChange: function probeChange(event) {
      var value = Number(event.target.value),
          probe = this.state.probe,
          idx = Number(event.target.name);

      probe[idx] = value;

      this.getImageBuilder(this.props).setProbe(probe[0], probe[1], probe[2]);
    },
    render: function render() {
      var _this3 = this;

      var imageBuilder = this.getImageBuilder(this.props),
          value = this.state.field || imageBuilder.getFieldValueAtProbeLocation(),
          valueStr = '' + value;

      if (value === undefined) {
        valueStr = '';
      } else {
        if (valueStr && valueStr.length > 6) {
          valueStr = value.toFixed(5);
        }
        if (Math.abs(value) < 0.00001) {
          valueStr = '0';
        }
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          { title: 'Render method', visible: imageBuilder.isRenderMethodMutable() },
          _react2.default.createElement(
            'select',
            {
              style: { width: '100%' },
              value: imageBuilder.getRenderMethod(),
              onChange: this.updateRenderMethod
            },
            imageBuilder.getRenderMethods().map(function (v) {
              return _react2.default.createElement(
                'option',
                { key: v, value: v },
                v
              );
            })
          )
        ),
        _react2.default.createElement(
          _CollapsibleWidget2.default,
          {
            title: 'Probe',
            subtitle: this.state.showFieldValue ? valueStr : '',
            ref: function ref(c) {
              _this3.probeInput = c;
            },
            onChange: this.onProbeVisibilityChange,
            open: imageBuilder.isCrossHairEnabled()
          },
          _react2.default.createElement(_NumberSliderWidget2.default, {
            name: '0',
            min: '0', max: imageBuilder.metadata.dimensions[0] - 1,
            key: 'slider-x',
            value: this.state.probe[0],
            onChange: this.probeChange
          }),
          _react2.default.createElement(_NumberSliderWidget2.default, {
            name: '1',
            min: '0', max: imageBuilder.metadata.dimensions[1] - 1,
            key: 'slider-Y',
            value: this.state.probe[1],
            onChange: this.probeChange
          }),
          _react2.default.createElement(_NumberSliderWidget2.default, {
            name: '2',
            min: '0', max: imageBuilder.metadata.dimensions[2] - 1,
            key: 'slider-Z',
            value: this.state.probe[2],
            onChange: this.probeChange
          })
        )
      );
    }
  });
});