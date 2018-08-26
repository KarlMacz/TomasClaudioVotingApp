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
  RefreshControl,
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

export default class VoteHistoryScreen extends Component {
  static navigationOptions = {
    drawerLabel: () => null
  };

  constructor(props) {
    super(props);

    this.auth = [];
    this.positions = [];
    this.candidates = [];
    this.selectedCandidates = [];
    this.isResultsReleased = 0;

    this.state = {
      refreshing: false,
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false,
      dynamicElements: (
        <View>
          <Cardboard
            additionalStyle={{
              marginTop: 10
            }}>
            <View>
              <ActivityIndicator size="large" />
              <Text
                style={{
                  textAlign: 'center'
                }}>Loading contents. Please wait...</Text>
            </View>
          </Cardboard>
          <Cardboard
            additionalStyle={{
              marginTop: 10
            }}>
            <View>
              <Text>If this page got stuck loading content, pull down to refresh.</Text>
            </View>
          </Cardboard>
        </View>
      )
    };

    this.requestData();
    this.requestSettings();

    this.dataInterval = setInterval(() => {
      this.requestData();
      this.requestSettings();
    }, 5000);

    this.handlePage();

    AsyncStorage.getItem('auth').then((result) => {
      if(result === null) {
        this.props.navigation.navigate('Login');
      } else {
        this.auth = JSON.parse(result);
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
    return (
      <View
        style={styles.body}>
        <Navbar
          title="Worthy Votes"
          onMenuPress={() => {
            this.props.navigation.openDrawer();
          }} />
        <ScrollView
          contentContainerStyle={{
            padding: 15
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({
                  refreshing: true
                });

                this.requestData();

                setTimeout(() => {
                  this.handlePage();
                  
                  this.setState({
                    refreshing: false
                  });
                }, 2000);
              }}/>
          }>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>My Votes</Text>
          <Text>These are the candidates you have voted for.</Text>
          <View>{this.state.dynamicElements}</View>
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

  handlePage() {
    AsyncStorage.getItem('electionVotedCandidates').then((result) => {
      if(result !== null) {
        this.candidates = JSON.parse(result);

        this.setState({
          dynamicElements: this.candidates.length === 0 ? (
            <View>
              <Cardboard
                additionalStyle={{
                  marginTop: 10
                }}>
                <View>
                  <ActivityIndicator size="large" />
                </View>
              </Cardboard>
              <Cardboard
                additionalStyle={{
                  marginTop: 10
                }}>
                <View>
                  <Text>If this page got stuck loading content, pull down to refresh.</Text>
                </View>
              </Cardboard>
            </View>
          ) : (
            <View>
              <View>{this.candidates.map((item, index2) => {
                if(item.candidacy_image !== null) {
                  return (
                    <Cardboard
                      key={index2}
                      imageSource={{
                        uri: Config.server_url + '/' + item.candidacy_image
                      }}
                      title={item.full_name}
                      subtitle={item.party + ' Party'}
                      additionalImageSource={{
                        height: 200
                      }}>
                      <Text
                        style={{
                          textAlign: 'center'
                        }}>{item.year_level + ' - ' + item.course}</Text>
                    </Cardboard>
                  );
                } else {
                  return (
                    <Cardboard
                      key={index2}
                      imageSource={item.gender === 'Female' ? (require('./../assets/img/female.png')) : (require('./../assets/img/male.png'))}
                      title={item.full_name}
                      subtitle={item.party + ' Party'}
                      additionalStyle={{
                        width: 125
                      }}
                      additionalImageSource={{
                        height: 200
                      }}>
                      <Text
                        style={{
                          textAlign: 'center'
                        }}>{item.year_level + ' - ' + item.course}</Text>
                    </Cardboard>
                  );
                }
              })}</View>
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
          )
        });
      }
    });
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
    fetch(Config.server_url + '/api/json/data/votes_history', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: Config.app_key,
        username: this.auth.username
      })
    }).then((resp) => resp.json()).then((response) => {
      if(response.status === 'ok') {
        AsyncStorage.setItem('electionVotedCandidates', JSON.stringify(response.data));
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while submitting your request. ' + err, ToastAndroid.SHORT);
    });
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
          if(settings[index].name === 'is_results_released') {
            if(this.isResultsReleased !== settings[index].value) {
              this.forceUpdate();
            }

            this.isResultsReleased = settings[index].value;
          }
        }
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });
  }
}
