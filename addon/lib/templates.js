/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

module.exports.experimentList = `
<div class="experiment-list">
  {{#experiments}}
    <a class="experiment-item {{#active}}active{{/active}}" href="{{base_url}}/experiments/{{slug}}">
      <div class="icon-wrapper"
           style="background-color:{{gradient_start}}; background-image: linear-gradient(300deg, {{gradient_start}}, {{gradient_stop}})">
        <div class="icon" style="background-image:url('{{thumbnail}}');"></div>
      </div>
      <div class="experiment-title">{{title}}
        <span class="active-span {{#active}}visible{{/active}}">Now Active</span>
      </div>
    </a>
  {{/experiments}}
</div>
<a class="view-all" href="{{base_url}}">View all experiments</a>`;

module.exports.installed = `
<div class="installed-message">
  <div class="copter-wrapper">
    <div class="copter fly-down"></div>
  </div>
  <p>You’re always just a click away from the latest experiments.</p>
</div>`;
