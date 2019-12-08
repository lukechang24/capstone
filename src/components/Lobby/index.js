import React, { Component } from "react"
import RoomForm from "../RoomForm"
import RoomList from "../RoomList"
import { withFirebase } from "../Firebase"

class Lobby extends Component {
    state = {
        lobbies: []
    }
    componentDidMount() {
        this.props.firebase.findRooms()
            .onSnapshot(snapshot => {
                const lobbies = []
                snapshot.forEach(doc => {
                    lobbies.push(doc.data())
                })
                this.setState({
                    lobbies: [...lobbies]
                })
            })
    }
    render() {
        return(
            <div>
                <RoomForm currentUser={this.props.currentUser}/>
                <RoomList lobbies={this.state.lobbies} setUserRoomId={this.setUserRoomId}/>
            </div>
        )
    }
}

export default withFirebase(Lobby)