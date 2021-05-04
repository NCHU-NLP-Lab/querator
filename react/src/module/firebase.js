// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAprCrNdC-XmxePJhHMd1VsIt5kGOgWDGI",
    authDomain: "qenerator-6280d.firebaseapp.com",
    databaseURL: "https://qenerator-6280d.firebaseio.com",
    projectId: "qenerator-6280d",
    storageBucket: "gs://qenerator-6280d.appspot.com",
    messagingSenderId: "173656592620",
    appId: "1:173656592620:web:3028cb4b33c54fddb4d5c9"
};
firebase.initializeApp(firebaseConfig);

export default firebase

// import firebase from './module/firebase'
// Get a reference to the storage service, which is used to create references in your storage bucket    
// function writeUserData(userId = '4', name = '123', email = '456', imageUrl = '789') {
//     firebase.database().ref('users/' + userId).set({
//         username: name,
//         email: email,
//         profile_picture: imageUrl
//     });
// }
// writeUserData()