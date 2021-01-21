import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class RoomForm extends Component {
    state = {
        roomName: `${this.props.currentUser.displayName}'s room`,
        password: "",
        rounds: 3,
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
        let button = document.querySelector(".submit")
        button.disabled = true
        const roomInfo = {
            roomName: this.state.roomName.trim(),
            password: this.state.password.trim(),
            rounds: parseInt(this.state.rounds),
            userList: [],
            waitingList: [],
            currentRound: 1,
            waiting: true,
            phase: "",
            prompts: {
                nouns: [],
                verbs: [],
                adjectives: []
            },
            promptOptions: {},
            showVote: false,
            timer: 10,
            createdAt: Date.now()
        }
        this.props.firebase.createRoom1(roomInfo)
            .then(room => {
                console.log(room)
                const chatInfo = {
                    roomId: room.key,
                    createdAt: Date.now(),
                    messages: []
                }
                this.props.firebase.createChat1(chatInfo)
                    .then(chat => {
                        this.props.firebase.findChatLog1(chat.key).update({id: chat.key})
                        this.props.firebase.findRoom1(room.key).update({id: room.key, chatId: chat.key})
                        this.props.history.push(`/lobby/${room.key}`)
                    })
            })
    }
    render() {
        return(
            <S.Container1>
                <S.RoomForm onSubmit={this.handleSubmit}>
                <S.CancelForm onClick={() => {this.props.toggleForm()}} className="fas fa-times"></S.CancelForm>
                    <S.InputContainer>
                        <S.Container2>
                            <S.Options>Room Name:</S.Options>
                            <S.RoomInput name="roomName" value={this.state.roomName} autocomplete="off" onChange={this.handleInput}></S.RoomInput> <S.Required>*</S.Required>
                        </S.Container2>
                        <S.Container2>
                            <S.Options>Password:</S.Options>
                            <S.RoomInput name="password" value={this.state.password} type="password" autocomplete="off" onChange={this.handleInput}></S.RoomInput>
                        </S.Container2>
                        <S.Container2>
                            <S.Options>Number of Rounds:</S.Options>
                            <select name="rounds" defaultValue="3" onChange={this.handleInput}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                            </select>
                        </S.Container2>
                    </S.InputContainer>
                    <S.RoomSubmit className="submit" type="submit" value="Create Room"></S.RoomSubmit>
                </S.RoomForm>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(RoomForm))