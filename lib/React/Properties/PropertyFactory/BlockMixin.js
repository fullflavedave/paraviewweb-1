'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// This DRYs up the code for Cell, Enum, Slider and Bool quite a bit.
/* eslint-disable babel/object-shorthand */
exports.default = {
  getDefaultProps: function getDefaultProps() {
    return {
      name: '',
      help: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      data: this.props.data,
      helpOpen: false,
      ui: this.props.ui
    };
  },
  componentWillMount: function componentWillMount() {
    var newState = {};
    if (this.props.ui.default && !this.props.data.value) {
      newState.data = this.state.data;
      newState.data.value = this.props.ui.default;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var data = nextProps.data;

    if (this.state.data !== data) {
      this.setState({
        data: data
      });
    }
  },
  helpToggled: function helpToggled(open) {
    this.setState({
      helpOpen: open
    });
  }
};
/* eslint-enable babel/object-shorthand */