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

import Button from './Button';

import {Colors} from './../../styles/Colors';
import styles from './../../styles/Styles';

export default class Navbar extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "#4c9261",
          elevation: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          shadowColor: '#222222',
          shadowOffset: {
            height: 2,
            width: 0
          },
          shadowOpacity: 0.25,
          shadowRadius: 2,
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
          <Button
            title={(
              <FontAwesome
                style={{
                  color: 'white',
                  fontSize: 20
                }}
                name="bars" />
            )}
            type="primary"
            onPress={this.props.onMenuPress} />
        </View>
      </View>
    );
  }
}
