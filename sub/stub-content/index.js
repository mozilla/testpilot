var statusBox = document.querySelector('.status');

function statusUpdate(msg, detail) {
  var p = document.createElement('p');
  p.textContent = msg;
  statusBox.appendChild(p);
  console.log('STATUS UPDATE:: ', msg, ' :: ', detail);
}

window.addEventListener("from-addon-to-web", function (event) {
  if (!event.detail || !event.detail.type) { return; }
  statusUpdate(event.detail.type, event.detail);
  switch (event.detail.type) {
    case 'addon-available':
      document.body.classList.add('addon-available');
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
sendToAddon({type: 'update-check'});

function renderUpdates(ev) {
  var msgEls = ev.detail.map(function(update, i) {
    var li = document.createElement('li');
    var check = document.createElement('input');
    var label = document.createElement('label');
    check.type = 'checkbox';
    label.textContent = update;

    li.id = 'update-' + i;
    li.appendChild(check);
    li.appendChild(label);

    return li;
  });

  var list = document.querySelector('.updates');
  msgEls.forEach(function(msgEl) {
    list.appendChild(msgEl);
  });

  if (ev.detail.length) document.querySelector('.update-submit').style.display = 'block';
}

document.querySelector('.update-submit').onclick = function(ev) {
  var approvedUpdates = Array.slice.call(0, document.querySelectorAll('.updates li')).filter(function(el) {
                          return (el.querySelector('input').checked);
  }).map(function(el) {return el.textContent});

  sendToAddon({type: 'update-approve', detail: approvedUpdates});
}
