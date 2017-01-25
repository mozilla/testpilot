const Mustache = require('mustache');
const templates = require('./lib/templates');
Mustache.parse(templates.installed);
Mustache.parse(templates.experimentList);

const baseUrl = 'http://testpilot.dev:8000';
const experiments = require('./experiment-data.json');

const wrapEl = document.getElementById('browser-doorhanger');

document.getElementById('render-installed').onclick = renderInstalledMsg;
document.getElementById('render-experiment-list').onclick = renderExperimentList;
document.getElementById('toggle-active').onclick = toggleActive;

renderExperimentList();

function renderExperimentList() {
  wrapEl.innerHTML = Mustache.render(templates.experimentList, {
    base_url: baseUrl,
    experiments: experiments
  });
}

function renderInstalledMsg() {
  wrapEl.innerHTML = Mustache.render(templates.installed, {
    base_url: baseUrl
  });
}

function toggleActive() {
  if (!document.querySelector('.experiment-list')) {
    renderExperimentList();
    document.querySelector('.experiment-item').classList.add('active');
    return;
  }

  const items = Array.from(document.querySelectorAll('.experiment-item'));

  const isActive = items.filter(function(el) {
    return el.classList.contains('active');
  }).length;

  if (isActive) renderExperimentList();
  else items[0].classList.add('active');
}
