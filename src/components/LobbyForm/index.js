import React, { Component } from "react"
import { withFirebase } from "../Firebase"
 
class LobbyForm extends Component {
    state = {
        canvasId: "",
        roomName: "",
        password: ""
    }
    handleInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        const roomInfo = {
            roomMasterId: this.props.currentUser.id,
            ...this.state, 
        }
        this.props.firebase.createLobby(roomInfo)
            .then(room => console.log(room.id))
        // console.log(roomInfo)
    }
    render() {
        return(
            <div>
                {console.log(this.props.currentUser, "nice")}
                <form onSubmit={this.handleSubmit}>
                    Room Name: <input name="roomName" onChange={this.handleInput}></input><br/>
                    Password: <input name="password" onChange={this.handleInput}></input> *optional<br/>
                    <input type="submit"></input>
                </form>
            </div>
        )
    }
}

export default withFirebase(LobbyForm)