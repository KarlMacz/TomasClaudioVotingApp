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

import Navbar from './partials/Navbar';
import GroupedModals from './partials/GroupedModals';

import styles from './../styles/Styles';
import customStyles from './../styles/HomeStyles';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home'
  };

  constructor(props) {
    super(props);

    AsyncStorage.getItem('auth').then((result) => {
      if(result === null) {
        this.props.navigation.navigate('Login');
      }
    });

    this.state = {
      connectivityModalVisible: false,
      statusModalVisible: false,
      loaderModalVisible: false,
      networkConnection: false
    };

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
          <Text>{JSON.stringify(this.props)}</Text>
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
}
