import { useState, useCallback } from 'react';
import api_client from '../../config/api_client';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Swipeable } from 'react-native-gesture-handler';

export default function VariantListPage({route}) {  const navigation = useNavigation();
  const [variants, setVariants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('Variants List');
  const [productId, setProductId] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshList(route?.params?.id);
    }, [route?.params?.id])
  );

  function refreshList(id) {
    api_client.get('/products').then((response) => {
      setProducts(response.data);
      response.data.map(product => {
        if(id == product.id) setVariants(product.variants)
      })
    });
  }

  function deleteItem(item) {
    api_client.delete(`variants/${item}`).then(() => {
      setItemToDelete(null)
      setModalVisible(false)
refreshList(productId)
    })
      .catch(err => console.error(err));
  }

  function handleDeleteItem(item) {
    setModalVisible(true)
    setItemToDelete(item)
  }

  const getLeftContent = (item) => {
    return (
      <TouchableOpacity style={styles.left} onPress={() => handleDeleteItem(item)} >
        <Icon name="trash" size={25} color="#fff"/>
      </TouchableOpacity>
    )
  }

  function goBack() {
    if(productId) return [setTitle('Variants List'), setProductId(''), setVariants([])];
    navigation.openDrawer();
  }

  const TitleWithData = ({ title, data }) => (
    <Text style={styles.title}>{title}
      <Text style={styles.data}> {data}</Text>
    </Text>
  );

  function navigateToVariants(item) {
    setProductId(productId => item.id);
    setTitle(`Variants ${item.name}`);
    setVariants(item.variants);
  }

  const Item = ({ item }) => {
    return (
        <TouchableOpacity
          style={styles.item}
        onPress={() => navigateToVariants(item)}
        >
          
        <TitleWithData title='Name:' data={item?.name} />          
          
        </TouchableOpacity>
    )
  }

  const ItemVariant = ({ item }) => {
    return (
      <Swipeable renderLeftActions={() => getLeftContent(item)}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('VariantForm', { id: item.id, product_id: item.product_id })}
        >
          {item.descriptors.map((descriptor, index) =>
            (descriptor.value_type == 'boolean' && !descriptor.boolean_value) ? null : <TitleWithData key={index} title={descriptor.name} data={descriptor.value} />
          )}
          <TitleWithData title='Price' data={item.price_in_cents} />
        </TouchableOpacity>
      </Swipeable>
    )
  }
  const ModalComponent = ({ item }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Do you want to delete this item?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDelete]}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
<View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: 20, padding: 15 }}>
        <TouchableOpacity style={[styles.buttonToReturn, !productId && {backgroundColor: 'white', borderWidth: 0}]} onPress={goBack}>
          {productId ?
          <Text style={{ flexDirection: 'row', alignItems: 'center', color: "#fff" }}><Icon name="arrow-left" /> Back</Text>
            :
            <Icon name='menu' size={26} />
          }
        </TouchableOpacity>
      <View style={styles.headerTitle}><Text style={{fontSize: 15, fontWeight: 'bold'}}>{title}</Text></View>
      <TouchableOpacity style={[styles.buttonToAdd, !productId && {display: 'none'}]} onPress={() => navigation.navigate('VariantForm', {product_id: productId})}>
          <Text style={{ flexDirection: 'row', alignItems: 'center', color: '#fff' }}><Icon name="plus" /> New</Text>
        </TouchableOpacity>
      </View>

      <View>
        {products.length > 0 && !productId ?
          <FlatList
            data={products}
            renderItem={Item}
            keyExtractor={item => item.id}
          />
          :
          <FlatList
            data={variants}
renderItem={ItemVariant}
            keyExtractor={item => item.id}
          />
        }
      </View>
      {modalVisible && itemToDelete && <ModalComponent item={itemToDelete} setModalVisible={setModalVisible} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 35, flex: 1 },
  headerTitle: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  title: {
    fontWeight: 'bold',
    color: '#4286f4'
  },
  data: {
    color: '#7e95cc'
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#e4e8f0',
    borderColor: '#4286f4'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginHorizontal: 20
  },
  buttonDelete: {
    backgroundColor: "red",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonToAdd: {
    backgroundColor: "#2196F3",
    padding: 5,
    borderWidth: 1,
    borderColor: '#4286f4',
    borderRadius: 4
  },
  buttonToReturn: {
    zIndex: 10,
    backgroundColor: "red",
    padding: 5,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  left: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderRadius: 4
  }
});
