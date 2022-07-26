import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  // Button,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { Button } from "react-native-paper";
import Image from "../img/send.png";
import { styles } from "../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from './CustomActions'
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import { db } from "../config/firebase";

export default function Chat({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [logInText, setLogInText] = useState("You are online");
  const [isOnline, setOnline] = useState();
  // Storing image information
  const [img, setImg] = useState(null);

  //Get params
  let { name, bgColor } = route.params;
  //Using imported firestore(db) from config
  const referenceCollection = db.collection("messages");

  //run once after component mounts
  useEffect(() => {
    // Declare the title of the Chat UI being the name prop
    navigation.setOptions({ title: name });
    //If user is online, retrieve messages from firebase, if offline use AsyncStorage
    NetInfo.fetch().then((connection) => {
      setOnline(connection.isConnected);

      if (!connection.isConnected) {
        console.log("offline");
        setLogInText("You are offline");
        //Working with AsyncStoreage to get Messages
        getLocalMessages();
      } else {
        console.log("online");
        //Working with firestore
        // listen to authentication events
        const authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            // update user state with user data
            setUid(user.uid);
            console.log(user.uid);
          });

        // create a reference to the active user's documents from state
        let referenceCollectionUser = referenceCollection.where(
          "uid",
          "==",
          uid
        );

        // listen for collection changes (Update state based on database snapshot)
        let stopListeningToSnapshots =
          referenceCollection.onSnapshot(onCollectionUpdate);

        //In here code will run once the component will unmount (equivalent to compontentWillUnmount)
        return () => {
          // stop listening for changes
          stopListeningToSnapshots();
          // stop listening to authentication
          authUnsubscribe();
        };
      }
    });
  }, []);

  //WORKING WITH ASYNCSTORAGE (local storage) //
  //GET messages from asyncStorage

  const getLocalMessages = async () => {
    let msg = "";
    try {
      msg = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(msg));
    } catch (error) {
      console.log(error.msg);
    }
  };
  //ADD message to async Storage
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
      console.log("Add to Local storage", messages);
    } catch (error) {
      console.log(error.message);
    }
  };

  // DELETE messages from asyncStorage and state
  const deleteMessage = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

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

    setMessages(messages);
  };

  //Working with firestore
  // ADD/PUT document(message) to firestore collection
  const addMessage = (message) => {
    referenceCollection
      .add({
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
      });
  };

  //Append new messages to the State and add to firestore collection (addMessage) and asyncStorage (saveMessages)
  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    saveMessages();
    //Last message appended to collection
    addMessage(newMessages[0]);
  };


  // Hide input field when offline
  const renderInputToolbar = (props) => {
    if (!isOnline) {
      return <></>;
    } else {
      return <InputToolbar {...props} />;
    }
  };
//Render imported CustomActions Component
  const renderCustomActions = (props) => {
    return <CustomActions {...props}/>
  };

  //Changing color by inheriting props of function
  const renderBubble = function (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#66BFBF",
          },
          left: {
            backgroundColor: "#FEFBF6",
          },
        }}
        textStyle={{
          right: {
            color: "#FEFBF6",
          },
          left: {
            color: "#495C83",
          },
        }}
      />
    );
  };
  //Modify the send button to render a costumized button with paperplan icon
  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        {/* using button from react-native-paper library */}
        <Button width={22.7} height={22.38} icon={Image} />
      </Send>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
      }}
    >
     
      <Text>{logInText}</Text>
      <GiftedChat
        renderSend={renderSend}
        renderBubble={renderBubble}
        renderActions={renderCustomActions}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderInputToolbar={renderInputToolbar}
        user={{
          _id: uid,
          name: name,
        }}
      />
      {/* Prevents overlay of keybord on android devices when typing. Use features from react-native */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}
