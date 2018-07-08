import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  AsyncStorage,
  NetInfo,
  ToastAndroid,

  /*
  * Components
  */
  ActivityIndicator,
  ToolbarAndroid,
  Button,
  Image,
  Modal,
  StatusBar,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import moment from 'moment';
import 'moment-duration-format';

import {Config} from './../Config';

import Navbar from './partials/Navbar';
import GroupedModals from './partials/GroupedModals';
import Cardboard from './partials/Cardboard';

import styles from './../styles/Styles';
import customStyles from './../styles/HomeStyles';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home'
  };

  constructor(props) {
    super(props);

    this.rvtInterval = null;

    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false,
      remainingVotingTime: null
    };

    AsyncStorage.getItem('auth').then((result) => {
      if(result === null) {
        this.props.navigation.navigate('Login');
      }
    });

    this.requestSettings();

    setInterval(() => {
      this.requestSettings();
    }, 15000);

    if(this.rvtInterval === null) {
      this.rvtInterval = setInterval(() => {
        this.setState({
          remainingVotingTime: moment.duration(moment(this.electionUntil).diff(moment())).format('HH:mm:ss', {
            trim: false
          })
        });

        if(this.state.remainingVotingTime.indexOf('-') === 0) {
          this.setState({
            remainingVotingTime: '00:00:00'
          });
        }

        if(this.state.remainingVotingTime === '00:00:00') {
          // clearInterval(this.rvtInterval);
        }
      }, 1000);
    }

    StatusBar.setBackgroundColor('rgba(34, 34, 34, 0.5)');
    StatusBar.setTranslucent(true);
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

    clearInterval(this.rvtInterval);
  }

  render() {
    return (
      <View
        style={styles.body}>
        <Navbar
          title="Worthy Votes"
          onMenuPress={() => {
            this.props.navigation.openDrawer();
          }} />
        <ScrollView
          style={customStyles.body}>
          <Cardboard
            additionalStyle={{
              marginBottom: 10
            }}>
            {this.state.remainingVotingTime === null ? (
                <View>
                  <ActivityIndicator size="large" />
                </View>
              ) : (
              this.state.remainingVotingTime === '00:00:00' ? (
                <View>
                  <Text
                    style={{
                      textAlign: 'center'
                    }}>VOTING IS NOW OVER.</Text>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: 5
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: 'center'
                    }}>ELECTION ENDS IN:</Text>
                  <Text
                    style={{
                      fontSize: 50,
                      textAlign: 'center'
                    }}>{this.state.remainingVotingTime}</Text>
                </View>
              )
            )}
          </Cardboard>
          {this.state.remainingVotingTime === '00:00:00' || this.state.remainingVotingTime === null ? null : (
            <Cardboard
              additionalStyle={{
                marginBottom: 10
              }}>
              <View>
                <Text
                  style={{
                    textAlign: 'center'
                  }}></Text>
              </View>
            </Cardboard>
          )}
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem aliquam voluptas consequuntur obcaecati cum nobis nihil corporis quidem voluptatem, in nostrum eveniet fuga a maiores reprehenderit maxime. Inventore dolorum, maxime!</Text>
        </ScrollView>
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

  requestSettings() {
    fetch(Config.server_url + '/api/json/data/settings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: Config.app_key
      })
    }).then((resp) => resp.json()).then((response) => {
      if(response.status === 'ok') {
        var settings = response.data;

        for(var index in settings) {
          if(settings[index].name === 'election_until') {
            this.electionUntil = settings[index].value;
          }
        }
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while trying to make a request.', ToastAndroid.SHORT);
    });
  }
}
