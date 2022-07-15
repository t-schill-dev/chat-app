import React, { useState } from 'react';
import { ImageBackground, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import BackgroundImage from '../img/background_image.png';
import { styles } from '../styles/styles';

const colors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

export default function Home(props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={BackgroundImage}
        resizeMode='cover'
        style={styles.image} />
      <Text style={styles.title}>What's Up?</Text>
      <View style={styles.input_wrapper}>
        <TextInput
          style={styles.input}
          onChangeText={(name) => setName(name)}
          value={name}
          placeholder='Your name'
        />
        <Text style={styles.select}>Choose background color:</Text>
        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={[{ backgroundColor: colors.black }, styles.colorbutton]}
            onPress={() => setColor(colors.black)}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.purple }, styles.colorbutton]}
            onPress={() => setColor(colors.purple)}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.grey }, styles.colorbutton]}
            onPress={() => setColor(colors.grey)}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.green }, styles.colorbutton]}
            onPress={() => setColor(colors.green)}
          />
        </View>
        <Button
          style={styles.button}
          title='Start Chatting'
          color='#757083'
          onPress={() => props.navigation.navigate('Chat', { name: name })}
        />

      </View>
    </View>
  )
}
