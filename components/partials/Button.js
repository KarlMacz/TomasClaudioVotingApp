import React, {Component} from 'react';
import {
  /*
  * Components
  */
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import {Colors} from './../../styles/Colors';
import styles from './../../styles/Styles';

export default class Button extends Component {
  static defaultProps = {
    title: '',
    type: 'default',
    onPress: () => {}
  };

  constructor(props) {
    super(props);

    switch(this.props.type) {
      case 'primary':
        this.buttonStyle = styles.buttonPrimary;
        this.buttonUnderlay = Colors.primaryColorActive;
        this.buttonContentStyle = styles.buttonContent;

        break;
      case 'link':
        this.buttonStyle = styles.buttonLink;
        this.buttonContentStyle = styles.buttonContentLink;

        break;
      default:
        this.buttonStyle = styles.buttonDefault;
        this.buttonUnderlay = Colors.light;
        this.buttonContentStyle = styles.buttonContentDark;

        break;
    }
  }

  render() {
    if(this.props.type === 'link') {
      return (
        <TouchableOpacity
          style={this.buttonStyle}
          accessibilityTraits="link"
          onPress={this.props.onPress}>
          <View>
            <Text
              style={this.buttonContentStyle}>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableHighlight
          style={this.buttonStyle}
          onPress={this.props.onPress}
          underlayColor={this.buttonUnderlay}>
          <View>
            <Text
              style={this.buttonContentStyle}>{this.props.title}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }
}
