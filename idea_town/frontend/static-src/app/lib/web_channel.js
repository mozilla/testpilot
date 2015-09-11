import Events from 'ampersand-events';

class WebChannel {
  constructor() {
    // turn this into an event emitter
    Events.createEmitter(this);

    // listen for WebChannel messages
    window.addEventListener('WebChannelMessageToContent', this._messageReceived.bind(this));

    this.channelId = null;
  }

  sendMessage(type, data) {
    window.dispatchEvent(new window.CustomEvent('WebChannelMessageToChrome', {
      detail: {
        id: this.channelId,
        message: {
          type: type,
          data: data
        }
      }
    }));
  }

  _messageReceived(evt) {
    const newChannelId = evt.detail.id;
    if (this.channelId !== newChannelId) {
      this.channelId = newChannelId;
    }

    const message = evt.detail.message;
    if (message && message.data) {
      this.trigger(message.type, message.data);
    }
  }
}

export default new WebChannel();
