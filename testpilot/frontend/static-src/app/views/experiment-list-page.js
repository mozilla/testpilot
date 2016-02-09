import app from 'ampersand-app';
import ExperimentRowView from './experiment-row-view';

import PageView from './page-view';

export default PageView.extend({
  pageTitle: 'Test Pilot - Experiments',
  pageTitleL10nID: 'pageTitleExperimentListPage',
  template: `<div class="page" >
               <section data-hook="experiment-list-page">
                 <header data-hook="main-header"></header>
                 <ul id="idea-card-list" class="experiments"></ul>
               </section>
               <div data-hook="main-footer" class="vertical-flex-container"></div>
             </div>`,

  render() {
    // TODO: this is not awesome
    document.body.id = document.body._id;
    document.body.id = 'list-view';

    PageView.prototype.render.apply(this, arguments);

    // render the experiment list into the page
    this.experimentList = this.renderCollection(
      app.experiments,
      ExperimentRowView,
      this.query('.experiments')
    );
  },

  remove() {
    document.body.id = document.body._id;

    PageView.prototype.remove.apply(this, arguments);
  }

});
