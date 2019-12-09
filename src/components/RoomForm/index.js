import React, { Component } from "react"
import { withFirebase } from "../Firebase"
 
class RoomForm extends Component {
    state = {
        canvasId: "",
        roomName: "",
        password: "",
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
                    userId: this.props.currentUser.id,
                    roomId: room.id,
                    createdAt: Date.now(),
                    messages: []
                }
                this.props.firebase.createChat(chatInfo)
                    .then(doc => {
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