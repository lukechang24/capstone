import React, { Component } from "react"
import Navbar from "../Navbar"
import { withFirebase } from "../Firebase"
import { withRouter } from "react-router-dom"
import S from "./style"

class SignUpForm extends Component {
    state = {
        email: "",
        password: "",
        displayName: "",
        errors: []
    }
    componentDidMount() {
        if(window.location.href.indexOf("signup") !== -1 && this.props.currentUser.id) {
            this.props.history.push("/lobby")
        }
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
                if(!this.state.displayName) {
                    this.setState({
                        errors: [...this.state.errors, "displayName"]
                    })
                } else {
                    this.props.firebase.findUser(cred.user.uid).set({
                        email,
                        displayName,
                        currentRoomId: null,
                        id: cred.user.uid,
                        joinedAt: null,
                        isMaster: null,
                        chosenPrompt: null,
                        points: null,
                        waiting: null,
                        isAnonymous: false
                    })
                    this.props.history.push("/lobby")
                }
            })
            .catch(err => {
                const errors = []
                console.log(err)
                if(err.code.indexOf("weak-password") !== -1) {
                    errors.push("weak-password")
                }
                if(err.code.indexOf("invalid-email") !== -1) {
                    errors.push("invalid-email")
                }
                if(err.code.indexOf("in-use") !== -1) {
                    errors.push("in-use")
                }
                this.setState({
                    errors
                }, () => {
                    console.log(this.state.errors)
                })
            })
    }
    render() {
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser}/>
                <S.SignUpForm onSubmit={this.handleSubmit}>
                    <S.Heading>Create an Account</S.Heading>
                    <S.Warning>*Please use a fake Gmail/password</S.Warning>
                    <S.InputTitle>Email</S.InputTitle>
                    <S.Input name="email" autocomplete="off" onChange={this.handleInput}></S.Input>
                    <S.Error className={this.state.errors.indexOf("in-use") === -1 ? "hide" : ""}>This email is already registered with an account</S.Error>
                    <S.InputTitle>Password</S.InputTitle>
                    <S.Input type="password" name="password" autocomplete="off" onChange={this.handleInput}></S.Input>
                    <S.Error className={this.state.errors.indexOf("weak-password") === -1 ? "hide" : ""}>Password must be 6 characters or more</S.Error>
                    <S.InputTitle>Display Name</S.InputTitle>
                    <S.Input name="displayName" autocomplete="off" onChange={this.handleInput}></S.Input>
                    <S.Error className={this.state.errors.indexOf("displayName") === -1 ? "hide" : ""}>Please enter a display name</S.Error>
                    <S.Submit type="submit">Submit</S.Submit>
                </S.SignUpForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(SignUpForm))