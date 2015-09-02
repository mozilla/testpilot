import View from 'ampersand-view';
import mustache from 'mustache';

export default View.extend({
  template: mustache.render(`<section class="page" data-hook="settings-page">
                               <h1>Settings</h1>
                             </section>`)
});
