import React, {Component} from 'react';
import {
  /*
  * APIs
  */
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

import LoginScreen from './components/LoginScreen';
import LogoutScreen from './components/LogoutScreen';
import HomeScreen from './components/HomeScreen';
import Sidebar from './components/partials/Sidebar';

var auth = null;

AsyncStorage.getItem('auth').then((result) => {
  if(result !== null) {
    auth = result;
  }
});

const RootDrawer = createDrawerNavigator({
  Home: {
    screen: HomeScreen
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
  Stack: RootStack,
  Drawer: RootDrawer
}, {
  initialRouteName: (auth === null ? 'Stack' : 'Drawer')
});

export default class App extends Component {
  render() {
    return (
      <RootNavi />
    );
  }
}
