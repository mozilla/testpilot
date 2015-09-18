import BaseView from './base-view';

export default BaseView.extend({
  _template: `<section class="page" data-hook="not-found-page">
                <h1>Whoops!</h1>
                <p>Looks like we broke something. Maybe try again later :-\ </p>
              </section>`
});
