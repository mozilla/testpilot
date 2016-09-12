/* global ga */
import querystring from 'querystring';

export function sendToGA(type, dataIn) {
  const data = dataIn || {};
  const hitCallback = () => {
    if (data.outboundURL) {
      document.location = data.outboundURL;
    }
  };
  if (window.ga && ga.loaded) {
    data.hitType = type;
    data.hitCallback = hitCallback;
    ga('send', data);
  } else {
    hitCallback();
  }
}

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

export function subscribeToBasket(email, callback) {
  const url = 'https://basket.mozilla.org/news/subscribe/';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `newsletters=test-pilot&email=${encodeURIComponent(email)}`
  }).then(callback)
  .catch(err => {
    // for now, log the error in the console & do nothing in the UI
    console && console.error(err); // eslint-disable-line no-console
  });
}
