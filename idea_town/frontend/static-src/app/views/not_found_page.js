import View from 'ampersand-view';
import mustache from 'mustache';

export default View.extend({
  template: mustache.render(`<section class="page" data-hook="not-found-page">
                               <h1>404 wut</h1>
                             </section>`)
});
