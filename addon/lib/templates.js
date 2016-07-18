/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

module.exports.experimentList = `
<div class="experiment-list">
  {{#experiments}}
    <a class="experiment-item {{#active}}active{{/active}}" href="{{base_url}}/experiments/{{slug}}?{{params}}">
      <div class="icon-wrapper"
           style="background-color:{{gradient_start}}; background-image: linear-gradient(300deg, {{gradient_start}}, {{gradient_stop}})">
        <div class="icon" style="background-image:url('{{thumbnail}}');"></div>
      </div>
      <div class="experiment-title">{{title}}
        <span class="active-span {{#active}}visible{{/active}}">Enabled</span>
      </div>
    </a>
  {{/experiments}}
</div>
<a class="view-all" href="{{base_url}}/experiments?{{view_all_params}}">View all experiments</a>`;

module.exports.installed = `
<div class="installed-message">
  <p><strong>FYI:</strong> We put an button in your toolbar <br> so you can always find Test Pilot.</p>
</div>`;
