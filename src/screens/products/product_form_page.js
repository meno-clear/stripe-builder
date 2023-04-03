import { useState, useCallback, useEffect } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather';

import CustomModal from '../../components/modal/custom_modal';


export default function ProductFormPage({route}) {
  const navigation = useNavigation();

  const [errors, setErrors] = useState({});
  
  const [name, setName] = useState('');
  
  const [descriptors, setDescriptors] = useState('');
  const [productDescriptors, setProductDescriptors] = useState([]);
  const [categories, setCategories] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('');

  async function getCategories() {
    try {
      const res = await api_client.get('/categories');
      setCategories(res.data);
    } catch(err) {
      console.error(err);
    }
  }

  async function getDescriptors() {
    try {
      const res = await api_client.get('/product_descriptors');
      setDescriptors(res.data);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCategories();
    getDescriptors();
  }, [])
  

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.id) {
        api_client.get(`products/${route?.params?.id}`).then((response) => {
          
          setName(`${response.data.name}`);
          
          setSelectedCategory(response.data?.category_id);
          setProductDescriptors(response.data.descriptors);
          
        });
      }
      else {
        resetFields();
      }
    }, [route])
   )

  function resetFields() {
    
      setName('');
    
    setProductDescriptors([]);
    setSelectedCategory('');
    
  }

  const handleSubmit = () => {
    if(modalVisible) {
    api_client.post('/categories', {name: category}).then(res => {
      setCategories([...categories, res.data])
      setSelectedCategory(res.data.id)
    }).catch(err => {
      console.error(err);
    })
    return handleModal();
  }

    const product = {
      
      name: name,
      
      category_id: selectedCategory,
      product_descriptor_values_attributes: productDescriptors
      
    };

    if (route?.params?.id) {
      api_client.put(`products/${route?.params?.id}`, product).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('ProductList');
        }
      });
    } else {
      api_client.post('products', product).then((response) => {
        if (response.data.errors) {
          setErrors(response.data.errors);
        } else {
          navigation.navigate('ProductList');
        }
      });
    }
  };

  function setDescriptorsProduct(index, value) {
    let newDescriptors = productDescriptors;
    newDescriptors[index] = {...newDescriptors[index], ...value};
    setProductDescriptors([...newDescriptors]);
  }

  const handleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Form</Text>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={styles.inputSelect}>
            {categories &&
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue)
              }>
                <Picker.Item label='Categoria' value='' />
                {categories.map((category, index) =>
                  <Picker.Item key={index} label={category.name} value={category.id} />
                )}
            </Picker>}
          </View>
          <TouchableOpacity onPress={handleModal} style={styles.addButton}>
            <Icon name='plus' size={24} />
          </TouchableOpacity>
        </View>

        {descriptors && descriptors.map((descriptor, index) =>
          <TextInput
            key={index}
            placeholder={descriptor.name}
            style={styles.input}
            value={productDescriptors[index]?.value}
            onChangeText={(value) => setDescriptorsProduct(index, {product_descriptor_id: descriptor.id, value})}
          />
        )}

        
          <TextInput
            type='text'
            name='name'
            id='name'
            placeholder='Name'
            style={styles.input}
            value={name}
            onChangeText={(name) => setName(name)}
          />
          {errors.name && <p>{errors.name}</p>}

          {/* REMOVE LINES
        
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

          */}
        

      <CustomModal title='New Category' show={modalVisible} onClose={handleModal}>
        <TextInput style={styles.input} onChangeText={e => setCategory(e)} />
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 20 }}>
          <TouchableOpacity style={styles.backButton} onPress={handleModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
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
    paddingHorizontal: 20,  },
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
  inputSelect: {
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    width: '90%',
    height: 56,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  addButton: {
    width: '10%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    borderWidth: 1,
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
