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
  Button,
  Modal,
  Text,
  TextInput,
  View
} from 'react-native';

import styles from './../styles/Styles';
import customStyles from './../styles/Login';

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
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      this.setState({
        networkConnection: (isConnected ? true : false)
      });
    NetInfo.addEventListener('connectionChange', handleConnectivityChange);
  }

  render() {
    return (
      <View style={styles.body}>
        <View style={customStyles.page}>
          <TextInput
            autoFocus={true}
            style={styles.inputControl}
            onChangeText={(text) => {
              this.setState({username: text});
            }}
          />
          <TextInput
            secureTextEntry={true}
            style={styles.inputControl}
            onChangeText={(text) => {
              this.setState({password: text});
            }}
          />
          <Button
            onPress={() => {
              this.requestLogin();
            }}
            title="Log In"
            color="#841584"
            accessibilityLabel="Log In"
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.statusModalVisible}
          onRequestClose={() => {}}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text>Username: {this.state.username}</Text>
              <Text>Password: {this.state.password}</Text>
              <Button
                onPress={() => {
                  this.setModalVisible(false);
                  ToastAndroid.show('Closed modal.', ToastAndroid.SHORT);
                }}
                title="Close"
                color="#841584"
                accessibilityLabel="Close"
              />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.loaderModalVisible}
          onRequestClose={() => {}}>
          <View style={styles.modal}>
            <ActivityIndicator size="small" color="#fffff" />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.connectivityModalVisible}
          onRequestClose={() => {}}>
          <View style={styles.notifModal}>
            {(isConnected === true ? (
              <View style={styles.promptBoxSuccess}>Internet Connection Restored.</View>
            ) : (
              <View style={styles.promptBoxDanger}>No Internet Connection.</View>
            ))}
          </View>
        </Modal>
      </View>
    );
  }

  function handleConnectivityChange(isConnected) {
    this.setState({
      networkConnection: (isConnected ? true : false)
    });

    NetInfo.isConnected.removeEventListener('connectionChange', handleConnectivityChange);
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
    this.setModalVisible(true);
    ToastAndroid.show('Opened modal.', ToastAndroid.SHORT);
  }
}
