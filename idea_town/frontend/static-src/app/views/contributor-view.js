import BaseView from './base-view';

export default BaseView.extend({
  template: `<li>
               <img class="avatar" data-hook="avatar" width="56" height="56">
               <div class="contributor">
                 <p data-hook="name" class="name"></p>
                 <p data-hook="title" class="title"></p>
               </div>
             </li>`,

  bindings: {
    'model.avatar': {
      type: 'attribute',
      name: 'src',
      hook: 'avatar'
    },

    'model.display_name': {
      hook: 'name'
    },

    'model.title': {
      hook: 'title'
    }
  }
});
