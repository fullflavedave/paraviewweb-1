define(['exports', 'react', 'PVWStyle/ReactViewers/AbstractViewerMenu.mcss', '../../Renderers/GeometryRenderer', '../../Renderers/ImageRenderer', '../../Renderers/MultiLayoutRenderer', '../../Renderers/PlotlyRenderer'], function (exports, _react, _AbstractViewerMenu, _GeometryRenderer, _ImageRenderer, _MultiLayoutRenderer, _PlotlyRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

  var _GeometryRenderer2 = _interopRequireDefault(_GeometryRenderer);

  var _ImageRenderer2 = _interopRequireDefault(_ImageRenderer);

  var _MultiLayoutRenderer2 = _interopRequireDefault(_MultiLayoutRenderer);

  var _PlotlyRenderer2 = _interopRequireDefault(_PlotlyRenderer);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'AbstractViewerMenu',

    propTypes: {
      children: _react2.default.PropTypes.array,
      config: _react2.default.PropTypes.object,
      geometryBuilder: _react2.default.PropTypes.object,
      imageBuilder: _react2.default.PropTypes.object,
      chartBuilder: _react2.default.PropTypes.object,
      layout: _react2.default.PropTypes.string,
      magicLensController: _react2.default.PropTypes.object,
      mouseListener: _react2.default.PropTypes.object,
      queryDataModel: _react2.default.PropTypes.object,
      renderer: _react2.default.PropTypes.string,
      renderers: _react2.default.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
      return {
        config: {},
        renderer: 'ImageRenderer'
      };
    },
    getInitialState: function getInitialState() {
      return {
        collapsed: true,
        speedIdx: 0,
        speeds: [20, 50, 100, 200, 500],
        record: false
      };
    },


    // Auto mount listener unless notified otherwise
    componentWillMount: function componentWillMount() {
      this.attachListener(this.props.queryDataModel);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var previousDataModel = this.props.queryDataModel,
          nextDataModel = nextProps.queryDataModel;

      if (previousDataModel !== nextDataModel) {
        this.detachListener();
        this.attachListener(nextDataModel);
      }
    },


    // Auto unmount listener
    componentWillUnmount: function componentWillUnmount() {
      this.detachListener();
    },
    getRenderer: function getRenderer() {
      return this.renderer;
    },
    attachListener: function attachListener(dataModel) {
      var _this = this;

      this.detachListener();
      this.queryDataModelChangeSubscription = dataModel.onStateChange(function (data, envelope) {
        _this.forceUpdate();
      });
    },
    detachListener: function detachListener() {
      if (this.queryDataModelChangeSubscription) {
        this.queryDataModelChangeSubscription.unsubscribe();
        this.queryDataModelChangeSubscription = null;
      }
    },
    toggleRecord: function toggleRecord() {
      var record = !this.state.record;
      this.setState({ record: record });
      this.getRenderer().recordImages(record);
    },
    togglePanel: function togglePanel() {
      this.setState({ collapsed: !this.state.collapsed });
      this.props.queryDataModel.fetchData();
    },
    toggleLens: function toggleLens() {
      var magicLensController = this.props.magicLensController;
      if (magicLensController) {
        magicLensController.toggleLens();
        this.forceUpdate();
      }
    },
    resetCamera: function resetCamera() {
      if (this.isMounted() && (this.props.renderer === 'ImageRenderer' || this.props.renderer === 'GeometryRenderer')) {
        this.renderer.resetCamera();
      }
    },
    play: function play() {
      this.props.queryDataModel.animate(true, this.state.speeds[this.state.speedIdx]);
    },
    stop: function stop() {
      this.props.queryDataModel.animate(false);
    },
    updateSpeed: function updateSpeed() {
      var newIdx = (this.state.speedIdx + 1) % this.state.speeds.length,
          queryDataModel = this.props.queryDataModel;

      this.setState({ speedIdx: newIdx });
      if (queryDataModel.isAnimating()) {
        queryDataModel.animate(true, this.state.speeds[newIdx]);
      }
    },


    /* eslint-disable complexity */
    render: function render() {
      var _this2 = this;

      var queryDataModel = this.props.queryDataModel,
          magicLensController = this.props.magicLensController,
          rootImageBuilder = magicLensController || this.props.imageBuilder,
          renderer = null,
          serverRecording = !!this.props.config.Recording,
          isImageRenderer = this.props.renderer === 'ImageRenderer',
          isMultiViewer = this.props.renderer === 'MultiViewRenderer',
          isChartViewer = this.props.renderer === 'PlotlyRenderer',
          isGeometryViewer = this.props.renderer === 'GeometryRenderer';

      if (isImageRenderer) {
        renderer = _react2.default.createElement(_ImageRenderer2.default, {
          ref: function ref(c) {
            _this2.renderer = c;
          },
          className: _AbstractViewerMenu2.default.renderer,
          imageBuilder: rootImageBuilder,
          listener: this.props.mouseListener || rootImageBuilder.getListeners()
        });
      }

      if (isMultiViewer) {
        renderer = _react2.default.createElement(_MultiLayoutRenderer2.default, {
          ref: function ref(c) {
            _this2.renderer = c;
          },
          className: _AbstractViewerMenu2.default.renderer,
          renderers: this.props.renderers,
          layout: this.props.layout
        });
      }

      if (isGeometryViewer) {
        renderer = _react2.default.createElement(_GeometryRenderer2.default, {
          ref: function ref(c) {
            _this2.renderer = c;
          },
          className: _AbstractViewerMenu2.default.renderer,
          geometryBuilder: this.props.geometryBuilder
        });
      }

      if (isChartViewer) {
        renderer = _react2.default.createElement(_PlotlyRenderer2.default, {
          ref: function ref(c) {
            _this2.renderer = c;
          },
          className: _AbstractViewerMenu2.default.renderer,
          chartBuilder: this.props.chartBuilder
        });
      }

      return _react2.default.createElement(
        'div',
        { className: _AbstractViewerMenu2.default.container },
        _react2.default.createElement(
          'div',
          {
            className: this.state.collapsed ? _AbstractViewerMenu2.default.collapsedControl : _AbstractViewerMenu2.default.control
          },
          _react2.default.createElement(
            'div',
            { className: _AbstractViewerMenu2.default.controlBar },
            _react2.default.createElement('i', {
              className: magicLensController ? magicLensController.isFront() ? _AbstractViewerMenu2.default.magicLensButtonIn : _AbstractViewerMenu2.default.magicLensButtonOut : _AbstractViewerMenu2.default.hidden,
              onClick: this.toggleLens
            }),
            _react2.default.createElement('i', {
              className: serverRecording && isImageRenderer && this.props.imageBuilder.handleRecord ? this.state.record ? _AbstractViewerMenu2.default.recordButtonOn : _AbstractViewerMenu2.default.recordButtonOff : _AbstractViewerMenu2.default.hidden,
              onClick: this.toggleRecord
            }),
            _react2.default.createElement('i', {
              className: isImageRenderer || isGeometryViewer ? _AbstractViewerMenu2.default.resetCameraButton : _AbstractViewerMenu2.default.hidden,
              onClick: this.resetCamera
            }),
            _react2.default.createElement('i', {
              className: queryDataModel.hasAnimationFlag() && !queryDataModel.isAnimating() ? _AbstractViewerMenu2.default.playButton : _AbstractViewerMenu2.default.hidden,
              onClick: this.play
            }),
            _react2.default.createElement('i', {
              className: queryDataModel.isAnimating() ? _AbstractViewerMenu2.default.stopButton : _AbstractViewerMenu2.default.hidden,
              onClick: this.stop
            }),
            _react2.default.createElement('i', {
              className: queryDataModel.hasAnimationFlag() ? _AbstractViewerMenu2.default.speedButton : _AbstractViewerMenu2.default.hidden,
              onClick: this.updateSpeed
            }),
            _react2.default.createElement(
              'i',
              {
                className: queryDataModel.hasAnimationFlag() ? _AbstractViewerMenu2.default.animationSpeed : _AbstractViewerMenu2.default.hidden,
                onClick: this.updateSpeed
              },
              this.state.speeds[this.state.speedIdx] + 'ms'
            ),
            _react2.default.createElement('i', {
              className: this.state.collapsed ? _AbstractViewerMenu2.default.collapsedMenuButton : _AbstractViewerMenu2.default.menuButton,
              onClick: this.togglePanel
            })
          ),
          _react2.default.createElement(
            'div',
            { className: _AbstractViewerMenu2.default.controlContent },
            this.props.children
          )
        ),
        renderer
      );
    }
  });
});