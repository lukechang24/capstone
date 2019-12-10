import * as app from 'firebase/app'
import 'firebase/firebase-firestore'
import 'firebase/database'
import "firebase/auth"


const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
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
  test = () => console.log(this.db.FieldValue, "App")

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

  signOut = () => this.auth.signOut()
}
export default Firebase;