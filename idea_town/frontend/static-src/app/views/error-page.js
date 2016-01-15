import PageView from './page-view';

export default PageView.extend({
  template: `<section class="page" data-hook="error-page">
               <header data-hook="main-header"></header>
               <h1 data-l10n-id="errorHeading">Whoops!</h1>
               <p data-l10n-id="errorMessage">Looks like we broke something. Maybe try again later :-\ </p>
             </section>`
});
