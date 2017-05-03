import React from 'react';
import { assert, expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';

import { defaultState } from '../../../src/app/reducers/newsletter-form';
import View from '../../../src/app/components/View';


const FooComponent = React.createClass({
  render: function(){
    return <p>{this.props.foo}</p>;
  }
});

const mockRequiredProps = {
  uninstallAddon: sinon.spy(),
  sendToGA: sinon.spy(),
  openWindow: sinon.spy(),
  getWindowLocation: sinon.spy(() => 'https://example.com'),
  newsletterForm: defaultState()
};


describe('app/components/View', () => {

  it('should pass its props to child components', () => {
    const wrapper = mount(
      <View foo="bar" {...mockRequiredProps}>
        <FooComponent />
      </View>
    );
    expect(wrapper.find('p').first().props('foo').children).to.equal('bar');
  });

  it('should not pass its props to child DOM elements', () => {
    const wrapper = mount(
      <View foo="bar" {...mockRequiredProps}>
        <p></p>
      </View>
    );
    expect(wrapper.find('p').first().props()).to.not.have.key('foo');
  });

  it('should gracefully skip falsy elements', () => {
    assert.doesNotThrow(() => {
      mount(
        <View {...mockRequiredProps}>
          {false && <FooComponent />}
          <FooComponent />
        </View>
      )
    }, Error);
  });

  it('should only use the child\'s children', () => {
    const wrapper = mount(
      <View foo="baz" {...mockRequiredProps}>
        <FooComponent foo="bar">
          <p>Hello, frend.</p>
        </FooComponent>
      </View>
    );
    const inner = wrapper.find(FooComponent).first();
    expect(inner.props().children.type).to.equal('p');
  });

  it('should rerender its children', () => {
    const wrapper = mount(<View {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('FooComponent')).to.have.length(1);
  });

  it('should render the footer by default', () => {
    const wrapper = shallow(<View {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('Footer')).to.have.length(1);
  });

  it('should not render the footer when requested', () => {
    const wrapper = shallow(<View showFooter={false} {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('Footer')).to.have.length(0);
  });

  it('should render the header by default', () => {
    const wrapper = shallow(<View {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('Header')).to.have.length(1);
  });

  it('should not render the header when requested', () => {
    const wrapper = shallow(<View showHeader={false} {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('Header')).to.have.length(0);
  });

  it('should render the newsletter footer by default', () => {
    const wrapper = shallow(<View {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('NewsletterFooter')).to.have.length(1);
  });

  it('should not render the newsletter footer when requested', () => {
    const wrapper = shallow(<View showNewsletterFooter={false} {...mockRequiredProps}><FooComponent /></View>);
    expect(wrapper.find('NewsletterFooter')).to.have.length(0);
  });
});
