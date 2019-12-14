import React, { Component } from "react"
import Navbar from "../Navbar"
import { withFirebase } from "../Firebase"
import { withRouter } from "react-router-dom"

class SignUpForm extends Component {
    state = {
        email: "",
        password: "",
        displayName: "",
    }
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        const { email, password, displayName } = this.state
        this.props.firebase.createUser(email, password)
            .then(cred => {
                this.props.firebase.findUser(cred.user.uid).set({
                    email,
                    displayName,
                    currentRoomId: null,
                    id: cred.user.uid,
                    joinedAt: null,
                    isMaster: null,
                    chosenPrompt: null,
                    points: null,
                    waiting: null
                })
                this.props.history.push("/lobby")
            })
            .catch(err => console.log(err))
    }
    render() {
        return(
            <div>
                <Navbar currentUser={this.props.currentUser}/>
                <form onSubmit={this.handleSubmit}>
                    <input name="email" placeholder="email" autocomplete="off" onChange={this.handleInput}></input>
                    <input type="password" name="password" placeholder="password" autocomplete="off" onChange={this.handleInput}></input>
                    <input name="displayName" placeholder="display name" autocomplete="off" onChange={this.handleInput}></input>
                    <input type="submit"></input>
                </form>
            </div>
        )
    }
}

export default withRouter(withFirebase(SignUpForm))