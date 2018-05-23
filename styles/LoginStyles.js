import {StyleSheet} from 'react-native';

import {Fonts} from './Fonts';

const dangerColor = '#c73a4e';
const infoColor = '#5c8dbf';
const successColor = '#5abf79';
const primaryColor = '#4c9261';
const warningColor = '#eacf6c';

export default StyleSheet.create({
  header: {
    backgroundColor: primaryColor,
    borderRadius: 450,
    marginTop: -621,
    marginLeft: -270,
    height: 900,
    width: 900
  },
  headerContent: {
    marginTop: 648,
    marginLeft: 300,
    width: 300
  },
  headerLogo: {
    left: '50%',
    marginLeft: -75,
    height: 150,
    width: 150
  },
  headerTitleText: {
    color: 'white',
    fontFamily: 'Satisfy',
    fontSize: 50,
    textAlign: 'center',
    textShadowColor: '#222222',
    textShadowOffset: {
      height: 2,
      width: 0
    },
    textShadowRadius: 4
  },
  body: {
    flex: 1,
    padding: 30
  },
  footer: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 15
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center'
  },
  buttonLinkBlock: {
    alignItems: 'center',
    marginTop: 10
  },
  buttonLink: {
    padding: 5
  }
});
