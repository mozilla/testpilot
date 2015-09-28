export default `
  <section class="navbar">
    {{#activeUser}}
      Logged in as {{session}} <button data-hook="logout">Log out</button>
    {{/activeUser}}
    {{^activeUser}}
      <div id="tabzilla">
        <a href="https://www.mozilla.org/">Mozilla</a>
      </div>
    {{/activeUser}}
  </section>
`;
