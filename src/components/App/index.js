import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import SignUpForm from "../SignUpForm"
import SignInForm from "../SignInForm"
import Lobby from "../Lobby"
import Room from "../Room"
import S from "./style"

class App extends Component {
  state = {
    currentUser: JSON.parse(localStorage.getItem("savedUser")) || {}
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if(authUser) {
        console.log("auth changed state")
        this.props.firebase.findUser(authUser.uid).get()
          .then(snapshot => {
            const userJson = JSON.stringify({...snapshot.data()})
            localStorage.setItem("savedUser", userJson)
            this.setState({
              currentUser: {
                ...snapshot.data()
              }
            }, () => {
              this.checkForUserChanges()
            })
          })
        this.setUserStatusOnline()
      } else {
        this.setState({
          currentUser: {}
        })
      }
    })
  }
  checkForUserChanges = () => {
    if(this.state.currentUser.id) {
      this.props.firebase.findUser(this.state.currentUser.id)
        .onSnapshot(snapshot => {
          this.setState({
            currentUser: {
              ...snapshot.data()
            }
          })
        })
    }
  }
  setUserStatusOnline = () => {
    // this.props.firebase.connectionRef()
    //   .on("value", snapshot => {
    //     if(snapshot.val() === false) {
    //       this.props.firebase.userStatusDatabaseRef().set({isOnline: false})
    //       return
    //     } else { 
    //       this.props.firebase.userStatusDatabaseRef().onDisconnect().set({isOnline: false})
    //         .then(() => {
    //           this.props.firebase.userStatusDatabaseRef().set({isOnline: true})
    //         })
    //     }
    //   })
    // this.props.firebase.connectionRef()
    //   .on("value", snapshot => {
    //     if(snapshot.val() === false) {
    //       this.props.firebase.userStatusFirestoreRef().set({isOnline: false})
    //       return
    //     }

    //     this.props.firebase.userStatusDatabaseRef().onDisconnect().set({isOnline: false})
    //       .then(() => {
    //         this.props.firebase.userStatusDatabaseRef().set({isOnline: true})
    //         this.props.firebase.userStatusFirestoreRef().set({isOnline: true})
    //       })
    //   })
    const onlineStatus = {
      isOnline: true,
      // last_changed:  this.props.firebase.db.serverTimestamp() 
    }
    const offlineStatus = {
      isOnline: false,
      // last_changed:  this.props.firestore.db.serverTimestamp() 
    }
    this.props.firebase.test()
    this.props.firebase.connectionRef()
      .on("value", snapshot => {
        if(snapshot.val() === false) {
            this.props.firebase.userStatusFirestoreRef().set(offlineStatus)
            return
        }

        this.props.firebase.userStatusDatabaseRef().onDisconnect().set(offlineStatus)
          .then(() => {
            this.props.firebase.userStatusDatabaseRef().set(onlineStatus)
            this.props.firebase.userStatusFirestoreRef().set(onlineStatus)
        })
      })
  }
  setCurrentUser = currentUser => {
    this.setState({
      currentUser
    })
  }
  signOut = () => {
    if(this.props.firebase.auth.currentUser) {
      localStorage.removeItem("savedUser")
      this.props.firebase.userStatusDatabaseRef().set({isOnline: false})
      this.props.firebase.signOut()
      this.props.history.push("/auth/signin")
    }
  }
  render() {
    return (
      <S.AppContainer>
        {console.log(this.state.currentUser, "IM USER")}
        <Switch>
          <Route exact path="/auth/signup" render={() => <SignUpForm currentUser={this.state.currentUser}/>}></Route>
          <Route exact path="/auth/signin" render={() => <SignInForm currentUser={this.state.currentUser}/>}></Route>
          <Route exact path="/lobby" render={() => <Lobby currentUser={this.state.currentUser} signOut={this.signOut} />}></Route>
          <Route exact path="/lobby/:id" render={() => <Room currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser} />}></Route>
        </Switch>
      </S.AppContainer>
    )
  }
}

export default withRouter(withFirebase(App))
