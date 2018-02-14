/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global browser */

import uuidv4 from "uuid/v4";

import { log } from "./utils";
import { sendBootstrapMessage } from "./bootstrap";

export async function setupStorage() {
  log("setupStorage");
  const storage = browser.storage.local;
  const data = await storage.get("clientUUID");
  if (!data.clientUUID) {
    data.clientUUID = uuidv4();
    await storage.set({ clientUUID: data.clientUUID });
  }

  sendBootstrapMessage("updateClientUUID", data.clientUUID);
  return data;
}
