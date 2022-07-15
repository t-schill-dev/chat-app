import React from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { styles } from '../styles/styles';

export default function Chat(props) {

  let { name } = props.route.params;
  let { bgColor } = props.route.params;
  props.navigation.setOptions({ title: name }, { backgroundColor: bgColor })

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: bgColor
    }}>
      <View style={{ flex: 20 }}>
        <Text style={styles.chat_title}>Hello, {name}</Text>
      </View>
      <View style={{ flex: 80 }}></View>

    </View>
  )
}
