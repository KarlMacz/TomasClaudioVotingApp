import PushNotification from 'react-native-push-notification';

import {Config} from './Config';

export default PushNotifs = {
  fetchNotification() {
    fetch(Config.server_url + '/api/json/notifications', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: Config.app_key
      })
    }).then((resp) => resp.json()).then((response) => {
      if(response.message !== null) {
        PushNotification.localNotification({
          title: 'Tomas Claudio College Voting App',
          message: response.message
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
};
