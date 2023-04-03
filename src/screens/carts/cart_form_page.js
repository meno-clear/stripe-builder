import { useState, useCallback } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function CartFormPage({route}) {
  const navigation = useNavigation();

  const [errors, setErrors] = useState({});
  
  const [total, setTotal] = useState('');
  
  const [price_in_cents, setPriceInCents] = useState('');
  

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.id) {
        api_client.get(`carts/${route?.params?.id}`).then((response) => {
          
          setTotal(`${response.data.total}`);
          
          setPriceInCents(`${response.data.price_in_cents}`);
          
        });
      }
      else {
        resetFields();
      }
    }, [route])
   )

  function resetFields() {
    
      setTotal('');
    
      setPriceInCents('');
    
  }

  const handleSubmit = () => {
    const cart = {
      
      total: total,
      
      price_in_cents: price_in_cents
      
    };

    if (route?.params?.id) {
      api_client.put(`carts/${route?.params?.id}`, cart).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('CartList');
        }
      });
    } else {
      api_client.post('carts', cart).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('CartList');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart Form</Text>
        
          <TextInput
            type='text'
            name='total'
            id='total'
            placeholder='Total'
            style={styles.input}
            value={total}
            onChangeText={(total) => setTotal(total)}
          />
          {errors.total && <p>{errors.total}</p>}
        
          <TextInput
            type='text'
            name='price_in_cents'
            id='price_in_cents'
            placeholder='Price in cents'
            style={styles.input}
            value={price_in_cents}
            onChangeText={(price_in_cents) => setPriceInCents(price_in_cents)}
          />
          {errors.price_in_cents && <p>{errors.price_in_cents}</p>}
        

        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 20 }}>
          <TouchableOpacity style={styles.backButton} onPress={(e) => [resetFields(), navigation.goBack()]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => [resetFields(), handleSubmit()]}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#4286f4',
  },
  backButton: {
    marginTop: 10,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
  input: {
    marginTop: 10,
    borderRadius: 20,
    width: '90%',
    height: 40,
    borderColor: '#bbb',
    padding: 10,
    paddingLeft: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
  }
})
