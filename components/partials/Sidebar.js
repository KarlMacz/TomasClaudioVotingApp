import React, {Component} from 'react';
import {
  /*
  * APIs
  */
  AsyncStorage,

  /*
  * Components
  */
  Image,
  ScrollView,
  Text,
  View
} from 'react-native';
import {
  DrawerItems,
  SafeAreaView
} from 'react-navigation';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: null,
      image: null,
      gender: null,
      type: null
    };

    AsyncStorage.getItem('auth').then((result) => {
      if(result !== null) {
        result = JSON.parse(result);

        let full_name = '';

        if(result.middle_name === null || result.middle_name === '') {
          full_name = result.first_name + ' ' + result.last_name;
        } else {
          full_name = result.first_name + ' ' + result.middle_name.substring(0, 1) + '. ' + result.last_name;
        }

        this.setState({
          full_name: full_name,
          image: result.image,
          gender: result.gender,
          type: result.type
        });
      }
    });
  }

  render() {
    return (
      <ScrollView>
        <SafeAreaView
          forceInset={{
            top: 'always',
            horizontal: 'never'
          }}>
          <View
            style={{
              backgroundColor: '#4c9261',
              paddingTop: 25,
              paddingBottom: 25,
              paddingLeft: 10,
              paddingRight: 10
            }}>
            {this.state.image === null ? (
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10
                }}>
                <Image
                  style={{
                    borderColor: '#5abf79',
                    borderRadius: 100,
                    borderWidth: 4,
                    height: 100,
                    width: 100
                  }}
                  source={this.state.gender === 'Female' ? (require('./../../assets/img/female.png')) : (require('./../../assets/img/male.png'))} />
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10
                }}>
                <Image
                  style={{
                    borderColor: '#5abf79',
                    borderRadius: 100,
                    borderWidth: 4,
                    height: 100,
                    width: 100
                  }}
                  source={{
                    uri: this.state.image
                  }} />
              </View>
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>{this.state.full_name}</Text>
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                textAlign: 'center'
              }}>{this.state.type}</Text>
          </View>
          <DrawerItems
            activeTintColor="#ffffff"
            activeBackgroundColor="#5abf79"
            itemsContainerStyle={{
              paddingVertical: 0
            }}
            itemStyle={{
              borderBottomColor: 'rgba(0, 0, 0, .04)',
              borderBottomWidth: 1
            }}
            {...this.props} />
        </SafeAreaView>
      </ScrollView>
    );
  }
}
