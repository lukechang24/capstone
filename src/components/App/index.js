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
    currentUser: JSON.parse(localStorage.getItem("savedUser")) || {},
    error: null
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if(authUser) {
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
    const onlineStatus = {
      isOnline: true,
    }
    const offlineStatus = {
      isOnline: false,
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
  setError = (newError) => {
    this.setState({
      error: newError
    })
  }
  resetError = () => {
    this.setState({
      error: null
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
        {this.state.error 
          ?
            <S.Container1>
              <S.ErrorContainer>
                <S.CancelError onClick={this.resetError} className="fas fa-times"></S.CancelError>
                <S.Error>{this.state.error}</S.Error>
              </S.ErrorContainer>
            </S.Container1>
          :
            null
        }
        <Switch>
          <Route exact path="/auth/signup" render={() => <SignUpForm currentUser={this.state.currentUser}/>}></Route>
          <Route exact path="/auth/signin" render={() => <SignInForm currentUser={this.state.currentUser}/>}></Route>
          <Route exact path="/lobby" render={() => <Lobby currentUser={this.state.currentUser} setError={this.setError} signOut={this.signOut} />}></Route>
          <Route exact path="/lobby/:id" render={() => <Room currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser} setError={this.setError}/>}></Route>
        </Switch>
      </S.AppContainer>
    )
  }
}

export default withRouter(withFirebase(App))
