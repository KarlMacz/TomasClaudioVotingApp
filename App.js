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
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if(appState === 'background') {
      PushNotification.localNotification({
        title: 'TestNotif',
        message: 'App is now in background.'
      });
    } else {
      PushNotification.localNotification({
        title: 'TestNotif',
        message: 'App is now active.'
      });
    }
  }

  render() {
    return (
      <RootNavi />
    );
  }
}
