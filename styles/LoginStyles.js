import {StyleSheet} from 'react-native';

import {Colors} from './Colors';

export default StyleSheet.create({
  header: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 450,
    marginTop: -591,
    marginLeft: -270,
    height: 900,
    width: 900
  },
  headerContent: {
    marginTop: 625,
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
    textShadowColor: '#222',
    textShadowOffset: {
      height: 2,
      width: 0
    },
    textShadowRadius: 4
  },
  body: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30
  },
  bodyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 'auto'
  },
  footer: {
    backgroundColor: '#f5f5f5',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    justifyContent: 'center',
    padding: 15
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center'
  },
  buttonLinkBlock: {
    marginTop: 10
  }
});
