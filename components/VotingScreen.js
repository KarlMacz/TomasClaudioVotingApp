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
  TouchableWithoutFeedback,
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

export default class VotingScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };

  constructor(props) {
    super(props);

    this.positions = null;
    this.candidates = null;

    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false
    };

    AsyncStorage.getItem('auth').then((result) => {
      if(result === null) {
        this.props.navigation.navigate('Login');
      }
    });

    this.requestData();

    setInterval(() => {
      this.requestData();

      var positions = [];
      var candidates = [];

      AsyncStorage.getItem('electionPositions').then((result) => {
        if(result !== null) {
          positions = result;
          
          this.setState({
            positionElm: (
              <View>
                {positions.map((pos) => {
                  return (
                    <View>
                      <Text
                        style={{
                          fontSize: 30
                        }}>Running for {pos}</Text>
                    </View>
                  );
                })}
                <Text>Test</Text>
              </View>
            )
          });
        }
      });

      AsyncStorage.getItem('electionPositions').then((result) => {
        if(result !== null) {
          candidates = result;
        }
      });
    }, 5000);

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
          <Text>Note: Your votes will only be recorded once you press the "Send Votes" button. Please double check your votes before sending it. You can only send your votes once.</Text>
          {this.state.positionElm}
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

  requestData() {
    fetch(Config.server_url + '/api/json/data/positions', {
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
        AsyncStorage.setItem('electionPositions', JSON.stringify(response.data));
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while trying to make a request.', ToastAndroid.SHORT);
    });

    fetch(Config.server_url + '/api/json/data/candidates', {
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
        AsyncStorage.setItem('electionPositions', JSON.stringify(response.data));
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while trying to make a request.', ToastAndroid.SHORT);
    });
  }
}
