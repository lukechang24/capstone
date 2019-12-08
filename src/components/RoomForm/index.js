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
            users: [this.props.currentUser.id],
        }
        this.props.firebase.createLobby(roomInfo)
            .then(room => {
                this.props.firebase.findRoom(room.id).update({id: room.id})
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