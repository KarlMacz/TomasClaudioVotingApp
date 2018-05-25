import {StyleSheet} from 'react-native';

import {Colors} from './Colors';

export default StyleSheet.create({
  body: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%'
  },
  colorWhite: {
    color: 'white'
  },
  container: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  buttonPrimary: {
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: 4,
    padding: 15
  },
  buttonContent: {
    color: 'white',
    fontWeight: 'bold'
  },
  inputControl: {
    marginBottom: 5,
    height: 50,
    width: '100%'
  },
  modal: {
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 15
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    width: '100%'
  },
  promptBoxDanger: {
    backgroundColor: Colors.dangerColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  promptBoxInfo: {
    backgroundColor: Colors.infoColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  promptBoxSuccess: {
    backgroundColor: Colors.successColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  promptBoxWarning: {
    backgroundColor: Colors.warningColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  }
});
