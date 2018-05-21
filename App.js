import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation';

import LoginScreen from './components/LoginScreen';

const RootStack = createStackNavigator({
  Login: {
    screen: LoginScreen
  }
}, {
  initialRouteName: 'Login'
});

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
