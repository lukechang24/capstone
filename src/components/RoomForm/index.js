import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class RoomForm extends Component {
    state = {
        canvasId: "",
        roomName: `${this.props.currentUser.displayName}'s room`,
        password: "",
        rounds: 3,
        currentRound: 1,
        waiting: true,
        phase: "",
        prompts: {
            nouns: [],
            verbs: [],
            adjectives: []
        },
        timer: 10
    }
    handleInput = e => {
        if(e.target.name === "rounds" && e.target.value.length > 1) {
            return
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        if(!this.state.roomName || !this.state.rounds) {
            return
        }
        const roomInfo = {
            ...this.state, 
            users: [],
        }
        this.props.firebase.createRoom(roomInfo)
            .then(room => {
                const chatInfo = {
                    roomId: room.id,
                    createdAt: Date.now(),
                    messages: []
                }
                this.props.firebase.createChat(chatInfo)
                    .then(doc => {
                        this.props.firebase.chatRef().doc(doc.id).update({id: doc.id})
                        this.props.firebase.findRoom(room.id).update({id: room.id, chatId: doc.id})
                        this.props.history.push(`/lobby/${room.id}`)
                    })
            })
    }
    render() {
        return(
            <S.Container1>
                <S.RoomForm onSubmit={this.handleSubmit}>
                <S.RoomCancel onClick={() => {this.props.toggleForm()}} className="fas fa-times"></S.RoomCancel>
                    <S.InputContainer>
                        <S.RoomHeading>
                            Room Name: <S.RoomInput name="roomName" value={this.state.roomName} autocomplete="off" onChange={this.handleInput}></S.RoomInput> <S.Required>*</S.Required>
                        </S.RoomHeading>
                        <S.RoomHeading>
                            Password: <S.RoomInput name="password" value={this.state.password} autocomplete="off" onChange={this.handleInput}></S.RoomInput>
                        </S.RoomHeading>
                        <S.RoomHeading>
                            Number of Rounds (1-5): <S.RoomInput type="number" width="1rem" align="center" name="rounds" value={this.state.rounds} pattern="[1-5]" title="Only Numbers 1 - 5" onChange={this.handleInput}></S.RoomInput> <S.Required>*</S.Required>
                        </S.RoomHeading>
                    </S.InputContainer>
                    <S.RoomSubmit type="submit"></S.RoomSubmit>
                </S.RoomForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(RoomForm))