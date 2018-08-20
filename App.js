import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  AppState,
  AsyncStorage,
  ToastAndroid,

  /*
  * Components
  */
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import {
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  DrawerItems,
  SafeAreaView
} from 'react-navigation';
import BackgroundTask from 'react-native-background-task';
import PushNotification from 'react-native-push-notification';

import {Config} from './Config';

import SplashScreen from './components/SplashScreen';
import ConfigScreen from './components/ConfigScreen';
import LoginScreen from './components/LoginScreen';
import LogoutScreen from './components/LogoutScreen';
import HomeScreen from './components/HomeScreen';
import VotingScreen from './components/VotingScreen';
import RankingScreen from './components/RankingScreen';
import Sidebar from './components/partials/Sidebar';

const RootDrawer = createDrawerNavigator({
  Home: {
    screen: HomeScreen
  },
  Voting: {
    screen: VotingScreen
  },
  Ranking: {
    screen: RankingScreen
  },
  Logout: {
    screen: LogoutScreen
  }
}, {
  initialRouteName: 'Home',
  drawerPosition: 'left',
  contentComponent: Sidebar
});

const RootStack = createStackNavigator({
  Login: {
    screen: LoginScreen
  },
  Config: {
    screen: ConfigScreen
  }
}, {
  initialRouteName: 'Login'
});

const RootNavi = createSwitchNavigator({
  Splash: {
    screen: SplashScreen
  },
  Stack: RootStack,
  Drawer: RootDrawer
}, {
  initialRouteName: 'Splash'
});

var getCurrentTimestamp = () => {
  var now = new Date();
  var yy = now.getFullYear();
  var mm = now.getMonth() + 1;
  var dd = now.getDate();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();

  if(mm < 10) {
    mm = '0' + mm;
  }

  if(dd < 10) {
    dd = '0' + dd;
  }

  if(h < 10) {
    h = '0' + h;
  }

  if(m < 10) {
    m = '0' + m;
  }

  if(s < 10) {
    s = '0' + s;
  }

  return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
}

function fetchPushNotifications() {
  var auth = null;
  var username = '';

  AsyncStorage.getItem('auth').then((result) => {
    if(result !== null) {
      auth = JSON.parse(result);
    }
  });

  if(auth !== null) {
    username = auth.username;

    fetch(Config.server_url + '/api/json/notifications', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: Config.app_key,
        username: username
      })
    }).then((resp) => resp.json()).then((response) => {
      if(response.status === 'ok') {
        if(response.data.length > 0) {
          for(var i = 0; i < response.data.length; i++) {
            PushNotification.localNotification({
              title: response.data[i].subject,
              message: response.data[i].message
            });
          }
        }
      }
    }).catch((err) => {
    });
  }
}

BackgroundTask.define(() => {
  fetchPushNotifications();

  console.log('[' + getCurrentTimestamp() + '] Push Notif on background.');

  BackgroundTask.finish();
});

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (appState) => {
    if(this.state.appState !== appState) {
      this.setState({
        appState: appState
      });

      fetchPushNotifications();

      BackgroundTask.schedule({
        period: 5
      });

      console.log('[' + getCurrentTimestamp() + '] App state has changed.');
    }
  }

  render() {
    return (
      <RootNavi />
    );
  }
}
