import React, {Component,Children} from 'react';
import {
  /*
  * Components
  */
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import {Colors} from './../../styles/Colors';
import styles from './../../styles/Styles';

export default class Cardboard extends Component {
  static defaultProps = {
    imageSources: '',
    title: '',
    subtitle: '',
    additionalStyle: {}
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[{
          padding: 2
        }, this.props.additionalStyle]}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            elevation: 2,
            shadowColor: '#222',
            shadowOffset: {
              height: 2,
              width: 0
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            padding: 10,
            width: '100%'
          }}>
          {this.props.imageSources === '' ? null : (
            <View>
              <Image
                style={{
                  borderColor: '#eee',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  borderWidth: 1,
                  marginBottom: 10,
                  height: 200,
                  width: '100%'
                }}
                source={this.props.imageSource} />
            </View>
          )}
          {this.props.title === '' ? null : (
            <View>
              <Text
                style={{
                  color: Colors.primaryColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: (this.props.subtitle === '' ? 10 : null)
                }}>{this.props.title}</Text>
            </View>
          )}
          {this.props.subtitle === '' ? null : (
            <View>
              <Text
                style={{
                  fontSize: 10,
                  marginBottom: 10
                }}>{this.props.subtitle}</Text>
            </View>
          )}
          <View
            style={{
              flex: 1
            }}>
            {this.props.children}
          </View>
        </View>
      </View>
    );
  }
}
