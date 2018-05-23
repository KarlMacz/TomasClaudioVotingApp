import {StyleSheet} from 'react-native';

const dangerColor = '#c73a4e';
const infoColor = '#5c8dbf';
const successColor = '#5abf79';
const primaryColor = '#4c9261';
const warningColor = '#eacf6c';

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
    backgroundColor: primaryColor,
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
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    flex: 1,
    padding: 15
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    width: '100%'
  },
  promptBoxDanger: {
    backgroundColor: dangerColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  promptBoxInfo: {
    backgroundColor: infoColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  promptBoxSuccess: {
    backgroundColor: successColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  promptBoxWarning: {
    backgroundColor: warningColor,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  }
});
