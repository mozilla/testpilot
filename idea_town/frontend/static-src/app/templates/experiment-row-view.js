export default `
  <li class="idea-card" data-hook="show-detail"
    // toggle a class for styling purposes:
    class="{{#isInstalled}} active {{/isInstalled}}">
    <img width="200" height="200" src="{{thumbnail}}">
    <h2>{{title}}</h2>
    <p>Status: {{^isInstalled}} Not {{/isInstalled}} Installed</p>
  </li>
`;

