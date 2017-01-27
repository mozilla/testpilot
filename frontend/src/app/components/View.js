import classNames from 'classnames';
import React, { PropTypes } from 'react';
import ReactDOMFactories from 'react/lib/ReactDOMFactories';
import Symbol from 'es-symbol';

import NewsletterFooter from '../components/NewsletterFooter';
import Header from '../components/Header';
import Footer from '../components/Footer';


const DOMFactories = Object.keys(ReactDOMFactories);


/**
 * Wraps common view elements (header, footer) in a wrapping component. Passes
 * all props down to all children.
 */
export default class View extends React.Component {

  isReactComponent(element) {
    /**
     * Returns a boolean indicating whether or not the passed argument is a
     * React component. This is more complicated than you might expect, because
     * actual components aren't used in tests, instead replaced with component-
     * like proxy objects.
     *
     * The second condition will only pass in tests, and only then because the
     * proxy object looks like this:
     *
     * { '$$typeof': Symbol(react.element), type: 'ComponentName' }
     *
     * or like this, if it is a DOM element:
     *
     * { '$$typeof': Symbol(react.element), type: 'div' }
     */
    return (
      React.Component.isPrototypeOf.call(React.Component, element) || (
        element.$$typeof === Symbol.for('react.element') &&
        DOMFactories.indexOf(element.type) === -1
      )
    );
  }

  renderChildren() {
    /**
     * Returns an array of this components truthy children, passing down this
     * component's props to each of them.
     */
    return React.Children.map(this.props.children, child => {
      if (!child) {
        return null;
      }

      // If the child is a component, merge its props with the View component's
      // props (except for `children`, which is special and should be fully
      // taken from the child).
      if (this.isReactComponent(child)) {
        const combinedProps = Object.assign({}, this.props, child.props);
        combinedProps.children = child.props.children;
        return React.cloneElement(child, combinedProps);
      }

      return child;
    });
  }

  renderNewsletterFooter() {
    if (this.props.showNewsletterFooter) {
      return <NewsletterFooter {...this.props} />;
    }
    return null;
  }

  renderFooter() {
    if (this.props.showFooter) {
      return <Footer {...this.props} />;
    }
    return null;
  }

  renderHeader() {
    if (this.props.showHeader) {
      return <Header {...this.props} />;
    }
    return null;
  }

  makeClassNames() {
    return classNames('view', 'full-page-wrapper', {
      centered: this.props.centered,
      'space-between': this.props.spaceBetween
    });
  }

  render() {
    return (
      <section className={this.makeClassNames()}>
        {this.renderHeader()}
        {this.renderChildren()}
        {this.renderNewsletterFooter()}
        {this.renderFooter()}
      </section>
    );
  }

}

View.propTypes = {

  /**
   * If true, adds the `centered` class to the wrapper. Default: `false`.
   */
  centered: PropTypes.bool.isRequired,

  /*
  * Locale passed in for use in email footer component.
  */
  locale: PropTypes.string.isRequired,

  /**
   * If true, renders a newsletter subscription form above the footer
   * component. Default: `true`.
   */
  showNewsletterFooter: PropTypes.bool.isRequired,

  /**
   * If true, renders the `<Footer>` component. Default: `true`.
   */
  showFooter: PropTypes.bool.isRequired,

  /**
   * If true, renders the `<Header>` component. Default: `true`.
   */
  showHeader: PropTypes.bool.isRequired,

  /**
   * If true, adds the `space-between` class to the wrapper. Default: `false`.
   */
  spaceBetween: PropTypes.bool.isRequired

};


View.defaultProps = {
  centered: false,
  showNewsletterFooter: true,
  showFooter: true,
  showHeader: true,
  spaceBetween: false
};
