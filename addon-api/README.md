# idea-town-addon-api

`npm install --save idea-town`

``` javascript

const addonData = {
  'id': addon.id,
  'name': addon.name,
  'version': addon.version
};

const configOverride = {
  'BASE_URL': 'http://ideatown.dev:8000',
  'HOSTNAME': 'ideatown.dev',
  'IDEATOWN_PREFIX': 'ideatown.addon'
};

require('idea-town')(configOverride).metric('universal-search:result-chosen', {
  'tags': ['universal-search', 'search-metrics'],
  'selectedResult': result
}, addonData) // addonData & config optional

```
## Maintainers

* Dave Justice <djustice@mozilla.com>
