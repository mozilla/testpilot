const { Services } = require('resource://gre/modules/Services.jsm');


function getAnonEl(win, box, attrName) {
  return win.document.getAnonymousElementByAttribute(box, 'anonid', attrName);
}

function createNotificationBox(options) {
  const win = Services.wm.getMostRecentWindow('navigator:browser');
  const notifyBox = win.gBrowser.getNotificationBox();
  const box = notifyBox.appendNotification(
    options.label,
    options.value || '',
    options.image,
    notifyBox.PRIORITY_INFO_LOW,
    options.buttons || [],
    options.callback
  );
  const messageText = getAnonEl(win, box, 'messageText');
  const messageImage = getAnonEl(win, box, 'messageImage');

  if (options.child) {
    const child = options.child(win);
    // Make sure the child is not pushed to the right by the spacer.
    const rightSpacer = win.document.createElement('spacer');
    rightSpacer.flex = 20;
    child.appendChild(rightSpacer);
    box.appendChild(child);
  }
  messageText.flex = 0; // Collapse the space before the stars/button.
  const leftSpacer = messageText.nextSibling;
  leftSpacer.flex = 0;
  box.classList.add('heartbeat');
  messageImage.classList.add('heartbeat');
  if (options.pulse) {
    messageImage.classList.add('pulse-onshow');
  }
  messageText.classList.add('heartbeat');
  messageImage.setAttribute('style', 'filter: invert(80%)');
  box.persistence = options.persistence || 0;
  return {
    notifyBox,
    box
  };
}

module.exports = {
  createNotificationBox: createNotificationBox
};
