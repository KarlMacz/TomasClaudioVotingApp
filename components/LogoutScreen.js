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
  ActivityIndicator,
  StatusBar,
  Text,
  View
} from 'react-native';

import styles from './../styles/Styles';

export default class Logout extends Component {
  static navigationOptions = {
    title: 'Logout',
    header: null,
    drawerLockMode: 'locked-closed'
  };

  constructor(props) {
    super(props);

    AsyncStorage.removeItem('auth');

    StatusBar.setHidden(true);
  }

  render() {
    setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 5000);

    return (
      <View
       style={{
         backgroundColor: '#4c9261',
         flex: 1,
         justifyContent: 'center',
         height: '100%',
         width: '100%',
       }}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            textAlign: 'center'
          }}>Logging out...</Text>
      </View>
    );
  }
}
