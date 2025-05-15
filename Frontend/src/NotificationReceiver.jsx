import React, { useEffect } from 'react';
import { subscribeToChannel, unsubscribeFromChannel } from './Pusher';

const NotificationReceiver = () => {
  useEffect(() => {
    // Request notification permission from the user (if not granted yet)
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const channel = subscribeToChannel('notifications');

    channel.bind('TestNotification', (data) => {
      // Display the notification if permission is granted
      if (Notification.permission === "granted") {
        new Notification("New Notification", {
          body: data.message,  // The message from Pusher
          icon: "path_to_icon.png",  // Optional, use an icon if you want
        });
      }
    });

    // Cleanup: Unsubscribe from Pusher channel when component unmounts
    return () => {
      unsubscribeFromChannel(channel);
    };
  }, []);

  return null; // No UI rendering needed for this use case
};

export default NotificationReceiver;
