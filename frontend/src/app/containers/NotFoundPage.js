import React from 'react';

import Copter from '../components/Copter';
import LayoutWrapper from '../components/LayoutWrapper';
import View from '../components/View';


export default class NotFoundPage extends React.Component {
  render() {
    return (
      <View centered={true} showNewsletterFooter={false} showFooter={false} showHeader={false}
            {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="four-oh-four" className="modal delayed-fade-in">
            <h1 data-l10n-id="notFoundHeader" className="title">Four Oh Four!</h1>
            <br/>
            <div className="modal-actions">
              <a data-l10n-id="home" className="button default large" href="/">Home</a>
            </div>
          </div>
          <Copter animation="fade-in-fly-up"/>
        </LayoutWrapper>
      </View>
    );
  }
}
