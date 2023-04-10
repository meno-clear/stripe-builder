import { useState, Fragment, useCallback, useEffect, useRef } from 'react';
import api_client from '../../config/api_client';
import { CommonActions } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnButton from '../../components/shared/return_button';
import { CheckoutButton } from '../../components/checkout_button';

const CheckoutPage = ({ route, navigation }) => {
  const { orders, checkout } = route.params;
  const { payment_intent } = checkout || {};

  const Item = ({ item }) => {
    return (
      <View style={[styles.item]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.itemDetails}>
            <Text style={styles.title}>Name:
              <Text style={styles.data}> {item?.product_name}</Text>
            </Text>
            <Text style={styles.title}>Quantity:
              <Text style={styles.data}> {item?.quantity}</Text>
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
                <Text style={styles.data}>R$ {item?.price_in_cents / 100}</Text>
              </Text>
              <Text style={styles.title}>Price In Cents:
                <Text style={styles.data}>R$ {item?.price_in_cents * item?.quantity}</Text>
              </Text>
            </View>
            <Text style={styles.title}>Total:
              <Text style={styles.totalData}>R$ {(item?.price_in_cents * item?.quantity) / 100}</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
    {
      <>
        <ReturnButton reset />
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitle}> SUMMARY </Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.title}>Total Price: </Text>
          <Text style={styles.data}> R$ {payment_intent.amount/100} </Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.title}>Price In Cents: </Text>
          <Text style={styles.data}> R$ {payment_intent.amount} </Text>
        </View>
        <View style={styles.divider} />
        {
          orders.length > 0 && orders.map((order, index) => (
            <Fragment key={order.id}>
              <View style={styles.dataRow}>
                <Text style={styles.title}>Market: </Text>
                <Text style={styles.data}> {order.market_place_partner_name} </Text>
              </View>

              <View style={styles.lastData}>
                <Text style={styles.title}>Items: </Text>
                <Text style={styles.data}> {order.total_items} </Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                {order.order_items.length > 0 &&
                  <FlatList
                    data={order.order_items}
                    renderItem={Item}
                    keyExtractor={item => item.id}
                  />
                }
              </View>
              <View style={styles.divider} />
            </Fragment>
          ))
        }
      </>
    }
    <View style={{ width: '100%', alignItems:'center'}}>
      <CheckoutButton checkout={checkout} navigation={navigation} />
    </View>
  </SafeAreaView>
  )
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
    marginVertical: 5,
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


export default CheckoutPage;