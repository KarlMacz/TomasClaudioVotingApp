import React, {Component} from 'react';
import {
  /*
  * APIs
  */
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

import SplashScreen from './components/SplashScreen';
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
  render() {
    return (
      <RootNavi />
    );
  }
}
