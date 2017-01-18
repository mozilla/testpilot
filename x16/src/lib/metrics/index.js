/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

// @flow

import Experiment from './experiment';
import Variants from './variants';

export default function(clientUUID: string) {
  const variants = new Variants(clientUUID);
  return new Experiment(variants);
}
