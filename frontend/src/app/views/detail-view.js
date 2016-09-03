import BaseView from './base-view';

export default BaseView.extend({
  template: `<div>
               <div data-hook="details" class="details-image">
                 <img data-hook="detail-image" width="680">
                 <p class="caption"><strong data-hook="detail-headline"></strong> <span data-hook="detail-copy"></span></p>
               </div>
             </div>`,

  bindings: {
    'model.image': {
      type: 'attribute',
      name: 'src',
      hook: 'detail-image'
    },

    'model.copy': {
      type: 'text',
      hook: 'detail-copy'
    },

    'model.headline': {
      hook: 'detail-headline'
    }
  }
});
