function $$ (selector, el) {
  return Array.prototype.slice.call((el || document)
    .querySelectorAll(selector));
}

$$('.pings li button').forEach(function (el) {
  el.addEventListener('click', function (ev) {
    self.port.emit('buttonClicked', el.id);
  });
});
