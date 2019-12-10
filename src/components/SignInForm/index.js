import React, { Component } from "react"
import { withFirebase } from "../Firebase"
import { withRouter } from "react-router-dom"

class SignUpForm extends Component {
    state = {
        email: "",
        password: "",
    }
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        const { email, password } = this.state
        this.props.firebase.signInUser(email, password)
            .then(authUser => {
                this.props.history.push("/lobby")
            })
            .catch(err => console.log(err))
    }
    render() {
        return(
           <form onSubmit={this.handleSubmit}>
                <input name="email" placeholder="email" onChange={this.handleInput}></input>
                <input name="password" placeholder="password" onChange={this.handleInput}></input>
                <input type="submit"></input>
            </form>
        )
    }
}

export default withRouter(withFirebase(SignUpForm))