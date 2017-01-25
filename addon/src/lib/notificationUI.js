/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import Notifications from 'sdk/notifications';
import querystring from 'sdk/querystring';
import tabs from 'sdk/tabs';

export type NotificationMessage = {
  id: string,
  title: string,
  text: string,
  url: string
};

export function notify(message: NotificationMessage) {
  Notifications.notify({
    title: message.title,
    text: `via testpilot.firefox.com\n${message.text}`,
    iconURL: './notification-icon.png',
    onClick: () => {
      const url = message.url +
        '?' +
        querystring.stringify({
          utm_source: 'testpilot-addon',
          utm_medium: 'firefox-browser',
          utm_campaign: 'push notification',
          utm_content: message.id
        });
      tabs.open(url);
    }
  });
}
