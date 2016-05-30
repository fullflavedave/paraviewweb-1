'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractViewerMenu = require('../AbstractViewerMenu');

var _AbstractViewerMenu2 = _interopRequireDefault(_AbstractViewerMenu);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CollapsibleControlFactory = require('../../CollapsibleControls/CollapsibleControlFactory');

var _CollapsibleControlFactory2 = _interopRequireDefault(_CollapsibleControlFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({

  displayName: 'ImageBuilderViewer',

  propTypes: {
    config: _react2.default.PropTypes.object,
    imageBuilder: _react2.default.PropTypes.object.isRequired,
    menuAddOn: _react2.default.PropTypes.array,
    queryDataModel: _react2.default.PropTypes.object.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      config: {}
    };
  },
  componentWillMount: function componentWillMount() {
    this.attachListener(this.props.imageBuilder);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var previousDataModel = this.props.imageBuilder,
        nextDataModel = nextProps.imageBuilder;

    if (previousDataModel !== nextDataModel) {
      this.detachListener();
      if (this.props.config.MagicLens) {
        this.attachListener(nextDataModel);
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.detachListener();
  },
  attachListener: function attachListener(dataModel) {
    var _this = this;

    this.detachListener();
    if (dataModel && dataModel.onModelChange) {
      this.changeSubscription = dataModel.onModelChange(function (data, envelope) {
        _this.forceUpdate();
      });
    }
  },
  detachListener: function detachListener() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
      this.changeSubscription = null;
    }
  },
  render: function render() {
    var queryDataModel = this.props.queryDataModel,
        magicLensController = this.props.config.MagicLens ? this.props.imageBuilder : null,
        imageBuilder = this.props.config.MagicLens ? this.props.imageBuilder.getActiveImageBuilder() : this.props.imageBuilder,
        controlWidgets = _CollapsibleControlFactory2.default.getWidgets(imageBuilder);

    // Add menuAddOn if any at the top
    if (this.props.menuAddOn) {
      controlWidgets = this.props.menuAddOn.concat(controlWidgets);
    }

    return _react2.default.createElement(
      _AbstractViewerMenu2.default,
      {
        queryDataModel: queryDataModel,
        magicLensController: magicLensController,
        imageBuilder: imageBuilder,
        config: this.props.config || {}
      },
      controlWidgets
    );
  }
});