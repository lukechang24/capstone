import React, { Component } from "react"
import Navbar from "../Navbar"
import { withFirebase } from "../Firebase"
import { withRouter } from "react-router-dom"
import S from "./style"

class SignUpForm extends Component {
    state = {
        email: "",
        password: "",
        errors: [],
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
            .catch(err => {
                console.log(err)
                const errors = []
                if(err.code.indexOf("user-not-found") !== -1) {
                    errors.push("user-not-found")
                }
                if(err.code.indexOf("invalid") !== -1) {
                    errors.push("invalid")
                }
                if(err.code.indexOf("wrong-password") !== -1) {
                    errors.push("wrong-password")
                }
                this.setState({
                    errors
                })
            })
    }
    render() {
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser}/>
                <S.SignInForm autocomplete="off" onSubmit={this.handleSubmit}>
                    <S.Heading>Sign In</S.Heading>
                    <S.InputTitle>Email</S.InputTitle>
                    <S.Input name="email" placeholder="email" onChange={this.handleInput}></S.Input>
                    <S.Error className={this.state.errors.indexOf("user-not-found") === -1 ? "hide" : ""}>This email is not registered to an account</S.Error>
                    <S.InputTitle>Password</S.InputTitle>
                    <S.Input type="password" name="password" placeholder="password" onChange={this.handleInput}></S.Input>
                    <S.Error className={this.state.errors.indexOf("wrong-password") === -1 ? "hide" : ""}>Incorrect password</S.Error>
                    <S.Error className={this.state.errors.indexOf("invalid") === -1 ? "hide" : ""}>Invalid email or password</S.Error>
                    <S.Submit type="submit">Submit</S.Submit>
                </S.SignInForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(SignUpForm))