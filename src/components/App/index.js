import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import SignUpForm from "../SignUpForm"
import SignInForm from "../SignInForm"
import Lobby from "../Lobby"
import Room from "../Room"

class App extends Component {
  state = {
    currentUser: {},
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if(authUser) {
        console.log(authUser, "Authuser")
        this.props.firebase.findUser(authUser.uid).get()
          .then(snapshot => {
            this.setState({
              currentUser: {
                ...this.state.currentUser,
                id: authUser.uid,
                email: snapshot.data().email,
                displayName: snapshot.data().displayName,
              }
            })
          })
      } else {
        this.setState({
          currentUser: {}
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
    this.props.firebase.signOut()
    this.props.history.push("/lobby")
  }
  render() {
    return(
        <div className="App">
          {console.log(this.state.currentUser, "currentUSer")}
          <input type="submit" value="log out" onClick={this.signOut}></input>
          <Switch>
            <Route exact path="/auth/signup" render={() => <SignUpForm />}></Route>
            <Route exact path="/auth/signin" render={() => <SignInForm />}></Route>
            <Route exact path="/lobby" render={() => <Lobby currentUser={this.state.currentUser}/>}></Route>
            <Route exact path="/lobby/:id" render={() => <Room currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser}/>}></Route>
          </Switch>
        </div>
    )
  }
}

export default withRouter(withFirebase(App))
