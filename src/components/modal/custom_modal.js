import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CustomModal = ({ show, onClose, title, children }) => {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={show}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={{position: 'absolute', right: 0, margin: 10}}>
            <Icon name="x" size={32} color="#d3d3d3" />
          </TouchableOpacity>
          <Text style={styles.modalText}>{title}</Text>
          {children}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: '90%',
    height: '50%',
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 35,
    paddingTop: 46,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 24
  }
});

export default CustomModal;