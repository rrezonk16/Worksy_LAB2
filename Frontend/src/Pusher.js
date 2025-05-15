// src/Pusher.js
import Pusher from 'pusher-js';

const pusher = new Pusher('22e59d0939304275ad94', {
  cluster: 'eu',
  forceTLS: true,
});

// Subscribe to a channel and return the channel object
export const subscribeToChannel = (channelName) => {
  const channel = pusher.subscribe(channelName);
  if (!channel) {
    console.error('Failed to subscribe to channel');
  }
  return channel;
};

// Unsubscribe from a channel
export const unsubscribeFromChannel = (channel) => {
  pusher.unsubscribe(channel.name);
};
