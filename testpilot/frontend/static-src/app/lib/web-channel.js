import app from 'ampersand-app';

class WebChannel {
  constructor() {
    window.addEventListener('from-addon-to-web', this._messageReceived.bind(this));

    this.channelId = null;
  }

  sendMessage(type, data) {
    document.documentElement.dispatchEvent(new CustomEvent('from-web-to-addon', {
      bubbles: true,
      detail: {
        type: type,
        data: data
      }
    }));
  }

  _messageReceived(evt) {
    const newChannelId = evt.detail.id;
    if (this.channelId !== newChannelId) {
      this.channelId = newChannelId;
    }

    const message = evt.detail;
    if (message && message.type) {
      app.trigger('webChannel:' + message.type, message.data);
    }
  }
}

export default new WebChannel();
