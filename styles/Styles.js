import {StyleSheet} from 'react-native';

const dangerColor = '#c73a4e';
const infoColor = '#5c8dbf';
const successColor = '#5abf79';
const warningColor = '#eacf6c';

export default StyleSheet.create({
  body: {
    height: '100%',
    width: '100%'
  },
  container: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25
  },
  inputControl: {
    height: 40,
    width: '100%'
  },
  modal: {
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    flex: 1,
    padding: 15
  },
  notifModal: {
    padding: 15
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    width: '100%'
  },
  promptBoxDanger: {
    backgroundColor: dangerColor,
    color: 'white'
  },
  promptBoxInfo: {
    backgroundColor: infoColor,
    color: 'white'
  },
  promptBoxSuccess: {
    backgroundColor: successColor,
    color: 'white'
  },
  promptBoxWarning: {
    backgroundColor: warningColor,
    color: 'white'
  }
});
