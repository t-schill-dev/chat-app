import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { Button } from 'react-native-paper'
import Image from '../img/send.png'
import { styles } from '../styles/styles';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import { db } from "../config/firebase";



export default function Chat({ route, navigation }) {

  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState('');
  const [text, setText] = useState('');

  //Get params
  let { name, bgColor } = route.params;


  //run once after component mounts
  useEffect(() => {
    // Declare the title of the Chat UI being the name prop
    navigation.setOptions({ title: name })
    //Using imported firestore(db) from config
    const referenceCollection = db.collection('messages');

    // listen to authentication events
    const authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      // update user state with user data
      setUid(user.uid);
      setText(`User ${user.uid}`);
      console.log(user.uid);
    });

    // create a reference to the active user's documents from state
    let referenceCollectionUser = referenceCollection.where('uid', '==', uid)

    // listen for collection changes (Update state based on database snapshot)
    let stopListeningToSnapshots = referenceCollection.onSnapshot(onCollectionUpdate);


    //In here code will run once the component will unmount (equivalent to compontentWillUnmount)
    return () => {
      // stop listening for changes
      stopListeningToSnapshots();
      // stop listening to authentication
      authUnsubscribe();
    };

  }, [])

  const onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get QueryDocumentSnapshot data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    })

    setMessages(messages)
  };

  // ADD/PUT document(message) to firestore collection
  const addMessage = (message) => {
    referenceCollection.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user,
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });;
  };

  //Append new messages to the State and add to firestore collection (addMessage) and asyncStorage (saveMessages)
  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    //Last message appended to collection
    addMessage(newMessages[0])
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
      <Text></Text>
      <GiftedChat
        renderSend={renderSend}
        renderBubble={renderBubble}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
      {/* Prevents overlay of keybord on android devices when typing. Use features from react-native */}
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
      }
    </View>
  )
}
