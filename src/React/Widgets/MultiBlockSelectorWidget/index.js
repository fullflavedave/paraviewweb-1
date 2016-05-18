import React from 'react';

export default React.createClass({

  displayName: 'MultiBlockSelectorWidget',

  propTypes: {
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    blocks: React.PropTypes.array,
    onChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      className: '',
      blocks: [],
      title: 'Blocks',
    };
  },

  getInitialState() {
    return {
      opened: [],
      selected: [],
    };
  },

  toggleSelection(e) {
  },

  toggleOpen(e) {
  },

  render() {
    return (
      <input
        className={ this.props.className }
        type="number"
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.state.editing ? this.state.valueRep : this.props.value}
        onChange={this.valueChange}
        onBlur={this.endEditing}
      />);
  },
});
