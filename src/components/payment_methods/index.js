import React, { useEffect, useState, forwardRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CardForm, useStripe } from '@stripe/stripe-react-native';
import api_client from '../../config/api_client';
import { FlatList } from 'react-native-gesture-handler';
import { Brand } from '../../components/brand';
import { useAuth } from '../../context/auth';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
// import { Container } from './styles';

const PaymentMethods = forwardRef(({ price }, ref) => {
  const [validateCard, setValidateCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null)
  const { createPaymentMethod } = useStripe();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { user } = useAuth();
  const { promiseInProgress } = usePromiseTracker();

  const fetchPaymentMethods = async () => {
    try {
      const response = await api_client.get('/payment_methods');
      setPaymentMethods(response.data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const addNewPaymentMethod = async () => {
    try {
      const { paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: user.email,
            name: user.first_name + ' ' + user.last_name
          }
        }
      })
      await api_client.post('/payment_methods', { payment_method: { id: paymentMethod.id } })
      Alert.alert('Sucesso', 'Cartão adicionado com sucesso')
      fetchPaymentMethods();
    } catch (error) {
      Alert.alert('Erro', error.message)
    }
  }

  const createSubscription = async () => {
    try {
      const response = await api_client.post('/subscriptions', { subscription: { price_id: price?.id, payment_method_id: paymentMethod?.id } })
      ref.current?.close();
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    trackPromise(
      fetchPaymentMethods()
    )
  }, [])

  return (
    <>
      <View style={{ height: '100%', width: '100%' }}>
        <View style={{ height: 200, width: '100%', marginBottom: 30, alignItems: 'flex-end' }}>
          <CardForm
            style={{
              width: '100%',
              height: '70%',
              marginVertical: 20,
            }}
            cardStyle={{
              borderWidth: 1,
            }}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            onFormComplete={async (cardDetails) => {
              setValidateCard(cardDetails.complete)
            }}
          />
          <TouchableOpacity onPress={() => trackPromise(addNewPaymentMethod())} style={[styles.button, { backgroundColor: validateCard ? '#2196f3' : '#ccc' }]}>
            <Text style={{ color: '#f2f2f2', fontWeight: 'bold' }} >Adicionar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={paymentMethods}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%', marginTop: 25 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setPaymentMethod(item)}
              style={[styles.card, { backgroundColor: item.card?.brand === 'visa' ? '#f9f9f9' : '#0e2cf9', borderWidth: paymentMethod?.card?.last4 === item.card?.last4 ? 1 : 0, borderColor: '#2196f3' }]}>
              <View>
                <Brand name={item?.card?.brand} />
                <Text style={{ color: item.card?.brand === 'visa' ? '#393939' : '#fff', fontWeight: 'bold' }}>**** **** **** {item.card?.last4}</Text>
              </View>
            </TouchableOpacity>
          )} />
      </View>
      <TouchableOpacity
        onPress={() => trackPromise(createSubscription())}
        disabled={promiseInProgress || !paymentMethod?.card}
        style={[styles.button, { backgroundColor: paymentMethod?.card || promiseInProgress ? '#2196f3' : '#ccc', width: '100%' }]}>
        {
          promiseInProgress ? <ActivityIndicator color="#fff" />
            :
            <Text style={{ color: '#f2f2f2', fontWeight: 'bold' }} >
              Pay
            </Text>
        }
      </TouchableOpacity>
    </>
  )
})
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    width: '50%',
    padding: 15,
    borderRadius: 6,
    height: 50,
    alignItems: 'center',
  },
  card: {
    height: 100,
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    width: 150,
  }
})

export default PaymentMethods;