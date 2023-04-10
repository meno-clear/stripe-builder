import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Text, Platform } from 'react-native';
import api_client from "../../config/api_client";
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../../context/auth';
// import { Container } from './styles';

export const CheckoutButton = ({ checkout, navigation }) => {
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async () => {
    const {
      payment_intent,
      ephemeralKey,
      customer_id,
    } = checkout;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Builder Markets",
      customerId: customer_id,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: payment_intent['client_secret'],
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      googlePay: Platform.OS === 'android' && {
        merchantCountryCode: 'US',
        testEnv: true,      
      },
      defaultBillingDetails: {
        name: user.first_name + ' ' + user.last_name,
      }
    });

    console.log(error);

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    const { payment_id } = checkout;
    console.log(error);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      try{
        const response = await api_client.put(`/payments/${payment_id}/confirm`)
        if (response){
          Alert.alert('Success', 'Payment has been confirmed');
          navigation.goBack();
        }
      }catch{
        Alert.alert('Error', 'Payment has not been confirmed');
      }
    }
    
  };


  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
      <TouchableOpacity
        variant="primary"
        disabled={!loading}
        onPress={openPaymentSheet}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          borderWidth: 1,
          alignItems: 'center',
          width: '80%',
          padding: 15,
          borderRadius: 6,
          opacity: !loading && 0.5,
          backgroundColor: !loading ? '#ccc': '#2196F3',
          borderColor: !loading ? '#ccc': '#2196F3',
        }}
      >
        <Text style={{
          color: '#fff',
          fontWeight:'bold'
        }}>Pay</Text>
      </TouchableOpacity>
  )
}
