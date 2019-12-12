import React, { Component } from "react"
import RoomForm from "../RoomForm"
import RoomList from "../RoomList"
import { withFirebase } from "../Firebase"
import S from "./style"

class Lobby extends Component {
    unsubscribe = null
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
            <S.Container1>
                <input type="submit" value="log out" onClick={this.props.signOut}></input>
                <RoomForm currentUser={this.props.currentUser}/>
                <RoomList lobbies={this.state.lobbies} setUserRoomId={this.setUserRoomId}/>
            </S.Container1>
        )
    }
}

export default withFirebase(Lobby)