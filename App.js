import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  AppState,
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

export default class App extends Component {
  constructor(props) {
    super(props);

    this.appStateInterval = null;

    this.state = {
      appState: AppState.currentState
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);

    clearInterval(this.appStateInterval);
  }

  _handleAppStateChange = (appState) => {
    if(this.state.appState !== appState) {
      this.setState({
        appState: appState
      });

      clearInterval(this.appStateInterval);

      console.log('App state has changed.');
    }

    this.appStateInterval = setInterval(() => {
        console.log('Current App State: ' + appState);

        /*PushNotification.localNotification({
          title: 'Tomas Claudio College Voting App',
          message: 'Testing'
        });*/
        /*fetch(Config.server_url + '/api/json/notifications', {
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
        });*/
      }, 5000);
  }

  render() {
    return (
      <RootNavi />
    );
  }
}
