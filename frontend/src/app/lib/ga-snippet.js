/* eslint-disable */
// HACK: Google Analytics lives here, because CSP won't let it live inline
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)
},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');

if (typeof(ga) !== 'undefined') {
  ga('create', {
      trackingId: 'UA-49796218-34',
      cookieDomain: 'auto',
      siteSpeedSampleRate: '100'
  });
} else {
  console.warn( // eslint-disable-line no-console
    'You have google analytics blocked. We understand. Take a ' +
    'look at our privacy policy to see how we handle your data.'
  );
}
/* eslint-enable */
