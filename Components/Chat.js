import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { db } from "../config/firebase";
import { onSnapshot} from "firebase/firestore";
const firebase = require("firebase");
// Required for side-effects
import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
// Communication features
//import * as Speech from "expo-speech";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions.js";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
//Send button
import Image from "../img/send.png";
import { Button } from "react-native-paper";

import { styles } from "../styles/styles";

export default function Chat(props) {
  let { name, bgColor } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [logInText, setLogInText] = useState("You are online");
  const [isOnline, setOnline] = useState();


  //Using imported firestore(db) from config
  const referenceCollection = db.collection("messages");

  //Run once after component mount
  useEffect(() => {
    props.navigation.setOptions({ title: name });

    // If user is online, retrieve messages from firebase store, if offline use AsyncStorage
    NetInfo.fetch().then((connection) => {
      setOnline(connection.isConnected);
      if (!connection.isConnected) {
        // WORKING WITH ASYNCSTORAGE: get messages for asyncStorage and set the state
        getMessages();
      } else {
        // WORKING WITH FIRESTORE
        // Fetch collection and query on it
        const messagesQuery = referenceCollection.orderBy("createdAt");
        messagesQuery.get()

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

        // listen for collection changes (Update state based on database snapshot)
        let stopListeningToSnapshots = onSnapshot(
          messagesQuery,
          onCollectionUpdate
        );
        

        //In here code will run once the component will unmount
        return () => {
          // stop listening for changes
          stopListeningToSnapshots();
          // stop listening to authentication
          authUnsubscribe();
        };
      }
    });
  }, [isOnline]);

  // WORKING WITH FIRESTORE //

  // GET messages from firestore collection(snapshot) and update state
  const onCollectionUpdate = (querySnapshot) => {
    let mess = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      mess.push({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
        location: doc.data().location,
        image: doc.data().image,
      });
    });
    //Update state
    setMessages(mess);
    //Update asyncStorage
    saveMessages(mess);
  };

  // ADD/PUT document(message) to firestore collection
  // ADD/PUT document(message) to firestore collection
  const addMessage = (message) => {
    referenceCollection
      .add({
        uid: uid,
        _id: message._id,
        createdAt: message.createdAt,
        text: message.text || "",
        user: message.user,
        image: message.image || '',
        location: message.location || null
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
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    //Last message appended to collection
    addMessage(newMessages[0]);
  };

  // WORKING WITH ASYNCSTORAGE (local storage) //
  // GET messages from asyncStorage
  const getMessages = async () => {
    let mesg = "";
    try {
      mesg = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(mesg));
      console.log("Messages fetched from Async Storage", mesg);
    } catch (error) {
      console.log(error.message);
    }
  };
  // ADD messages to asyncStorage
  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messages));
      //console.log("Messages: ", messages);
    } catch (error) {
      console.log(error.message);
    }
  };
  // DELETE messages from asyncStorage and state
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // style message bubble
  const renderBubble = (props) => (
    <Bubble
      {...props}
      textStyle={{
        right: {
          color: "black",
        },
        left: {
          color: "white",
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "teal",
          padding: 7,
        },
        right: {
          backgroundColor: "darkorange",
          padding: 7,
        },
      }}
    />
  );

//Modify the send button to render a costumized button with paperplan icon
const renderSend = (props) => {
  return (
    <Send {...props} containerStyle={styles.sendContainer}>
      {/* using button from react-native-paper library */}
      <Button width={22.7} height={22.38} icon={Image} />
    </Send>
  );
};
  const renderInputToolbar = (props) => {
    if (!isOnline) {
      return <></>;
    } else {
      return <InputToolbar {...props} />;
    }
  };
  // to render ActionSheet with options
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };
  // to render MapView if mess contains location data
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <ActionSheetProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
         <Text>{logInText}</Text>
        {/* Chat UI */}
        <GiftedChat
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          renderInputToolbar={renderInputToolbar}
          user={{
            _id: uid,
            name: name,
          }}
        />
        {/*<Button title="Press to hear last message" onPress={speak} />*/}
        {/* Ensures that the input field won’t be hidden beneath the keyboard */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    </ActionSheetProvider>
  );
}