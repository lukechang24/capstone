import React, { Component } from "react"
import LobbyForm from "../LobbyForm"
import { withFirebase } from "../Firebase"

class Lobby extends Component {
    state = {
        lobbies: []
    }
    componentDidMount() {

    }
    render() {
        return(
            <div>
                THIS IS LOBBY
                <LobbyForm currentUser={this.props.currentUser}/>
            </div>
        )
    }
}

export default Lobby