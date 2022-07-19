import React, { useEffect, useState, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { Button } from 'react-native-paper'
import Image from '../img/send.png'
import { styles } from '../styles/styles';
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

export default function Chat({ route, navigation }) {

  const [messages, setMessages] = useState([]);

  //Get params
  let { name, bgColor } = route.params;

  // Declare the title of the Chat UI being the name prop
  navigation.setOptions({ title: name })

  //run once after component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ])
  }, [])

  //Message gets appended to the GiftedChat
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  //Changing color by inheriting props of function
  const renderBubble = function (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }
  //Modify the send button to render a costumized button with paperplan icon
  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={styles.sendContainer}
      >
        {/* using button from react-native-paper library */}
        <Button width={22.7} height={22.38} icon={Image} />
      </Send>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: bgColor
    }}>
      <GiftedChat
        renderSend={renderSend}
        renderBubble={renderBubble}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {/* Prevents overlay of keybord on android devices when typing. Use features from react-native */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
      }
    </View>
  )
}
