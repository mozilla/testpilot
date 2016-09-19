import React, { Component } from 'react';
import { connect } from 'react-redux';

import Restart from '../containers/Restart';


class App extends Component {
  render() {
    const { restart } = this.props.addon;
    if (restart.isRequired) {
      return <Restart experimentTitle={ restart.forExperiment }/>;
    }
    return this.props.children;
  }
}


export default connect(
  state => ({
    addon: state.addon
  })
)(App);
