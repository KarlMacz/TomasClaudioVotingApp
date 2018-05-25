import React, {Component} from 'react';
import {
  /*
  * APIs
  */
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

import GroupedModals from './partials/GroupedModals';

import styles from './../styles/Styles';
import customStyles from './../styles/LoginStyles';

import {Colors} from './../styles/Colors';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    header: null
  };
  static contentOptions = {
    drawerLockMode: 'locked-closed'
  };

  constructor(props) {
    super(props);

    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false,
      username: '',
      password: ''
    };

    StatusBar.setHidden(true);
    // StatusBar.setBackgroundColor('rgba(34, 34, 34, 0.5)');
    // StatusBar.setTranslucent(true);
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({
        networkConnection: isConnected,
        connectivityModalVisible: !isConnected
      });

      if(!isConnected) {
        setTimeout(() => {
          this.setState({
            connectivityModalVisible: false
          });
        }, 5000);
      }
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
              source={require('./../assets/img/tcc_logo.png')}
            />
            <Text style={customStyles.headerTitleText}>Worthy Votes</Text>
          </View>
        </View>
        <View
          style={customStyles.body}>
          <TextInput
            style={styles.inputControl}
            placeholder="Username"
            onChangeText={(text) => {
              this.setState({
                username: text
              });
            }}
          />
          <TextInput
            style={styles.inputControl}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                password: text
              });
            }}
          />
          <TouchableHighlight
            style={styles.buttonPrimary}
            onPress={() => {
              this.requestLogin();
            }}
            underlayColor={Colors.primaryColorActive}>
            <Text style={styles.buttonContent}>LOG IN</Text>
          </TouchableHighlight>
          <View
            style={customStyles.buttonLinkBlock}>
            <TouchableOpacity
              style={customStyles.buttonLink}
              accessibilityTraits="link"
              onPress={() => {
                this.setState({
                  connectivityModalVisible: true
                });

                setTimeout(() => {
                  this.setState({
                    connectivityModalVisible: false
                  });
                }, 2000);
              }}>
              <Text
                style={{
                  color: Colors.primaryColor
                }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={customStyles.footer}>
          <Text style={customStyles.footerText}>Copyright © 2018 Supreme Student Council of Leaders.</Text>
          <Text style={customStyles.footerText}>All Rights Reserved.</Text>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.statusModalVisible}
          onRequestClose={() => {}}>
          <View
            style={styles.modal}>
            <View
              style={styles.modalContent}>
              <Text>Username: {this.state.username} {typeof this.state.username}</Text>
              <Text>Password: {this.state.password} {typeof this.state.password}</Text>
              <TouchableHighlight
                style={styles.buttonPrimary}
                onPress={() => {
                  this.setModalVisible('status', false);
                  ToastAndroid.show('Closed modal.', ToastAndroid.SHORT);
                }}
                underlayColor={Colors.primaryColorActive}>
                <Text style={styles.buttonContent}>CLOSE</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
    }, 5000);
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
    if(this.state.username === 'a' && this.state.password === 'a') {
      ToastAndroid.show('Login Successful.', ToastAndroid.SHORT);

      this.props.navigation.navigate('Home');
    } else {
      ToastAndroid.show('Invalid username and/or password.', ToastAndroid.SHORT);
    }
  }
}
