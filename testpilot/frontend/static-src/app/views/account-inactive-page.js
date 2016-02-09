import PageView from './page-view';

export default PageView.extend({
  template: `<div class="page" id="full-page-notice">
               <section class="main-content" data-hook="account-inactive-page">
                 <div class="vertical-centering-container">
                   <div id="beta-notice-modal" class="delayed-fade-in">
                     <h1 data-l10n-id="signUpThanks">Thanks for signing up!</h1>
                     <h2 data-l10n-id="signUpEmailWhenReady">We'll email you when Test Pilot is ready.</h2>
                     <div class="modal-controls">
                       <a data-l10n-id="home" class="button primary" href="/">Home</a>
                     </div>
                   </div>
                   <div class="copter fly-up-fade-in"></div>
                 </div>
               </section>
             </div>`,

  // override page afterRender()
  afterRender() {}
});
