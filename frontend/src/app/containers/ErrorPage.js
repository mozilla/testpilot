// @flow

import React from 'react';

import Copter from '../components/Copter';
import LayoutWrapper from '../components/LayoutWrapper';
import View from '../components/View';

type ErrorPageProps = {
  uninstallAddon: Function,
  sendToGA: Function,
  openWindow: Function
}


export default class ErrorPage extends React.Component {
  props: ErrorPageProps

  render() {
    return (
      <View spaceBetween={true} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="four-oh-four" className="modal centered">
            <header className="modal-header-wrapper neutral-modal">
              <h1 data-l10n-id="errorHeading" className="modal-header">Whoops!</h1>
            </header>
            <div className="modal-content">
              <p data-l10n-id="errorMessage">Looks like we broke something. <br /> Maybe try again later.</p>
            </div>
          </div>
          <Copter animation="fade-in-fly-up" />
        </LayoutWrapper>
      </View>
    );
  }
}
