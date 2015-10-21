export default `
  <section id="details" class="page" data-hook="experiment-page">
    <header data-hook="main-header"></header>
    <div id="details">
      <div class="details-sticker"></div>

      <div class="details-header-wrapper">
        <div class="details-header">
          <h1>{{title}}</h1>
          <div class="idea-controls">
            {{#isInstalled}}
              <button data-hook="install" class="button primary">Enable {{title}}</button>
            {{/isInstalled}}
            {{^isInstalled}}
              <button data-hook="uninstall" class="button primary">Disable {{title}}</button>
            {{/isInstalled}}
            <div class="user-count">7,654,321</div>
          </div>
        </div>
      </div>

      <div class="details-content">
        <div class="details-overview">
          <img src="{{thumbnail}}" width="260">
          <section>
            <h3>Measurements</h3>
            <p class="disclaimer">All data is collected anonymously and used only to help us improve this test. <a href="">Learn more.</a></p>
            <ul class="measurement">
              <li>Usage per session</li>
              <li>Index of selected results</li>
              <li>Time spent searching</li>
            </ul>
          </section>
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
              <tr>
                <td>Version</td>
                <td>0.4.5 <a href="">changelog</a></td>
              </tr>
              <tr>
                <td>Last Update</td>
                <td>10/22/15</td>
              </tr>
              <tr>
                <td>Repo</td>
                <td><a href="">https://github.com/mozilla/snooze-tabs<a></td>
              </tr>
            </table>
          </section>
        </div>

        <div class="details-description">
          <p class="copy">{{description}}
          {{#details}}
            <div class="details-image">
              <img src="{{image}}" width="680">
              <p class="caption"><strong>{{headline}}</strong> {{copy}}</p>
            </div>
          {{/details}}
        </div>
      </div>
    </div>
  </section>
`;

