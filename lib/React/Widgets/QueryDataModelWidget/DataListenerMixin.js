define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    // Attach listener by default

    getDefaultProps: function getDefaultProps() {
      return {
        listener: true
      };
    },
    attachListener: function attachListener(dataModel) {
      this.dataSubscription = dataModel.onStateChange(this.dataListenerCallback);
    },
    detachListener: function detachListener() {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
        this.dataSubscription = null;
      }
    },


    // Auto mount listener unless notified otherwise
    componentWillMount: function componentWillMount() {
      this.detachListener();
      if (this.props.listener) {
        this.attachListener(this.props.model);
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      this.detachListener();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var previousDataModel = this.props.model,
          nextDataModel = nextProps.model;

      if (previousDataModel !== nextDataModel) {
        this.detachListener();
        this.attachListener(nextDataModel);
      }
    }
  };
});