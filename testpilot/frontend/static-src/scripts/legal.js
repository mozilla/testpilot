/* global ga*/
/*eslint-disable*/
// HACK: Google Analytics lives here, because CSP won't let it live inline
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)
},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
/*eslint-enable*/

if (typeof(ga) !== 'undefined') {
  ga('create', 'UA-49796218-34', 'auto');
} else {
  console.warn(
    'You have google analytics blocked. We understand. Take a ' +
    'look at our privacy policy to see how we handle your data.'
  );
}

window.addEventListener('DOMContentLoaded', function (event) {
  'use strict';

  // Add an accordion to the Privacy Notice page
  if (location.pathname === '/privacy') {
    var ps = document.querySelectorAll('h2 ~ p');
    var tablist = ps[0].parentElement;

    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-multiselectable', 'true');

    Array.prototype.map.call(ps, function (p, i) {
      var expanded = false;
      var label = document.createElement('span');
      var tab = document.createElement('a');
      var tabpanel = p.nextElementSibling;
      var tabpanel_id = 'privacy-tabpanel-' + i;
      var label_id = 'privacy-tab-' + i + '-label';

      label.id = label_id;
      label.textContent = p.textContent;
      tab.href = '#';
      tab.textContent = 'Learn More';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('aria-expanded', 'false');
      tab.setAttribute('aria-controls', tabpanel_id);
      tab.setAttribute('aria-labelledby', label_id);
      tabpanel.id = tabpanel_id;
      tabpanel.tabIndex = -1;
      tabpanel.setAttribute('role', 'tabpanel');
      tabpanel.setAttribute('aria-labelledby', label_id);
      tabpanel.setAttribute('aria-hidden', 'true');
      tabpanel.hidden = true;
      tabpanel.style.display = 'none';

      tab.addEventListener('click', function (event) {
        expanded = !expanded;
        tab.textContent = expanded ? 'Show Less' : 'Learn More';
        tab.setAttribute('aria-expanded', expanded);
        tab.focus();
        tabpanel.setAttribute('aria-hidden', !expanded);
        tabpanel.hidden = !expanded;
        tabpanel.style.display = expanded ? 'block' : 'none';
        event.preventDefault();
      });

      tab.addEventListener('focus', function (event) {
        tab.setAttribute('aria-selected', 'true');
      });

      tab.addEventListener('blur', function (event) {
        tab.setAttribute('aria-selected', 'false');
      });

      p.innerHTML = '';
      p.appendChild(label);
      p.appendChild(document.createTextNode(' '));
      p.appendChild(tab);
    });
  }
});
