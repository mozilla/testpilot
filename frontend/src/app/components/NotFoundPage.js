import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="full-page-wrapper centered" data-hook="no-found-page">
      <div className="centered-banner">
        <div id="four-oh-four" className="modal delayed-fade-in">
          <h1 data-l10n-id="notFoundHeader" className="title">Four Oh Four!</h1>
          <br/>
          <div className="modal-actions">
            <a data-l10n-id="home" className="button default large" href="/">Home</a>
          </div>
        </div>
        <div className="copter-wrapper">
          <div className="copter fade-in-fly-up"></div>
        </div>
      </div>
    </div>
  );
}
