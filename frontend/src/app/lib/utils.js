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

export function buildSurveyURL(ref, title, installed, survey_url) {
  const queryParams = querystring.stringify({
    ref,
    experiment: title,
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
