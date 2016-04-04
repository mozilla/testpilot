self.port.on('show', content => {
  document.getElementById('content').innerHTML = content;
  Array.from(document.querySelectorAll('a')).forEach(el => {
    el.onclick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      self.port.emit('link', el.href);
    };
  });
});
