/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

module.exports.experimentList = `
<ul>
  {{#experiments}}
  <li class="experiment-item">
    <a href="{{base_url}}/experiments/{{slug}}">
      <div class="col {{#active}}active{{/active}}">
        <div class="icon-wrapper"
             style="background: linear-gradient(300deg, {{gradient_start}}, {{gradient_stop}})">
          <img class="thumbnail" src="{{thumbnail}}"/>
        </div>
      </div>
      <div class="col">
        <h2 class="title">{{title}}</h2>
        {{#active}}<p class="active-indicator">active</p>{{/active}}
        {{^active}}<p class="description">{{description}}</p>{{/active}}
      </div>
      <button data-addon-id="{{addon_id}}" class="survey">Survey</button>
      <div class="clear"></div>
    </a>
  </li>
  {{/experiments}}
</ul>
<footer><a href="{{base_url}}">Show All Ideas</a></footer>`;

module.exports.feedback = `
<div class="contain">
  <ul>
    <li>
      <div>
        <div class="col {{#experiment.active}}active{{/experiment.active}}">
          <div class="icon-wrapper"
               style="background: linear-gradient(300deg, {{experiment.gradient_start}}, {{experiment.gradient_stop}})">
            <img class="thumbnail" src="{{thumbnail}}"/>
          </div>
        </div>
        <div class="col">
          <h2 class="title">{{experiment.title}}</h2>
          <p>Survey</p>
        </div>
        <div class="clear"></div>
      </div>
    </li>
  </ul>

  <div class="back"><img src="back.png"/></div>

  <div class="feedback-wrap">
    <p>How would you recommend {{experiment.title}} to a friend?</p>

    <form data-addon-id="{{experiment.addon_id}}" action="">
      <input type="radio" id="r-0" name="nps" value="0" /><label for="r-0"></label>
      <input type="radio" id="r-1" name="nps" value="1" /><label for="r-1"></label>
      <input type="radio" id="r-2" name="nps" value="2" /><label for="r-2"></label>
      <input type="radio" id="r-3" name="nps" value="3" /><label for="r-3"></label>
      <input type="radio" id="r-4" name="nps" value="4" /><label for="r-4"></label>
      <input type="radio" id="r-5" name="nps" value="5" /><label for="r-5"></label>
      <input type="radio" id="r-6" name="nps" value="6" /><label for="r-6"></label>
      <input type="radio" id="r-7" name="nps" value="7" /><label for="r-7"></label>
      <input type="radio" id="r-8" name="nps" value="8" /><label for="r-8"></label>
      <input type="radio" id="r-9" name="nps" value="9" /><label for="r-9"></label>
      <input type="radio" id="r-10" name="nps" value="10" /><label for="r-10"></label>

      <button type="submit" class="feedback-button">Submit Feedback</button>
    </form>
  </div>
  <div class="clear"></div>
</div>`;

module.exports.installed = `
<div id="browser-doorhanger">
  <div class="copter-wrapper">
    <div class="copter fly-down"></div>
  </div>
  <p>Test Pilot lets you test out experimental features in Firefox. Ready for takeoff?</p>
  <a href="{{base_url}}/home" class="button default quick-pop">Let's go</a>
</div>`;

module.exports.base = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="panel.css" type="text/css" media="screen" />
  </head>
  <body>
    <div id="content">{{content}}</div>
  </body>
</html>`
;
