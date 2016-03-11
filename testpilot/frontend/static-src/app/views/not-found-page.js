import PageView from './page-view';

export default PageView.extend({
  template: `
<div class="blue">
  <div id="full-page-wrapper" class="centered" data-hook="no-found-page">
    <div class="centered-banner">
      <div id="four-oh-four" class="delayed-fade-in">
        <h1 data-l10n-id="notFoundHeader">Four Oh Four!</h1>
        <div class="modal-controls">
          <a data-l10n-id="home" class="button default" href="/">Home</a>
        </div>
      </div>
      <div class="copter spin"></div>
    </div>
  </div>
</div>
  `,

  // override page afterRender()
  afterRender() {}
});
