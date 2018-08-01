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

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home'
  };

  constructor(props) {
    super(props);

    this.auth = [];
    this.rvtInterval = null;

    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false,
      isElectionStarted: null,
      remainingVotingTime: null
    };

    this.requestAuth();
    this.requestSettings();

    AsyncStorage.getItem('auth').then((result) => {
      if(result === null) {
        this.props.navigation.navigate('Login');
      } else {
        this.auth = JSON.parse(result);
      }
    });

    setInterval(() => {
      this.requestSettings();
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
          {this.auth.hasVoted !== 1 && this.state.remainingVotingTime !== null && this.state.remainingVotingTime !== '00:00:00' && this.state.isElectionStarted == 1 ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Voting');
              }}>
              <Cardboard
                additionalStyle={{
                  marginBottom: 10
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 30,
                      textAlign: 'center'
                    }}>Vote Now</Text>
                  <Text
                    style={{
                      textAlign: 'center'
                    }}>Tap here to start voting.</Text>
                </View>
              </Cardboard>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
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
          } else if(settings[index].name === 'is_election_started') {
            this.setState({
              isElectionStarted: settings[index].value
            });
          }
        }
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });
  }

  requestAuth() {
    var username = this.auth.username;

    fetch(Config.server_url + '/api/json/auth', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: Config.app_key,
        username: username
      })
    }).then((resp) => resp.json()).then((response) => {
      this.setState({
        loaderModalVisible: false
      });

      if(response.status === 'ok') {
        AsyncStorage.setItem('auth', JSON.stringify(response.data));
      }
    }).catch((err) => {
      this.setState({
        loaderModalVisible: false
      });

      console.log(err);
      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });
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
      this.setState({
        loaderModalVisible: false
      });

      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
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
        AsyncStorage.setItem('electionCandidates', JSON.stringify(response.data));
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });
  }
}
