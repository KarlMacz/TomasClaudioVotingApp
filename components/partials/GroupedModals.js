import React, {Component} from 'react';
import {
  /*
  * Components
  */
  ActivityIndicator,
  Modal,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import styles from './../../styles/Styles';

export default class GroupedModals extends Component {
  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.showLoader}
          onRequestClose={() => {}}>
          <View
            style={styles.modal}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                textAlign: 'center'
              }}>Please wait...</Text>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.showConnectivity}
          onRequestClose={() => {}}>
          <View
            style={{
              justifyContent: 'flex-end',
              height: '100%',
              width: '100%'
            }}>
            {(this.props.networkConnection ? (
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
          </View>
        </Modal>
      </View>
    );
  }
}
