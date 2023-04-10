import { useState, useCallback, useEffect } from 'react';
import api_client from '../../config/api_client';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import { trackPromise } from 'react-promise-tracker';
import ReturnButton from '../../components/shared/return_button';

export default function OrderDetails({ route }) {
  const { order } = route.params;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [total_items, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      trackPromise(
        refreshList()
      )
    }, [])
  );

  useEffect(() => {
    getTotalItems()
  }, [products])

  function getTotalItems() {
    let sum_of_items = products.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity, 0
    )
    setTotalItems(sum_of_items)
  }

  async function refreshList() {
    await api_client.get(`order_items?order_id=${order.id}`).then((response) => {
      setProducts(response.data);
    });
    setLoading(false)
  }

  const Item = ({ item }) => {
    return (
      <View style={[styles.item]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.itemDetails}>
            <Text style={styles.title}>Name:
              <Text style={styles.data}> {item['cart_item']?.product_name}</Text>
            </Text>
            <Text style={styles.title}>Quantity:
              <Text style={styles.data}> {item['cart_item']?.quantity}</Text>
            </Text>
            {
              item['variant_descriptors'] && item['variant_descriptors'].map((descriptor, index) => {
                return (
                  <Text style={styles.title} key={index}>{descriptor.name}:
                    <Text style={styles.data}> { 
                      descriptor?.boolean_value != null ? 
                        descriptor?.boolean_value ? 'Yes' : 'No' 
                        : 
                        descriptor?.value
                    }</Text>
                  </Text>
                )
              })
            }
            {/* end items details */}
          </View>
          <View style={[styles.itemDetails, { alignItems:'flex-end', justifyContent: 'space-between'}]}>
            <View style={{ flexDirection:'column', alignItems:'flex-end', gap: 5}}>
              <Text style={styles.title}>Unit Price:
                <Text style={styles.data}>R$ {item['cart_item']?.product_price_in_cents / 100}</Text>
              </Text>
              <Text style={styles.title}>Price In Cents:
                <Text style={styles.data}>R$ {item['cart_item']?.product_price_in_cents * item['cart_item']?.quantity}</Text>
              </Text>
            </View>
            <Text style={styles.title}>Total:
              <Text style={styles.totalData}>R$ {(item['cart_item']?.product_price_in_cents * item['cart_item']?.quantity) / 100}</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const goToPayment = async () => {
    setLoading(true)
    try{
      const {data} = await api_client.get(`payments/${order.payment_id}`)
      navigation.dispatch(
        CommonActions.reset({ 
          index: 0,
          routes: [{ name: 'Root' }],
        })
      )
      navigation.navigate('Checkout', { checkout: data['checkout'], orders: data['orders'] })
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ?
        <View style={styles.loaderView}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
        :
        <>
          <ReturnButton />
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitle}> SUMMARY </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.title}>Total Price: </Text>
            <Text style={styles.data}> R$ {order.total} </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.title}>Price In Cents: </Text>
            <Text style={styles.data}> R$ {order.price_in_cents} </Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.title}>Market: </Text>
            <Text style={styles.data}> {order.market_place_partner_name} </Text>
          </View>

          <View style={styles.lastData}>
            <Text style={styles.title}>Items: </Text>
            <Text style={styles.data}> {total_items} </Text>
          </View>

          <View style={styles.divider} />

          <View style={{ marginBottom: 20 }}>
            {products.length > 0 &&
              <FlatList
                data={products}
                renderItem={Item}
                keyExtractor={item => item.id}
              />
            }
          </View>
        </>
      }
      {
        order.status == 'pending' && (
          <View style={{padding: 10, justifyContent:'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={[styles.orderButton,{
                opacity: loading && 0.5,
                backgroundColor: loading ? '#ccc': '#2196F3',
                borderColor: loading ? '#ccc': '#2196F3',
              }]}
              disabled={loading}
              onPress={() => goToPayment()}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  orderButton: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 6
  },
  title: {
    fontWeight: 'bold',
    color: '#000'
  },
  data: {
    color: '#6d6d6d',
    fontWeight: 'normal'
  },
  divider: {
    borderBottomWidth: 1,
    marginBottom: 10,
    borderColor: '#cecece'
  },
  dataRow: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lastData: {
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalData: {
    color: 'green'
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cecece',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 8,
    backgroundColor: 'white'
  },
  itemDetails: {
    flexDirection: 'column',
    gap: 5
  },
  buttonToReturn: {
    padding: 10
  },
  loaderView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});
