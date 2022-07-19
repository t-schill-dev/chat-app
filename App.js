import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { initializeApp } from "firebase/app";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Components/Home';
import Chat from './Components/Chat';

export default function App() {
  const Stack = createStackNavigator();
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyArHO1wfcgmb2wZcnQ1uhduyixnBfWTe2A",
    authDomain: "test-project-8d00c.firebaseapp.com",
    projectId: "test-project-8d00c",
    storageBucket: "test-project-8d00c.appspot.com",
    messagingSenderId: "775330376472",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={Home}
        />
        <Stack.Screen
          name='Chat'
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
