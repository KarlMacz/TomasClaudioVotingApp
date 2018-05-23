import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  NetInfo,
  StyleSheet,
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

import styles from './../styles/Styles';
import customStyles from './../styles/LoginStyles';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
    header: null
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
              this.requestLogin()
            }}
            underlayColor="yellow">
            <Text style={styles.buttonContent}>LOG IN</Text>
          </TouchableHighlight>
          <View
            style={customStyles.buttonLinkBlock}>
            <TouchableOpacity
              style={customStyles.buttonLink}
              accessibilityTraits="link"
              onPress={() => {
                this.requestLogin()
              }}>
              <Text>Forgot Password?</Text>
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
                underlayColor="yellow">
                <Text style={styles.buttonContent}>CLOSE</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.loaderModalVisible}
          onRequestClose={() => {}}>
          <View
            style={styles.modal}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.connectivityModalVisible}
          onRequestClose={() => {}}>
          {(this.state.networkConnection ? (
            <View
              style={styles.promptBoxSuccess}>
              <Text style={styles.colorWhite}>Connected.</Text>
            </View>
          ) : (
            <View
              style={styles.promptBoxDanger}>
              <Text style={styles.colorWhite}>No Internet Connection.</Text>
            </View>
          ))}
        </Modal>
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
    this.setModalVisible('status', true);
    ToastAndroid.show('Opened modal.', ToastAndroid.SHORT);
  }
}
