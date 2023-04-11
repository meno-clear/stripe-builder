import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import { NewCardButton } from '../../../components/future_card_button';
import api_client from '../../../config/api_client';

// import { Container } from './styles';

const PricesModal = ({ modalVisible, closeModal, prices, plan }) => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={closeModal} style={{ position: 'absolute', right: 0, margin: 10 }}>
            <Icon name="x" size={32} color="#d3d3d3" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', height: '80%', width: '100%' }}>
            <Text style={styles.title}>{plan?.name}</Text>
            <FlatList
              style={{ width: '100%' }}
              data={prices}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, { borderColor: selectedPrice?.id === item.id ? '#2196F3' : '#393939' }]}
                  onPress={() => setSelectedPrice(selectedPrice?.id === item.id ? null : item)}>
                  <Text style={styles.text}>
                    {item?.interval_count}/{item?.interval}
                  </Text>
                  <Text style={[styles.text, { color: '#2196f3' }]}>
                    {item?.amount / 100}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => <View style={{ alignItems: 'center' }}><Text style={styles.title} >Prices not found.</Text></View>}
            />
          </View>
          <NewCardButton disabled={!selectedPrice} price={selectedPrice} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    padding: 20,
    flexDirection: 'row',
    borderRadius: 8,
    gap: 10,
    justifyContent: 'space-between',
    marginVertical: 10,
    height: 60,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#393939',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 400,
    width: '90%',
    padding: 35,
    justifyContent: 'space-between',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})


export default PricesModal;