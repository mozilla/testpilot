import PageView from './page-view';

export default PageView.extend({
  template: `<div class="page" id="full-page-notice">
               <section class="main-content" data-hook="no-found-page">
                 <div class="vertical-centering-container">
                   <div id="beta-notice-modal" class="delayed-fade-in">
                     <h1 data-l10n-id="notFoundHeader">Four Oh Four!</h1>
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
