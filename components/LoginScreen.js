import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  AsyncStorage,
  Keyboard,
  NetInfo,
  ToastAndroid,

  /*
  * Components
  */
  ActivityIndicator,
  Image,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import {Config} from './../Config';
import PushNotifs from './../PushNotifs';

import GroupedModals from './partials/GroupedModals';
import Button from './partials/Button';

import styles from './../styles/Styles';
import customStyles from './../styles/LoginStyles';

import {Colors} from './../styles/Colors';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    header: null,
    drawerLockMode: 'locked-closed'
  };

  constructor(props) {
    super(props);

    this.inputRefs = {};
    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false,
      username: ''
    };

    PushNotifs.fetchNotification();

    this.notifInterval = setInterval(() => {
      PushNotifs.fetchNotification();
    }, 5000);

    AsyncStorage.getItem('auth').then((result) => {
      if(result !== null) {
        this.props.navigation.navigate('Home');
      }
    });

    StatusBar.setHidden(true);
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.handleConnectivityChange(isConnected);
    });

    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
      this.handleConnectivityChange(isConnected);
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', (isConnected) => {
      this.handleConnectivityChange(isConnected);
    });
    
    clearInterval(this.notifInterval);
  }

  render() {
    return (
      <View
        style={styles.body}>
        <View
          style={customStyles.header}>
          <View
            style={customStyles.headerContent}>
            <Image
              style={customStyles.headerLogo}
              source={require('./../assets/img/tcc_logo.png')} />
            <Text style={customStyles.headerTitleText}>Worthy Votes</Text>
          </View>
        </View>
        <View
          style={customStyles.body}>
          <TextInput
            style={styles.inputControlLg}
            ref={(input) => {
              this.inputRefs.username = input;
            }}
            placeholder="Username or Student ID Number"
            onChangeText={(text) => {
              this.setState({
                username: text
              });
            }} />
          <View
            style={customStyles.buttonLinkBlock}>
            <Button
              title="LOGIN"
              type="primary"
              onPress={() => {
                this.requestLogin();
              }} />
          </View>
        </View>
        <View
          style={customStyles.footer}>
          <Text style={customStyles.footerText}>Copyright © 2018 Supreme Student Council of Leaders.</Text>
          <Text style={customStyles.footerText}>All Rights Reserved.</Text>
        </View>
        <GroupedModals
          showLoader={this.state.loaderModalVisible}
          showConnectivity={this.state.connectivityModalVisible}
          networkConnection={this.state.networkConnection} />
      </View>
    );
  }

  handleConnectivityChange(isConnected) {
    this.setState({
      networkConnection: isConnected,
      connectivityModalVisible: true
    });

    setTimeout(() => {
      this.setState({
        connectivityModalVisible: false
      });
    }, 1000);
  }

  setModalVisible(modalName, isVisible) {
    switch(modalName) {
      case 'status':
        this.setState({
          statusModalVisible: isVisible
        });

        break;
      case 'loader':
        this.setState({
          loaderModalVisible: isVisible
        });

        break;
      case 'connectivity':
        this.setState({
          connectivityModalVisible: isVisible
        });

        break;
    }
  }

  requestLogin() {
    this.setState({
      loaderModalVisible: true
    });

    fetch(Config.server_url + '/api/json/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: Config.app_key,
        username: this.state.username
      })
    }).then((resp) => resp.json()).then((response) => {
      this.setState({
        loaderModalVisible: false
      });

      if(response.status === 'ok') {
        AsyncStorage.setItem('auth', JSON.stringify(response.data));

        ToastAndroid.show('Login Successful.', ToastAndroid.SHORT);

        this.props.navigation.navigate('Home');
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      this.setState({
        loaderModalVisible: false
      });

      console.log(err);
      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });
  }
}
