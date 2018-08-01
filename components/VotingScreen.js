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

export default class VotingScreen extends Component {
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
  }

  radio(props) {
  }

  render() {
    this.dynamicElements = (this.positions === null || this.candidates === null ? (
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
                    if(this.selectedCandidates[item.name].id === item2.id) {
                      return (
                        <TouchableOpacity
                          key={index2}
                          style={[
                            {
                              borderColor: Colors.primaryColor,
                              borderWidth: 2,
                              marginBottom: 5
                            }
                          ]}
                          onPress={() => {
                            this.selectedCandidates[item.name].id = null;

                            this.forceUpdate();
                          }}>
                          {item2.candidacy_image !== null ? (
                            <Cardboard
                              imageSource={{
                                uri: Config.server_url + '/' + item2.candidacy_image
                              }}
                              title={item2.full_name}
                              additionalStyle={{
                                width: 125
                              }}></Cardboard>
                          ) : (
                            <Cardboard
                              imageSource={item2.gender === 'Female' ? (require('./../assets/img/female.png')) : (require('./../assets/img/male.png'))}
                              title={item2.full_name}
                              additionalStyle={{
                                width: 125
                              }}></Cardboard>
                          )}
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          key={index2}
                          style={[
                            {
                              borderColor: 'transparent',
                              borderWidth: 2,
                              marginBottom: 5
                            }
                          ]}
                          onPress={() => {
                            this.selectedCandidates[item.name].id = item2.id;

                            this.forceUpdate();
                          }}>
                          {item2.candidacy_image !== null ? (
                            <Cardboard
                              imageSource={{
                                uri: Config.server_url + '/' + item2.candidacy_image
                              }}
                              title={item2.full_name}
                              additionalStyle={{
                                width: 125
                              }}></Cardboard>
                          ) : (
                            <Cardboard
                              imageSource={item2.gender === 'Female' ? (require('./../assets/img/female.png')) : (require('./../assets/img/male.png'))}
                              title={item2.full_name}
                              additionalStyle={{
                                width: 125
                              }}></Cardboard>
                          )}
                        </TouchableOpacity>
                      );
                    }
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
            title="Submit Votes"
            type="primary"
            onPress={() => {
              this.requestSubmitVotes();
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
          <Text>Note: Your votes will only be recorded once you press the "Send Votes" button. Please double check your votes before sending it. You can only send your votes once.</Text>
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
    this.setState({
      loaderModalVisible: true
    });

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
      this.setState({
        loaderModalVisible: false
      });

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
      this.setState({
        loaderModalVisible: false
      });

      if(response.status === 'ok') {
        AsyncStorage.setItem('electionCandidates', JSON.stringify(response.data));
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    }).catch((err) => {
      this.setState({
        loaderModalVisible: false
      });

      ToastAndroid.show('An error has occurred while submitting your request.', ToastAndroid.SHORT);
    });
  }

  requestSubmitVotes() {
    var candidatesSelected = [];

    for(var index in this.selectedCandidates) {
      if(this.selectedCandidates[index].id !== null) {
        candidatesSelected.push(this.selectedCandidates[index].id);
      }
    }

    console.log(candidatesSelected);

    this.setState({
      loaderModalVisible: true
    });

    setTimeout(() => {
      fetch(Config.server_url + '/api/json/data/submit_votes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_key: Config.app_key,
          account: this.auth.id,
          candidates: candidatesSelected
        })
      }).then((resp) => resp.json()).then((response) => {
        this.setState({
          loaderModalVisible: false
        });

        if(response.status === 'ok') {
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
          
          this.props.navigation.navigate('Ranking');
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
    }, 2000);
  }
}
