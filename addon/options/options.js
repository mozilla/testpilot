/* global browser */

function saveOptions(e) {
  e.preventDefault();
  const select = document.querySelector("#environment");
  browser.storage.local.set({
    environment: {
      name: select.options[select.selectedIndex].text,
      baseUrl: select.value}
  });
}

function restoreOptions() {
  const getting = browser.storage.local.get("environment");
  getting.then((result) => {
    Array.from(document.getElementById("environment").options)
      .forEach((o) => {
        o.selected = (o.value === result.environment.value);
      });
  }, (err) => {
    console.log(`Error: ${err}`); // eslint-disable-line no-console
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
