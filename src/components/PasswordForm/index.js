import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "../RoomForm/style"

class PasswordForm extends Component {
    state = {
        password: "",
        showError: false
    }
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        if(!this.state.password) {
            return
        }
        this.props.firebase.findRoom(this.props.currentRoomId).get()
            .then(snap => {
                if(this.state.password === snap.data().password) {
                    this.props.history.push(`/lobby/${this.props.currentRoomId}`)
                } else {
                    this.setState({
                        showError: true
                    })
                }
            })
    }
    render() {
        return(
            <S.Container1>
                <S.RoomForm onSubmit={this.handleSubmit}>
                <S.CancelForm onClick={() => {this.props.togglePassword()}} className="fas fa-times"></S.CancelForm>
                        <S.Container2>
                            <S.Options>Password:</S.Options>
                            <S.RoomInput name="password" type="password" autocomplete="off" onChange={this.handleInput}></S.RoomInput>
                        </S.Container2>
                        <S.Error className={this.state.showError ? "" : "hide"}>Incorrect Password</S.Error>
                    <S.RoomSubmit className="submit" type="submit" value="Join Room"></S.RoomSubmit>
                </S.RoomForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(PasswordForm))