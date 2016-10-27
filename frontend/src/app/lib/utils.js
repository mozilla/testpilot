import querystring from 'querystring';

export function formatDate(date) {
  let out = '';
  const d = new Date(date);
  if (isNaN(d)) {
    out = null;
  } else {
    // safari is the new IE :(
    try {
      out = d.toLocaleDateString();
    } catch (e) {
      out = `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`;
    }
  }
  return out;
}

export function buildSurveyURL(ref, title, installed, clientUUID, survey_url) {
  const queryParams = querystring.stringify({
    ref,
    experiment: title,
    cid: clientUUID,
    installed: installed ? Object.keys(installed) : []
  });
  return `${survey_url}?${queryParams}`;
}

export function createMarkup(content) {
  return { __html: content };
}

export function isMinFirefoxVersion(isFirefox, ua, minVersion) {
  if (!isFirefox) return false;
  return parseInt(ua.split('/').pop(), 10) >= minVersion;
}


// Passed a string, returns a verison of that string sanitized by stripping all
// non-alphanumeric characters, lowercasing the entire string, then capitalizing
// the first character.
//
// > l10nIdFormat('Activity Stream');
// Activitystream
export function l10nIdFormat(str) {
  const segment = String(str).replace(/[^A-Za-z0-9]+/g, '');
  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}


// Passed an array of pieces, returns a formatted l10n ID comprised of those
// pieces, sanitized and camel-cased.
//
// > l10nId(['Activity Stream', 'Contributor', 'Title', 'Bryan Bell']);
// 'activitystreamContributorTitleBryanbell'
export function l10nId(pieces) {
  pieces[0] = l10nIdFormat(pieces[0]);
  const stitched = pieces.reduce((a, b) => `${a}${l10nIdFormat(b)}`);
  return stitched.charAt(0).toLowerCase() + stitched.slice(1);
}


// Passed three pieces of information, generates and returns an appropriate l10n
// ID.
//
// Params:
// - experiment - the JavaScript object representing the experiment.
// - pieces - an array of segments comprising the generated l10n ID. If a string
//            is passed, it's converted to a single-item array.
// - path - an optional string representing the period-delimited path to the
//          property of the experiment that the l10n ID references. This is used
//          to look for a _l10nid version of that field, which is used as a
//          suffix if present. If omitted, the first item in `pieces` is used.
export function experimentL10nId(experiment, pieces, path = null) {
  if (typeof pieces === 'string') {
    pieces = [pieces];
  }
  if (!path) {
    path = pieces[0];
  }
  if (path) {
    const suffix = lookup(experiment, `${path}_l10nid`);
    if (suffix) {
      pieces.push(suffix);
    }
  }
  return l10nId([].concat([experiment.slug], pieces));
}


// Passed an object and a period.delimited string indicating a path, returns the
// value at that path if it exists, or null if it doesn't.
//
// >> lookup({ foo: [ { bar: 'baz' } ] }, 'foo.0.bar');
// 'baz'
//
// >> lookup({}, 'foo');
// null
export function lookup(obj, path) {
  const pieces = path.split('.');
  if (pieces.length > 1) {
    return lookup(obj[pieces[0]], pieces.slice(1).join('.'));
  }
  return obj[pieces[0]] || null;
}
