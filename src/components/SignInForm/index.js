import React, { Component } from "react"
import Navbar from "../Navbar"
import { withFirebase } from "../Firebase"
import { withRouter } from "react-router-dom"
import S from "./style"

class SignInForm extends Component {
    state = {
        email: "",
        password: "",
        displayName: "",
        errors: [],
        signInAsGuest: false
    }
    componentDidMount() {
        if(window.location.href.indexOf("signin") !== -1 && this.props.currentUser.id) {
            this.props.history.push("/lobby")
        }
    }
    handleGuest = () => {
        this.setState({
            signInAsGuest: true
        })
    }
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit1 = e => {
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
    handleSubmit2 = (e) => {
        e.preventDefault()
        if(this.state.displayName.length <= 0) {
            return
        }
        this.props.firebase.signInAnonymously()
            .then(authUser => {
                const newUser = {
                    email: null,
                    displayName: this.state.displayName,
                    currentRoomId: null,
                    id: authUser.user.uid,
                    joinedAt: null,
                    isMaster: null,
                    chosenPrompt: null,
                    points: null,
                    waiting: null,
                    isAnonymous: true,
                    doRemove: false
                }
                this.props.firebase.findUser(authUser.user.uid).set(newUser)
                    .then(() => {
                        this.props.history.push("/lobby")
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    render() {
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser}/>
                    {!this.state.signInAsGuest
                        ?
                            <S.SignInForm autocomplete="off" onSubmit={this.handleSubmit1}>
                                <S.Heading>Sign In</S.Heading>
                                <S.InputTitle>Email</S.InputTitle>
                                <S.Input name="email" placeholder="email" onChange={this.handleInput}></S.Input>
                                <S.Error className={this.state.errors.indexOf("user-not-found") === -1 ? "hide" : ""}>This email is not registered to an account</S.Error>
                                <S.InputTitle>Password</S.InputTitle>
                                <S.Input type="password" name="password" placeholder="password" onChange={this.handleInput}></S.Input>
                                <S.Error className={this.state.errors.indexOf("wrong-password") === -1 ? "hide" : ""}>Incorrect password</S.Error>
                                <S.Error className={this.state.errors.indexOf("invalid") === -1 ? "hide" : ""}>Invalid email or password</S.Error>
                                <S.Submit type="submit">Submit</S.Submit>
                                <S.Link href="/auth/signup">Don't have an account? Click here to register</S.Link>
                                <S.GuestLink onClick={this.handleGuest}>Play as Guest</S.GuestLink>
                            </S.SignInForm>
                        :
                            <S.SignInForm autocomplete="off" onSubmit={this.handleSubmit2}>
                                <S.Heading>Sign In as Guest</S.Heading>
                                <S.InputTitle>Display Name</S.InputTitle>
                                <S.Input name="displayName" placeholder="display name" onChange={this.handleInput}></S.Input>
                                <S.Submit className="small" type="submit">Submit</S.Submit>
                                <S.Link href="/auth/signup">Want to create an account? Click here to register</S.Link>
                            </S.SignInForm>

                    }
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(SignInForm))