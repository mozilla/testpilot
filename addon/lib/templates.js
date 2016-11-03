/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */
const _ = require('sdk/l10n').get;

module.exports.experimentList = `
<div class="experiment-list">
  {{#experiments}}
    <a class="experiment-item {{#active}}active{{/active}} {{#isNew}}is-new{{/isNew}}" href="{{link}}?{{params}}">
      <div class="icon-wrapper"
           style="background-color:{{gradient_start}}; background-image: linear-gradient(300deg, {{gradient_start}}, {{gradient_stop}})">
        <div class="icon" style="background-image:url('{{thumbnail}}');"></div>
      </div>
      <div class="experiment-title">{{title}}
        <span class="active-span" style="{{#hideActive}}display:none;{{/hideActive}}">${_('experiment_list_enabled')}</span>
        <span class="is-new-span">${_('experiment_list_new_experiment')}</span>
        <span class="eol-span {{#showEol}}visible{{/showEol}}">{{eolMessage}}</span>
      </div>
    </a>
  {{/experiments}}
</div>
<a class="view-all" href="{{base_url}}/experiments?{{view_all_params}}">${_('experiment_list_view_all')}</a>`;

module.exports.installed = `
<div class="installed-message">
  <p>${_('installed_message')}</p>
</div>`;
