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
  TouchableHighlight
} from 'react-native';
import {
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  DrawerItems,
  SafeAreaView,
  TouchableItem
} from 'react-navigation';

import LoginScreen from './components/LoginScreen';
import LogoutScreen from './components/LogoutScreen';
import HomeScreen from './components/HomeScreen';

const CustomDrawerContentComponent = (props) => {
  return (
    <ScrollView>
      <SafeAreaView
        forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems
          activeTintColor="#4c9261"
          {...props} />

      </SafeAreaView>
    </ScrollView>
  );
};

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
  contentComponent: CustomDrawerContentComponent
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
  initialRouteName: 'Stack'
});

export default class App extends Component {
  render() {
    return (
      <RootNavi />
    );
  }
}
