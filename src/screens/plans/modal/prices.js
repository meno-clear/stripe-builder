import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { FlatList } from 'react-native-gesture-handler';
import PaymentMethods from '../../../components/payment_methods';
import Icon from 'react-native-vector-icons/Feather';
import api_client from '../../../config/api_client';

// import { Container } from './styles';

const PricesModal = forwardRef(({ prices, plan }, ref) => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  return (
    <Modalize
      animationType="slide"
      snapPoint={300}
      modalHeight={showChoice ? 500 : 300}
      onClose={() => [setSelectedPrice(null), setShowChoice(false)]}
      modalStyle={{
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '100%',
      }}
      ref={ref}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          { showChoice ?
            <PaymentMethods ref={ref} price={selectedPrice}/>
            :
            <>
              <View style={{ alignItems: 'center', height: 160, width: '100%' }}>
                <Text style={styles.title}>{plan?.name}</Text>
                <FlatList
                  style={{ width: '100%', flexDirection:'row'}}
                  horizontal={true}
                  data={prices}
                  showsHorizontalScrollIndicator={false}
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
              <TouchableOpacity
                variant="primary"
                disabled={!selectedPrice}
                onPress={() => setShowChoice(true)}
                style={[styles.button,{
                  opacity: !selectedPrice  && 0.5,
                  backgroundColor: !selectedPrice  ? '#ccc' : '#2196F3',
                  borderColor: !selectedPrice ? '#ccc' : '#2196F3',
                }]}
              >
                <Text style={{
                  color: '#fff',
                  fontWeight: 'bold'
                }}>
                    Choice Payment Method
                </Text>
              </TouchableOpacity>
            </>
          }
        </View>
      </View>
    </Modalize>
  )
})

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 12,
    justifyContent: 'space-between',
    marginVertical: 10,
    height: 100,
    width: 100,
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
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 6,
    height: 50,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 400,
    width: '100%',
    padding: 10,
    alignItems: 'center',
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