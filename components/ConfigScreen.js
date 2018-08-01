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

import GroupedModals from './partials/GroupedModals';
import Button from './partials/Button';

import styles from './../styles/Styles';
import customStyles from './../styles/LoginStyles';

import {Colors} from './../styles/Colors';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Config',
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
      url: ''
    };

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
          <Text>Current Server URL: {Config.server_url}</Text>
          <TextInput
            style={styles.inputControlLg}
            ref={(input) => {
              this.inputRefs.url = input;
            }}
            placeholder="Server URL"
            onChangeText={(text) => {
              this.setState({
                url: text
              });
            }} />
          <View
            style={customStyles.buttonLinkBlock}>
            <Button
              title="Update"
              type="primary"
              onPress={() => {
                this.requestConfig();
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

  requestConfig() {
    Config.server_url = this.state.url;

    ToastAndroid.show('Server URL has been updated.', ToastAndroid.SHORT);
  }
}
