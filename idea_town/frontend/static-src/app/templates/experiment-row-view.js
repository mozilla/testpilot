export default `
  <li data-hook="show-detail" class="idea-card {{#isInstalled}} active {{/isInstalled}}">
    <div class="idea-preview-image" style="background-image: url({{thumbnail}})"></div>
    <h2>{{title}}</h2>
    <p>{{description}}</p>
  </li>
`;

