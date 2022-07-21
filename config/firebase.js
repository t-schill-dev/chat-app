const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArHO1wfcgmb2wZcnQ1uhduyixnBfWTe2A",
    authDomain: "test-project-8d00c.firebaseapp.com",
    projectId: "test-project-8d00c",
    storageBucket: "test-project-8d00c.appspot.com",
    messagingSenderId: "775330376472",
};

firebase.initializeApp(firebaseConfig)

//export to Chat.js
export const db = firebase.firestore()