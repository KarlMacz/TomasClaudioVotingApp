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

import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
            }}>Ranking</Text>
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
    var cc = 0;

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

        this.setState({
          dynamicElements: this.positions.length === 0 || this.candidates.length === 0 ? (
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
              {this.positions.map((item, index) => {
                cc = 0;

                return (
                  <View
                    key={index}>
                    <Text
                      key={index}
                      style={{
                        fontSize: 20,
                        marginTop: 10
                      }}>{item.name}</Text>
                    <ScrollView
                      horizontal={true}>{this.candidates.map((item2, index2) => {
                        if(item2.position == item.name) {
                          cc++;

                          if(this.isResultsReleased == 1) {
                            if(item2.candidacy_image !== null) {
                              if(cc === 1) {
                                return (
                                  <Cardboard
                                    key={index2}
                                    imageSource={{
                                      uri: Config.server_url + '/' + item2.candidacy_image
                                    }}
                                    title={item2.full_name}
                                    footer={(
                                      <Text
                                        style={{
                                          color: Colors.primaryColor,
                                          fontSize: 20,
                                          fontWeight: 'bold',
                                          textAlign: 'center'
                                        }}>
                                        <FontAwesome
                                          name="check" /> Winner
                                      </Text>
                                    )}
                                    additionalStyle={{
                                      width: 175
                                    }}
                                    additionalImageSource={{
                                      height: 175
                                    }}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                      }}>{item2.number_of_votes_percentage}</Text>
                                    <View
                                      style={{
                                        marginTop: 5
                                      }}>
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          textAlign: 'center'
                                        }}>{item2.year_level}</Text>
                                      <Text
                                        style={{
                                          textAlign: 'center'
                                        }}>{item2.course}</Text>
                                    </View>
                                  </Cardboard>
                                );
                              } else {
                                return (
                                  <Cardboard
                                    key={index2}
                                    imageSource={{
                                      uri: Config.server_url + '/' + item2.candidacy_image
                                    }}
                                    title={item2.full_name}
                                    additionalStyle={{
                                      width: 125
                                    }}
                                    imageBlur={true}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                      }}>{item2.number_of_votes_percentage}</Text>
                                    <View
                                      style={{
                                        marginTop: 5
                                      }}>
                                      <Text
                                        style={{
                                          fontWeight: 'bold',
                                          textAlign: 'center'
                                        }}>{item2.year_level}</Text>
                                      <Text
                                        style={{
                                          textAlign: 'center'
                                        }}>{item2.course}</Text>
                                    </View>
                                  </Cardboard>
                                );
                              }
                            } else {
                              return (
                                <Cardboard
                                  key={index2}
                                  imageSource={item2.gender === 'Female' ? (require('./../assets/img/female.png')) : (require('./../assets/img/male.png'))}
                                  title={item2.full_name}
                                  additionalStyle={{
                                    width: 125
                                  }}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      textAlign: 'center'
                                    }}>{item2.number_of_votes_percentage}</Text>
                                  <View
                                    style={{
                                      marginTop: 5
                                    }}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                      }}>{item2.year_level}</Text>
                                    <Text
                                      style={{
                                        textAlign: 'center'
                                      }}>{item2.course}</Text>
                                  </View>
                                </Cardboard>
                              );
                            }
                          } else {
                            return (
                              <Cardboard
                                key={index2}
                                imageSource={require('./../assets/img/questionable.png')}
                                title={'Candidate ' + (cc)}
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
