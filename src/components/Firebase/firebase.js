import * as app from 'firebase/app'
import 'firebase/firebase-firestore'
import 'firebase/database'
import "firebase/auth"

const config = {
  apiKey: "AIzaSyALOv6caotWiVrGkKfjrKjS_tY16cFuhRA",
  authDomain: "capstone-ab1a2.firebaseapp.com",
  databaseURL: "https://capstone-ab1a2.firebaseio.com",
  projectId: "capstone-ab1a2",
  storageBucket: "capstone-ab1a2.appspot.com",
  messagingSenderId: 105595358454,
}

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.database = app.database()
    this.db = app.firestore()
    this.auth = app.auth()
  }
  createUser = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  signInUser = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  connectionRef = () => this.database.ref(".info/connected")

  userStatusDatabaseRef = () => this.database.ref(`/status/${this.auth.currentUser.uid}`)

  userStatusFirestoreRef = () => this.db.doc(`/status/${this.auth.currentUser.uid}`)

  userRef = () => this.db.collection("users")

  findUser = uid => this.db.collection("users").doc(uid)

  findUsers = roomId => this.db.collection("users").where("currentRoomId", "==", roomId)

  createRoom = roomInfo => this.db.collection("rooms").add(roomInfo) 

  findRoom = id => this.db.collection("rooms").doc(id)

  findRooms = () => this.db.collection("rooms")

  createCanvas = (canvasInfo) => this.db.collection("canvases").add(canvasInfo)

  findCanvas = id => this.db.collection("canvases").doc(id)

  findCanvases = roomId => this.db.collection("canvases").where("roomId", "==", roomId)

  createChat = (chatInfo) => this.db.collection("chats").add(chatInfo)

  chatRef = () => this.db.collection("chats")

  findChatLogs = roomId => this.db.collection("chats").where("roomId", "==", roomId)

  wordBankRef = () => this.db.collection("wordBank")

  signOut = () => this.auth.signOut()
}
export default Firebase;