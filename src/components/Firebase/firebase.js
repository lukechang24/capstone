import app from 'firebase/app';
import 'firebase/firebase-firestore'
import "firebase/auth"


const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};


class Firebase {
  constructor() {
    app.initializeApp(config)
    this.db = app.firestore()
    this.auth = app.auth()
  }
  createUser = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password)
  }

  findUser = uid => this.db.collection("users").doc(uid)

  signInUser = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  createLobby = roomInfo => this.db.collection("lobbies").add(roomInfo) 

  findLobby = id => this.db.collection("lobbies").doc(id)

  allLobbies = () => this.db.collection("lobbies")

  signOut = () => this.auth.signOut
}
export default Firebase;