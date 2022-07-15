import React, { useEffect, useState, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { styles } from '../styles/styles';

export default function Chat(props) {

  const [messages, setMessages] = useState([]);

  let { name, bgColor } = props.route.params;
  // Declare the title of the Chat UI being the name prop
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
  return (
    <View style={{
      flex: 1,
      backgroundColor: bgColor
    }}>
      <GiftedChat
        renderBubble={renderBubble}
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
