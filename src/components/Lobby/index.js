import React, { Component } from "react"
import RoomForm from "../RoomForm"
import RoomList from "../RoomList"
import { withFirebase } from "../Firebase"

class Lobby extends Component {
    constructor(props) {
        super(props)
        this.unsubscribe = null
    }
    state = {
        lobbies: [],
    }
    componentDidMount() {
        this.getLobbies()
    }
    componentWillUnmount() {
        this.unsubscribe()
    }
    getLobbies = () => {
        this.unsubscribe = this.props.firebase.findRooms()
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
                {console.log(this.state.lobbies, "lobbies")}
                <input type="submit" value="log out" onClick={this.props.signOut}></input>
                <RoomForm currentUser={this.props.currentUser}/>
                <RoomList lobbies={this.state.lobbies} setUserRoomId={this.setUserRoomId}/>
            </div>
        )
    }
}

export default withFirebase(Lobby)