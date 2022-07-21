import React, { useEffect, useState, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { Button } from 'react-native-paper'
import Image from '../img/send.png'
import { styles } from '../styles/styles';
import { collection, getDocs, addDoc } from 'firebase/firestore'
//import configured Database
import { db } from "../config/firebase";
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';



export default function Chat({ route, navigation }) {

  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState('');
  const [text, setText] = useState('');

  //Get params
  let { name, bgColor } = route.params;



  let messagesCollection = collection(db, 'messages');

  const querySnapshot = getDocs(messagesCollection);

  //Authentication variable
  const auth = getAuth();
  //run once after component mounts
  useEffect(() => {
    // Declare the title of the Chat UI being the name prop
    navigation.setOptions({ title: name })

    // listen to authentication events
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth);
      }

      // update user state with user data
      setUid(user.uid);
      setText(`User ${user.uid}`);
      console.log(user.uid);
    });
    // listen for collection changes (Update state based on database snapshot)
    let stopListeningToSnapshots = onSnapshot(onCollectionUpdate);
    //In here code will run once the component will unmount
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
    });
    setMessages(messages)
  }

  // ADD/PUT document(message) to firestore collection
  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

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
      <Text>{text}</Text>
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
