import PageView from './page-view';

export default PageView.extend({
  template: `
<div class="blue">
  <div class="noise"></div>
  <div class="stars"></div>
  <div class="full-page-wrapper centered" data-hook="no-found-page">
    <div class="centered-banner">
      <div id="four-oh-four" class="modal delayed-fade-in">
        <h1 data-l10n-id="notFoundHeader" class="title">Four Oh Four!</h1>
        <br/>
        <div class="modal-actions">
          <a data-l10n-id="home" class="button default large" href="/">Home</a>
        </div>
      </div>
      <div class="copter-wrapper">
        <div class="copter fade-in-fly-up"></div>
      </div>
    </div>
  </div>
</div>
  `,

  // override page afterRender()
  afterRender() {}
});
