import React, { useEffect, useState, useRef } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Modal, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import PricesModal from './modal/prices';
import api_client from '../../config/api_client';
// import { Container } from './styles';


function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const cardFormModalizeRef = useRef(null);

  const fetchPlans = async () => {
    setLoading(true);
    try{
      const {data} = await api_client.get('/plans');
      setPlans(data);
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  const fetchPrices = async () => {
    setLoading(true);
    try{
      const {data} = await api_client.get(`/plans/${selectedPlan.id}`);
      setPrices(data);
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [])

  useEffect(() => {
    if(selectedPlan){
      fetchPrices();
    }
  }, [selectedPlan])

  const Item = (plan) => (
    <TouchableOpacity 
      key={plan.id} 
      style={[styles.item, {borderColor: plan.id === selectedPlan?.id ? '#2196F3' : '#393939'  }]} 
      onPress={() => setSelectedPlan(plan.id === selectedPlan?.id ? null : plan )} >
      <View>
          <Image source={{uri: plan.images[0]}} style={{width: 100, height: 100}} />
      </View>
      <View style={{width:'70%', alignItems:'center'}}>
        <Text style={[styles.title, { color: plan.id === selectedPlan?.id ? '#2196F3' : '#393939'}]}>{plan.name}</Text>
        <Text style={styles.text}>{plan.description}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading && !plans) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, {opacity: modalVisible ? 0.5 : 1 }]}>
      <FlatList
        style={styles.list_item}
        data={plans}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => Item(item)}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => <View style={{alignItems:'center'}}><Text style={styles.title} >Plans not found.</Text></View>}
      />
      { selectedPlan &&
        <TouchableOpacity style={[styles.button, styles.selectButton, { backgroundColor: loading ? '#ccc' : '#2196F3' }]} onPress={() => cardFormModalizeRef.current?.open()} disabled={loading}>
          {
            loading ? <ActivityIndicator size="small" color="#2196F3" />
            :
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>See Prices</Text>
          }
        </TouchableOpacity>
      }
      <PricesModal ref={cardFormModalizeRef} plan={selectedPlan} prices={prices} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 60,
  },
  list_item: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  item: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    padding: 20,
    flexDirection: 'row', 
    borderRadius: 8,
    gap: 10,
    marginVertical: 10,
    height: 200,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#393939',
    textAlign: 'center',
    marginTop: 10,
  },
  button:{
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
  selectButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 0,
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

export default Plans;