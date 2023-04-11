import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Text } from 'react-native';
import api_client from "../../config/api_client";
import { useStripe } from '@stripe/stripe-react-native';
// import { Container } from './styles';

export const NewCardButton = ({ price, disabled }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const fetchPaymentSheetParams = async () => {
    try{
      if (price){
        const {data} = await api_client.post(`/subscriptions`, {subscription: { price }})
        return data;
      }
    }catch{
      Alert.alert('Error', 'Payment has not been confirmed');
    }
  }

  const initializePaymentSheet = async () => {
    const {
      payment_intent,
      ephemeralKey,
      customer_id,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Builder Markets",
      customerId: customer_id,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: payment_intent
    });

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const {error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      try{
        // const response = await api_client.put(`/payments/${payment_id}/confirm`)
        Alert.alert('Success', 'New card has been added');
      }catch{
        Alert.alert('Error', 'Payment has not been confirmed');
      }
    }
    
  };


  useEffect(() => {
    if (price) initializePaymentSheet();
  }, [price]);

  return (
      <TouchableOpacity
        variant="primary"
        disabled={!loading || disabled}
        onPress={openPaymentSheet}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          borderWidth: 1,
          alignItems: 'center',
          width: '80%',
          padding: 15,
          borderRadius: 6,
          opacity: !loading || disabled && 0.5,
          backgroundColor: !loading || disabled ? '#ccc': '#2196F3',
          borderColor: !loading || disabled ? '#ccc': '#2196F3',
        }}
      >
        <Text style={{
          color: '#fff',
          fontWeight:'bold'
        }}>Pay</Text>
      </TouchableOpacity>
  )
}
