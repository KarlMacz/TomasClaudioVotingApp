import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  Animated,
  AsyncStorage,
  Easing,
  ToastAndroid,

  /*
  * Components
  */
  ActivityIndicator,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native';

import styles from './../styles/Styles';

export default class SplashScreen extends Component {
  static navigationOptions = {
    title: 'Splash Screen',
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      fadeAnimation: new Animated.Value(0)
    };

    AsyncStorage.getItem('auth').then((result) => {
      if(result !== null) {
        this.setState({
          isAuthenticated: true
        });
      } else {
        this.setState({
          isAuthenticated: false
        });
      }
    });

    StatusBar.setHidden(true);
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.fadeAnimation, {
        toValue: 1,
        duration: 500
      }),
      Animated.timing(this.state.fadeAnimation, {
        toValue: 0,
        duration: 500,
        delay: 2000
      })
    ]).start(() => {
      if(this.state.isAuthenticated) {
        this.props.navigation.navigate('Home');
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
        <Animated.View
          style={{
            opacity: this.state.fadeAnimation
          }}>
          <Text
            style={{
              fontFamily: 'Satisfy',
              fontSize: 20,
              textAlign: 'center',
              marginBottom: -30
            }}>Made possible by</Text>
          <Image
            style={{
              height: 250,
              width: 250
            }}
            source={require('./../assets/img/sscl_logo.png')} />
        </Animated.View>
      </View>
    );
  }
}
