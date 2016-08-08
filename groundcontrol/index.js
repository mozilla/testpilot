/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

 const aboutConfig = require("sdk/preferences/service");
 const { PrefsTarget } = require('sdk/preferences/event-target');
 const { ToggleButton } = require('sdk/ui/button/toggle');
 const { Panel } = require('sdk/panel');

 const env = aboutConfig.get('testpilot.env', 'production');
 if (!aboutConfig.has('testpilot.env')) {
   aboutConfig.set('testpilot.env', env);
 }

 const prefs = PrefsTarget(); // eslint-disable-line new-cap
 prefs.on('testpilot.env', () => {
   changeButton(prefs.prefs['testpilot.env']);
 });

 function changeButton(newEnv) {
   button.icon = `./${newEnv}.png`;
   button.label = newEnv;
 }

 const panel = Panel({
   contentURL: './base.html',
   contentScriptFile: './panel.js',
   onHide: () => {
     button.state('window', { checked: false });
   }
 });

 panel.port.on('env', newEnv => {
   aboutConfig.set('testpilot.env', newEnv);
   panel.hide();
 });

 const button = ToggleButton({
   id: 'groundcontrol',
   label: env,
   icon: `./${env}.png`,
   onChange: buttonChanged
 });

 function buttonChanged(state) {
   if (state.checked) {
     panel.show({
       position: button,
       width: 36,
       height: 152
     });
   }
 }
