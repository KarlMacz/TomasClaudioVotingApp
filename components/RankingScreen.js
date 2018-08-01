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
import Button from './partials/Button';

import {Colors} from './../styles/Colors';
import styles from './../styles/Styles';
import customStyles from './../styles/VotingStyles';

export default class RankingScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };

  constructor(props) {
    super(props);

    this.auth = [];
    this.positions = [];
    this.candidates = [];
    this.selectedCandidates = [];
    this.dynamicElements = null;

    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false
    };

    this.requestData();

    this.dataInterval = setInterval(() => {
      this.requestData();
    }, 5000);

    AsyncStorage.getItem('auth').then((result) => {
      if(result === null) {
        this.props.navigation.navigate('Login');
      } else {
        this.auth = JSON.parse(result);
      }
    });

    AsyncStorage.getItem('electionPositions').then((result) => {
      if(result !== null) {
        this.positions = JSON.parse(result);

        var pos = [];

        for(var index in this.positions) {
          this.selectedCandidates[this.positions[index].name] = {
            id: null,
            style: null
          };

          pos.push({
            position: this.positions[index].name,
            id: null
          });
        }

        this.state.selectedCandidates = pos;
      }
    });

    AsyncStorage.getItem('electionCandidates').then((result) => {
      if(result !== null) {
        this.candidates = JSON.parse(result);
      }
    });

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

    clearInterval(this.dataInterval);
  }

  render() {
    this.dynamicElements = (this.positions.length === 0 || this.candidates.length === 0 ? (
      <Cardboard
        additionalStyle={{
          marginTop: 10
        }}>
        <View>
          <ActivityIndicator size="large" />
        </View>
      </Cardboard>
    ) : (
      <View>
        {this.positions.map((item, index) => {
          return (
            <View
              key={index}>
              <Text
                key={index}
                style={{
                  fontSize: 20,
                  marginTop: 10
                }}>Running for {item.name}</Text>
              <ScrollView
                horizontal={true}>{this.candidates.map((item2, index2) => {
                  if(item2.position == item.name) {
                    return (
                      <Cardboard
                        imageSource={require('./../assets/img/questionable.png')}
                        title={'Candidate ' + (index2 + 1)}
                        additionalStyle={{
                          width: 125
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}>{item2.number_of_votes_percentage}</Text>
                      </Cardboard>
                    );
                  }
              })}</ScrollView>
            </View>
          );
        })}
        <View
          style={{
            marginTop: 15
          }}>
          <Button
            title="Go back to Home"
            type="primary"
            onPress={() => {
              this.props.navigation.navigate('Home');
            }} />
        </View>
      </View>
    ));

    return (
      <View
        style={styles.body}>
        <Navbar
          title="Worthy Votes"
          onMenuPress={() => {
            this.props.navigation.openDrawer();
          }} />
        <ScrollView
          style={customStyles.body}
          contentContainerStyle={{
            paddingBottom: 30
          }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>Ranking</Text>
          <View>{this.dynamicElements}</View>
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
      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });

    fetch(Config.server_url + '/api/json/data/results', {
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
