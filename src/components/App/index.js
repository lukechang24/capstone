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
    currentUser: {},
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if(authUser) {
        console.log("auth changed state")
        this.props.firebase.findUser(authUser.uid).get()
          .then(snapshot => {
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
    this.props.firebase.connectionRef()
      .on("value", snapshot => {
        if(snapshot.val() === false) {
          this.props.firebase.userStatusFirestoreRef().set({isOnline: false})
          return
        } else {
          this.props.firebase.userStatusDatabaseRef().onDisconnect().set({isOnline: false})
            .then(() => {
              this.props.firebase.userStatusDatabaseRef().set({isOnline: true})
              this.props.firebase.userStatusFirestoreRef().set({isOnline: true});
            })
        }
      })
  }
  setCurrentUser = currentUser => {
    this.setState({
      currentUser
    })
  }
  signOut = () => {
    if(this.props.firebase.auth.currentUser) {
      this.props.firebase.signOut()
        .then(
          this.props.firebase.userStatusDatabaseRef().set({isOnline: false})
        )
      this.props.history.push("/lobby")
    }
  }
  render() {
    return (
      <S.AppContainer>
        {console.log(this.state.currentUser, "IM USER")}
        <Switch>
          <Route exact path="/auth/signup" render={() => <SignUpForm />}></Route>
          <Route exact path="/auth/signin" render={() => <SignInForm />}></Route>
          <Route exact path="/lobby" render={() => <Lobby currentUser={this.state.currentUser} signOut={this.signOut} />}></Route>
          <Route exact path="/lobby/:id" render={() => <Room currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser} />}></Route>
        </Switch>
      </S.AppContainer>
    )
  }
}

export default withRouter(withFirebase(App))
