import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { withFirebase } from "../Firebase"
import SignUpForm from "../SignUpForm"
import SignInForm from "../SignInForm"
import Draw1 from "../Draw1"
import Lobby from "../Lobby"

class App extends Component {
  state = {
    currentUser: {}
  }
  async componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if(authUser) {
        this.props.firebase.findUser(authUser.uid).get()
          .then(snapShot => {
            console.log(authUser)
            console.log(snapShot.data())
            this.setState({
              currentUser: {
                id: authUser.uid,
                email: snapShot.data().email,
                displayName: snapShot.data().displayName
              }
            })
          })
      } else {
        this.setState({
          currentUser: null
        })
      }
    })
  }
  render() {
    return(
      <Router>
        <div className="App">
          <input type="submit" value="log out" onClick={this.props.firebase.signOut}></input>
          <Switch>
            <Route exact path="/auth/signup" render={() => <SignUpForm />}></Route>
            <Route exact path="/auth/signin" render={() => <SignInForm />}></Route>
            <Route exact path="/lobby" render={() => <Lobby currentUser={this.state.currentUser}/>}></Route>
            <Route exact path="/lobby/:id" render={() => <Draw1 />}></Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default withFirebase(App);
