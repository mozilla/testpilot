/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import { PageMod } from 'sdk/page-mod';
import type Hub from './middleware/Hub';
import type { Environment } from './actionCreators/env';

type WebAppOptions = {
  hub: Hub,
  baseUrl: string,
  whitelist: string,
  addonVersion: string,
  clientUUID: string
};

type PageIncludes = { page: string, beacon: string[] };

function toIncludes(baseUrl: string, whitelist: string): PageIncludes {
  const page = `${baseUrl}/*`;
  const beacon = whitelist.split(',');
  return { page, beacon };
}

export default class WebApp {
  hub: Hub;
  addonVersion: string;
  clientUUID: string;
  page: PageMod;
  beacon: PageMod;
  constructor(options: WebAppOptions) {
    const { hub, baseUrl, whitelist, addonVersion, clientUUID } = options;
    this.hub = hub;
    this.addonVersion = addonVersion;
    this.clientUUID = clientUUID;
    this.createMods(toIncludes(baseUrl, whitelist));
  }

  createMods(includes: PageIncludes) {
    this.page = new PageMod({
      include: includes.page,
      contentScriptFile: './message-bridge.js',
      contentScriptWhen: 'start',
      contentScriptOptions: {
        version: this.addonVersion,
        clientUUID: this.clientUUID
      },
      attachTo: ['top', 'existing'],
      onAttach: worker => {
        this.hub.connect(worker.port);
        worker.on('detach', () => this.hub.disconnect(worker.port));
      }
    });
  }

  changeEnv({ baseUrl, whitelist }: Environment) {
    this.teardown();
    this.createMods(toIncludes(baseUrl, whitelist));
  }

  teardown() {
    this.page.destroy();
    this.beacon.destroy();
  }
}
