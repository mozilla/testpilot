export default `
  <div class="page">
    <section id="details" data-hook="experiment-page">
      <header data-hook="main-header"></header>
      <div id="details">
        <div class="details-sticker"></div>

        <div class="details-header-wrapper">
          <div class="details-header">
            <h1>{{model.title}}</h1>
            <div class="idea-controls">
              {{#model.enabled}}
                <button data-hook="uninstall" class="button primary">Disable {{model.title}}</button>
              {{/model.enabled}}
              {{^model.enabled}}
                <button data-hook="install" class="button primary">Enable {{model.title}}</button>
              {{/model.enabled}}
              <div class="user-count">7,654,321</div>
            </div>
          </div>
        </div>

        <div class="details-content">
          <div class="details-overview">
            <img src="{{model.thumbnail}}" width="260">
            {{#model.measurements}}
            <section class="measurement">
              <h3>Measurements</h3>
              <p class="disclaimer">All data is collected anonymously and used only to help us improve this test.</p>
              {{{model.measurements}}}
            </section>
            {{/model.measurements}}
            <section>
              <h3>Brought to you by</h3>
              <ul class="contributors">
                {{#model.contributors}}
                <li>
                  <img src="{{avatar}}" width="56" height="56">
                  <div class="contributor">
                    <p class="name">{{display_name}}</span>
                    <p class="title">{{title}}</span>
                  </div>
                </li>
                {{/model.contributors}}
                {{^model.contributors}}
                  <!-- TODO: need a blank slate case for no contributors? -->
                  <li>
                    <img src="images/default-avatar@2x.png" width="56" height="56">
                    <div class="contributor">
                      <p class="name">To be announced</span>
                    </div>
                  </li>
                {{/model.contributors}}
              </ul>
            </section>
            <section>
              <h3>Details</h3>
              <table class="stats">
                {{#model.version}}
                <tr>
                  <td>Version</td>
                  <td>{{model.version}}{{#model.changelog_url}} <a href="{{model.changelog_url}}">changelog</a>{{/model.changelog_url}}</td>
                </tr>
                {{/model.version}}
                <tr>
                  <td>Last Update</td>
                  <td>{{modified_date}}</td>
                </tr>
                <tr>
                  <td>Contribute</td>
                  <td><a href="{{model.contribute_url}}">{{model.contribute_url}}<a></td>
                </tr>
              </table>
            </section>
          </div>

          <div class="details-description">
            <p class="copy">{{model.description}}
            {{#model.details}}
              <div class="details-image">
                <img src="{{image}}" width="680">
                <p class="caption"><strong>{{headline}}</strong> {{copy}}</p>
              </div>
            {{/model.details}}
          </div>
        </div>
      </div>
    </section>
    <div data-hook="main-footer"></div>
  <div>
`;

