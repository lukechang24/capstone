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

  signInAnonymously = displayName => {
    return this.auth.signInAnonymously()
  }

  connectionRef = () => this.database.ref(".info/connected")

  userStatusDatabaseRef = () => this.database.ref(`/status/${this.auth.currentUser.uid}`)

  userStatusFirestoreRef = () => this.db.doc(`/status/${this.auth.currentUser.uid}`)

  userRef1 = () => this.database.ref("users")

  findUser1 = uid => this.database.ref(`users/${uid}`)

  findUsers = roomId => this.db.collection("users").where("currentRoomId", "==", roomId)

  createRoom1 = roomInfo => this.database.ref("rooms").push(roomInfo) 

  findRoom1 = roomId => this.database.ref(`rooms/${roomId}`)

  roomRef1 = () => this.database.ref("rooms") //WATCHOUT

  createCanvas1 = (canvasInfo) => this.database.ref("canvases").push(canvasInfo)

  findCanvas1 = canvasId => this.database.ref(`canvases/${canvasId}`)

  canvasRef1 = () => this.database.ref("canvases") //WATCH OUT

  createChat1 = (chatInfo) => this.database.ref("chats").push(chatInfo)

  chatRef1 = () => this.database.ref(`chats`)

  findChatLog1 = chatId => this.database.ref(`chats/${chatId}`) //WATCH OUT

  signOut = () => this.auth.signOut()
}
export default Firebase;