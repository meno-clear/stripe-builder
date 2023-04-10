import React, { useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Container } from './styles';


function Plans() {
  const [selectedPlan, setSelectedPlan] = useState({});
  console.log(selectedPlan)
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 10,
      description: "Basic plan, for small businesses, startups and freelancers, with 1 user and 1 project",
    },
    {
      id: 2,
      name: "Premium",
      price: 20,
      description: "Premium plan, for medium businesses, with 5 users and 5 projects",
    },
    {
      id: 3,
      name: "Unlimited",
      price: 30,
      description: "Unlimited plan, for large businesses, with unlimited users and projects",
    }
  ]
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.list_item} showsVerticalScrollIndicator={false} >
        { 
          plans.map((plan, index) => (
            <TouchableOpacity key={plan.id} style={[styles.item, {borderColor: plan.id === selectedPlan?.id ? '#2196F3' : '#393939'  }]} onPress={() => setSelectedPlan(plan)} >
              <Text style={styles.title}>{plan.name}</Text>
              <Text style={[styles.title, {color: '#2196F3'}]}>R$ {plan.price},00</Text>
              <Text style={styles.text}>{plan.description}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>Select</Text>
      </TouchableOpacity>
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
    borderRadius: 8,
    marginVertical: 10,
    height: 200,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
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
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 0,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#2196F3',
  }
})

export default Plans;