import React, { Component } from 'react';
import { connect } from 'react-redux';


class App extends Component {
  render() {
    const { addon } = this.props;
    if (addon.restartRequired) {
      return <p>Restart Required</p>;
    }
    return this.props.children;
  }
}


export default connect(
  state => ({
    addon: state.addon
  })
)(App);
