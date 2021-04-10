// Firebase Import
import * as firebase from 'firebase';

// Providers
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import { StatusBar } from 'expo-status-bar';

// Component Imports
import React, { useState, useEffect, createContext } from 'react';
import { Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '@auth/Landing';
import Register from '@auth/Register';
import Login from '@auth/Login';
import RoboRamsay from '@src/RoboRamsay';
import ItemScreen from '@screens/other/ItemScreen'
import Settings from '@screens/Settings'

/** Firebase Configuration */
const firebaseConfig = {
  apiKey: "AIzaSyBtqt8P4N1FoA6h_esTIE0yMlH36mzziAE",
  authDomain: "robo-ramsay.firebaseapp.com",
  projectId: "robo-ramsay",
  storageBucket: "robo-ramsay.appspot.com",
  messagingSenderId: "10917927337",
  appId: "1:10917927337:web:21011e48b660dce3dc0cb8",
  measurementId: "G-8ZDM888KSB"
}

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

/** Contexts and Stack Navigation */
const Stack = createStackNavigator();
export const SessionContext = createContext([{}, () => {}])

export default function App() {
  /** Defines application state Hooks for users 
   *  loaded: keeps track of load state of app
   *  loggedIn: keeps track of login state
   *  user: keeps track of current user logged in
  */
  const [ session, setSession ] = useState({ loaded: false, loggedIn: false, user: null });

  /**
   * Updates state according to whether a User is logged in or not
   */
  useEffect(
    () => {
      firebase.auth().onAuthStateChanged((user) => {
        if(!user) {
          setSession({
            loggedIn: false,
            loaded: true,
            user: null
          })
        } else {
          setSession({
            loggedIn: true,
            loaded: true,
            user: firebase.auth().currentUser.uid
          })
        }
      })
    }, [session]
  )

  /**
   * Loads loading screen if main App hasn't loaded
   */
  if(!session.loaded) {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text> Loading... </Text>
      </View>
    )
  }

  /**
   * If no user is logged in, show Landing page
   */
  if(!session.loggedIn) {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Login" component={Login}/>
          </Stack.Navigator>
        </NavigationContainer>
    )
  }

  /**
   * If a user is logged in, show App
   */
  return(
    <SessionContext.Provider value={[session, setSession]}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="RoboRamsay" component={RoboRamsay} options={{ headerShown: false }}/>
            <Stack.Screen name="ItemScreen" component={ItemScreen} />
            <Stack.Screen name="Settings" component={Settings}/>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </SessionContext.Provider>
  )
}