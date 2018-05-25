import React, {Component} from 'react';
import {
  /*
  * Components
  */
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {Colors} from './../../styles/Colors';
import styles from './../../styles/Styles';

export default class Navbar extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "#4c9261",
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 10,
          height: 60,
          width: '100%'
        }}>
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
            width: '50%'
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Satisfy',
              fontSize: 20,
              paddingLeft: 15,
              paddingRight: 15
            }}>{this.props.title}</Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
            height: '100%',
            width: '50%'
          }}>
          <TouchableHighlight
            style={{
              alignItems: 'center',
              backgroundColor: Colors.primaryColor,
              borderRadius: 4,
              justifyContent: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              height: '100%'
            }}
            onPress={this.props.onMenuPress}
            underlayColor={Colors.primaryColorActive}>
            <FontAwesome
              style={{
                color: 'white',
                fontSize: 20
              }}
              name="bars" />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
