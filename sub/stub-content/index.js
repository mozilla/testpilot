/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

var statusBox = document.querySelector('.status');

function statusUpdate(msg, detail) {
  var p = document.createElement('p');
  p.textContent = msg;
  statusBox.appendChild(p);
}

window.addEventListener('from-addon-to-web', function(event) {
  if (!event.detail || !event.detail.type) { return; }
  statusUpdate(event.detail.type, event.detail);
  switch (event.detail.type) {
    case 'addon-available':
      document.body.classList.add('addon-available');
      renderUpdates(event.detail);
      renderStatus(event.detail);
      break;
    case 'addon-updates':
      renderUpdates(event.detail);
      break;
    default:
      console.log('WEB RECEIVED FROM ADDON', JSON.stringify(event.detail, null, ' '));
      break;
  }
}, false);

function sendToAddon (data) {
  document.documentElement.dispatchEvent(new CustomEvent(
    'from-web-to-addon', { bubbles: true, detail: data }
  ));
}

sendToAddon({ type: 'loaded' });

function renderUpdates(ev) {
  var list = document.querySelector('.updates');
  ev.detail.updates.map(getItemRenderer('update'))
                    .forEach(function(msgEl) {
                               list.appendChild(msgEl);
                             });

  if (ev.detail.length) document.querySelector('.update-submit').style.display = 'block';
}

function renderStatus(ev) {
  var list = document.querySelector('.installed');
  ev.detail.experiments.map(getItemRenderer('installed'))
                   .forEach(function(msgEl) {
                      list.appendChild(msgEl);
                    });
}

document.querySelector('.update-submit').onclick = function(ev) {
  sendToAddon({type: 'update-approve', detail: getApprovedList('.updates li')});
};

document.querySelector('.uninstall-selected').onclick = function(ev) {
  sendToAddon({type: 'uninstall', detail: getApprovedList('.installed li')});
}

document.querySelector('.uninstall-all').onclick = function(ev) {
    sendToAddon({type: 'uninstall-all', detail: []});
}

function getApprovedList(selector) {
  return Array.slice.call(0, document.querySelectorAll(selector)).filter(function(el) {
           return (el.querySelector('input').checked);
         }).map(function(el) {return {
           name: el.textContent,
           id: el['data-id']
         }});
}

function getItemRenderer(idPrefix) {
  return function(obj, i) {
    var li = document.createElement('li');
    var check = document.createElement('input');
    var label = document.createElement('label');
    check.type = 'checkbox';
    label.textContent = obj.name;
    li['data-id'] = obj.id;
    li.id = idPrefix+'-' + i;
    label.appendChild(check);
    li.appendChild(label);

    return li;
  }
}
