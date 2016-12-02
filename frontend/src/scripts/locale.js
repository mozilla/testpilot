(function () {
  var availableLangs = [];
  var defaultLang = null;
  var langs = (navigator.languages || [navigator.language]).map(
    function(l) { return l.toLowerCase() });
  var metas = Array.from(
    document.head.querySelectorAll('meta[name="availableLanguages"],meta[name="defaultLanguage"]')
  );
  for (var i = 0; i < metas.length; i++) {
    var meta = metas[i];
    var name = meta.getAttribute('name');
    var content = meta.getAttribute('content').trim();
    switch (name) {
      case 'availableLanguages':
        availableLangs = content.split(',').map(
          function (l) {
            return l.trim().toLowerCase();
          }
        );
        break;
      case 'defaultLanguage':
        defaultLang = content.toLowerCase();
        break;
    }
  }

  function bestLang() {
    for (var i = 0; i < langs.length; i++) {
      var l = langs[i];
      if (availableLangs.indexOf(l) > -1) {
        return l;
      }
    }
    return defaultLang;
  }

  function navigateToLocale() {
    var path = window.location.pathname;
    var lang = bestLang();
    if (lang !== defaultLang) {
      window.location = window.location + (path[path.length - 1] === '/' ? '' : '/') + lang;
    }
  }

  // if we're not already on a specific locale
  if (window.location.pathname.split('/').filter(function (s) { return !!s.length }).length < 2) {
    navigateToLocale();
  }
  else {
    require('babel-polyfill/browser');
    require('l20n/dist/compat/web/l20n');
  }
}());
