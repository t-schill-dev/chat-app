import React, { useEffect, useState, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { styles } from '../styles/styles';

export default function Chat(props) {

  const [messages, setMessages] = useState([]);

  let { name, bgColor } = props.route.params;

  props.navigation.setOptions({ title: name })

  //run once after component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        areatedAt: new Date(),
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

  return (
    <View style={{
      flex: 1,
      backgroundColor: bgColor
    }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
      }
    </View>
  )
}
