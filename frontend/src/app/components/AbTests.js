
import React from 'react';

export class AbTestCase extends React.Component {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

AbTestCase.propTypes = {
  value: React.PropTypes.string.isRequired
}

export class AbTestDefault extends React.Component {
  render() {
    return <span>{ this.props.children }</span>;
  }
}

export class AbTests extends React.Component {
  render() {
    const testVariant = this.props.abtests[this.props.name];
    if (testVariant === undefined) {
      return <div>
        Error: Test { JSON.stringify(this.props.name) } not found in tests.
        Provided tests: { JSON.stringify(Object.keys(this.props.abtests)) }
      </div>;
    }
    if (this.props.children === undefined) {
      return <div>
        Error: AbTests.props.children is undefined
      </div>;
    }
    let defaultElement = <span>
      Error: No matching variant and no AbTestDefault provided
    </span>;
    for (const child of this.props.children) {
      if (child.type === AbTestDefault) {
        defaultElement = child;
      }
      if (child.props.value === testVariant) {
        return child;
      }
    }
    return defaultElement;
  }
}

AbTests.propTypes = {
  name: React.PropTypes.string.isRequired,
  abtests: React.PropTypes.object.isRequired
}
