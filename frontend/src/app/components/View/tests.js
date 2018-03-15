/* global describe, it */
import React from "react";
import { MemoryRouter } from "react-router";
import { assert, expect } from "chai";
import { shallow, mount } from "enzyme";

import View from "./index";

class FooComponent extends React.Component {
  render() {
    return <p>{this.props.foo}</p>;
  }
}

const baseProps = {
  newsletterForm: {
    succeeded: false,
    failed: false
  }
};

describe("app/components/View", () => {
  it("should pass its props to child components", () => {
    const wrapper = mount(
      <MemoryRouter>
        <View {...baseProps} foo="bar">
          <FooComponent />
        </View>
      </MemoryRouter>
    );
    expect(wrapper.find("p").first().props("foo").children).to.equal("bar");
  });

  it("should not pass its props to child DOM elements", () => {
    const wrapper = shallow(
      <View {...baseProps} foo="bar">
        <p></p>
      </View>
    );
    expect(wrapper.find("p").first().props()).to.not.have.key("foo");
  });

  it("should gracefully skip falsy elements", () => {
    assert.doesNotThrow(() => {
      shallow(
        <View {...baseProps} >
          {false && <FooComponent />}
          <FooComponent />
        </View>
      );
    }, Error);
  });

  it("should only use the child's children", () => {
    const wrapper = shallow(
      <View {...baseProps} foo="baz">
        <FooComponent foo="bar">
          <p>Hello, friend.</p>
        </FooComponent>
      </View>
    );
    const inner = wrapper.find(FooComponent).first();
    expect(inner.props().children.type).to.equal("p");
  });

  it("should rerender its children", () => {
    const wrapper = mount(<MemoryRouter><View {...baseProps}><FooComponent /></View></MemoryRouter>);
    expect(wrapper.find(FooComponent)).to.have.length(1);
  });

  it("should render the footer by default", () => {
    const wrapper = shallow(<View {...baseProps}><FooComponent /></View>);
    expect(wrapper.find("Footer")).to.have.length(1);
  });

  it("should not render the footer when requested", () => {
    const wrapper = shallow(<View {...baseProps} showFooter={false}><FooComponent /></View>);
    expect(wrapper.find("Footer")).to.have.length(0);
  });

  it("should render the header by default", () => {
    const wrapper = shallow(<View {...baseProps}><FooComponent /></View>);
    expect(wrapper.find("Header")).to.have.length(1);
  });

  it("should not render the header when requested", () => {
    const wrapper = shallow(<View {...baseProps} showHeader={false}><FooComponent /></View>);
    expect(wrapper.find("Header")).to.have.length(0);
  });

  it("should render the newsletter footer by default", () => {
    const wrapper = shallow(<View {...baseProps}><FooComponent /></View>);
    expect(wrapper.find("NewsletterFooter")).to.have.length(1);
  });

  it("should not render the newsletter footer when requested", () => {
    const wrapper = shallow(<View {...baseProps} showNewsletterFooter={false}><FooComponent /></View>);
    expect(wrapper.find("NewsletterFooter")).to.have.length(0);
  });
});
