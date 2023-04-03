import { useState, useCallback, useEffect } from 'react';
import CheckBox from '@react-native-community/checkbox';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function VariantFormPage({route}) {
  const navigation = useNavigation();

  const [errors, setErrors] = useState({});
  
  const [price_in_cents, setPriceInCents] = useState('');
  
  const [variants, setVariants] = useState([]);
  const [variantDescriptors, setVariantDescriptors] = useState([]);

  const product_id = route?.params?.product_id;

  async function getVariants() {
    try {
      const res = await api_client.get('/variant_descriptors');
      setVariants(res.data);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getVariants();
  }, [])
  

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.id) {
        api_client.get(`variants/${route?.params?.id}`).then((response) => {
          
          setPriceInCents(`${response.data.price_in_cents}`);
          
          setVariantDescriptors(response.data.descriptors);
          
        });
      }
      else {
        resetFields();
      }
    }, [route])
   )

  function resetFields() {
    
      setPriceInCents('');
    
    setVariantDescriptors([]);
    
  }

  const handleSubmit = () => {
    const variant = {
      
      price_in_cents: price_in_cents,
      
      product_id,
      variant_descriptor_values_attributes: variantDescriptors,
      
    };

    if (route?.params?.id) {
      api_client.put(`variants/${route?.params?.id}`, variant).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('VariantList', {id: product_id});
        }
      });
    } else {
      api_client.post('variants', variant).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('VariantList', {id: product_id});
        }
      });
    }
  };

  function setDescriptorsVariants(index, value) {
    let newDescriptors = variantDescriptors;
    newDescriptors[index] = {...newDescriptors[index], ...value, product_id};
    setVariantDescriptors([...newDescriptors]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Variant Form</Text>

      {variants && variants.map((variant, index) =>
        variant.value_type !== 'boolean' ?
          <TextInput
            key={index}
            style={styles.input}
            placeholder={variant.name}
            value={variantDescriptors[index]?.value}
            onChangeText={(value) => setDescriptorsVariants(index, {variant_descriptor_id: variant.id, value})}
          />
          :
          <View key={index} style={styles.checkBox}>
            <Text>
              {variant.name}
            </Text>
            <CheckBox
              value={variantDescriptors[index]?.boolean_value}
              onValueChange={(boolean_value) => setDescriptorsVariants(index, {variant_descriptor_id: variant.id, boolean_value})}
            />
          </View>
      )}
        
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

          {/* REMOVE LINES
        
          <TextInput
            type='text'
            name='value_type'
            id='value_type'
            placeholder='Value type'
            style={styles.input}
            value={value_type}
            onChangeText={(value_type) => setValueType(value_type)}
          />
          {errors.value_type && <p>{errors.value_type}</p>}

          */}
        

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
    paddingHorizontal: 20,
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
  checkBox: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  input: {
    marginTop: 10,
    borderRadius: 20,
    width: '100%',
    height: 56,
    borderColor: '#bbb',
    padding: 10,
    paddingLeft: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
  }
})
