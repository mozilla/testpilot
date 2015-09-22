export default `
  <section class="page" data-hook="experiment-page">
    <h1>{{title}}</h1>
    {{#isInstalled}}
      <button data-hook="uninstall">Uninstall</button>
    {{/isInstalled}}
    {{^isInstalled}}
      <button data-hook="install">Install</button>
    {{/isInstalled}}
  </section>
`;

