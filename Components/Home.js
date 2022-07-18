import React, { useState } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Platform, KeyboardAvoidingView,
  Alert
}
  from 'react-native';
import BackgroundImage from '../img/background_image.png';
import { styles } from '../styles/styles';


const colors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

// Imported dependency to specify the dimension of the background picture
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function Home(props) {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={BackgroundImage}
        resizeMode='cover'
        style={{ ...styles.image, height: windowHeight, width: windowWidth }} />
      <View style={{ flex: 55 }}>
        <Text style={styles.title}>What's Up?</Text>
      </View>
      <View style={styles.input_wrapper}>
        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          value={name}
          placeholder='Your name'
        />
        <Text style={styles.select}>Choose background color:</Text>
        {/* Create container with colors to pick for the chat screen. Set to values of the colors array and invoking state change */}
        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={[{ backgroundColor: colors.black }, styles.colorbutton]}
            onPress={() => {
              setBgColor(colors.black);
              Alert.alert('You selected black')
            }}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.purple }, styles.colorbutton]}
            onPress={() => {
              setBgColor(colors.purple);
              Alert.alert('You selected purple')
            }
            }

          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.grey }, styles.colorbutton]}
            onPress={() => {
              setBgColor(colors.grey);
              Alert.alert('You selected grey')
            }
            }
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.green }, styles.colorbutton]}
            onPress={() => {
              setBgColor(colors.green);
              Alert.alert('You selected green')
            }
            }
          />
        </View>
        {/* Button to utilize navigation prop from React Navigation library to switch screens */}
        <Pressable
          style={styles.button}
          // Function passes name and color prop to Chat component
          onPress={() => props.navigation.navigate('Chat', { name: name, bgColor: bgColor })}>
          <Text style={styles.button_text}>Start Chatting</Text>
        </Pressable>

      </View>
      {/* Prevents overlay of keybord on android devices when typing. Use features from react-native */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : null} />

    </View>
  )
}
