// written by: Raghav Gopalakrishnan, Ray Chau
// tested by: Adrian Mah, Parth Vora
// debugged by: Parth Vora, Alan Chacko

import React, {useState, useEffect} from 'react'
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import OrderViewCell from '@components/edit-order/OrderViewCell'
import { useRoute } from '@react-navigation/native'
import Item from './Item';
import firebase from 'firebase'

/* CONTAINER */
// Describes component that allows user to view menu item

export default function OrderViewerContainer() {
  const route = useRoute()
  const [orders, setOrders] = useState(route.params)

  const deleteItem = (orders, item) => {
    let update = orders.filter(data => data != item)
    setOrders(update)
    let user = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
    user.update({
      currentOrders: update
    })
  }

  let globals = {
    orders,
    deleteItem,
  }

  let items = []
  if (orders != null) {
    orders.forEach(
        (item) => {
          items.push(<TextCell key={item.key} globals={globals} item={item}/>)
        }
    )
  }

  let info = {
    items,
    orders
  }

  return (
      <OrderViewer info={info}/>
  )
}

/* PRESENTATION */

function OrderViewer({ info }) {
    
    /*
    confirm = <Button title="CONFIRM ORDER" />
    */

    return (
      <View style={styles.container}>
        <ScrollView>
          <OrderViewCell info={info}/>
        </ScrollView>
      </View>
    )
}

const TextCell = ({ globals, item }) => {

  return (
    <View style={styles.editCell} >
      <Item
              onSwipe={() => 
                globals.deleteItem(globals.orders, item)
              }
              {...{ item }}
      />
      
    </View>
  )
}

/*
const DeleteButton = ({ globals, item }) => {
  let orders = globals.orders
  return (
    <TouchableOpacity
      onPress={() => globals.deleteItem(orders, item)}
      activeOpacity={0.6}
      underlayColor="#DDDDDD">
      <Text style={styles.buttonCell}>❌</Text>
    </TouchableOpacity>
  )
}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: '5%'
  },
  blank: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  blankText: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomView: {
    width: '100%',
    alignSelf: 'center',
    position: 'fixed',
    bottom: 0,
    backgroundColor: 'white',
    padding: 10
  },
  editCell: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%'
  },
  buttonCell: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 3,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  textCell: {
   // height:HEIGHT,
    flex: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textSpLeft: {
    flex: 1,
    textAlign: 'left',
  },
  textSpCenter: {
    flex: 1,
    textAlign: 'center',
  },  
  textSpRight: {
    flex: 1,
    textAlign: 'right',
  },
});
