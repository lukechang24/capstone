import React, { Component } from "react"
import { withFirebase } from "../Firebase"
 
class RoomForm extends Component {
    state = {
        canvasId: "",
        roomName: "",
        password: "",
        started: false
    }
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
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
                    })
            })
    }
    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    Room Name: <input name="roomName" onChange={this.handleInput}></input><br/>
                    Password: <input name="password" onChange={this.handleInput}></input> *optional<br/>
                    <input type="submit"></input>
                </form>
            </div>
        )
    }
}

export default withFirebase(RoomForm)