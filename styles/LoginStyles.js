import {StyleSheet} from 'react-native';

import {Colors} from './Colors';

export default StyleSheet.create({
  header: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 450,
    marginTop: -621,
    marginLeft: -270,
    height: 900,
    width: 900
  },
  headerContent: {
    marginTop: 675,
    marginLeft: 300,
    width: 300
  },
  headerLogo: {
    left: '50%',
    marginLeft: -50,
    height: 100,
    width: 100
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
    paddingVertical: 50
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
    alignItems: 'center',
    marginTop: 15
  }
});
