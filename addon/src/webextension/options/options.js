/* global browser */

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    environment: {
      name: document.getElementById("environment > option:changed").textContent,
      baseUrl: document.getElementById("environment").value}
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
    console.log(`Error: ${err}`);
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
