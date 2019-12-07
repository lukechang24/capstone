import React, { Component } from "react"
import LobbyForm from "../LobbyForm"
import LobbyList from "../LobbyList"
import { withFirebase } from "../Firebase"

class Lobby extends Component {
    state = {
        lobbies: []
    }
    componentDidMount() {
        this.props.firebase.allLobbies()
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
                <LobbyForm currentUser={this.props.currentUser}/>
                <LobbyList lobbies={this.state.lobbies}/>
            </div>
        )
    }
}

export default withFirebase(Lobby)