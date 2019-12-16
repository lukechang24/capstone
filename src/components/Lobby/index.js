import React, { Component } from "react"
import Navbar from "../Navbar"
import RoomForm from "../RoomForm"
import RoomList from "../RoomList"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Lobby extends Component {
    state = {
        lobbies: [],
        showForm: false,
        loading: false
    }
    componentDidMount() {
        this.getLobbies()
    }
    getLobbies = () => {
        console.log("got game")
        this.setState({
            loading: true
        })
        setTimeout(() => {
            this.props.firebase.findRooms().get()
                .then(snapshot => {
                    this.setState({
                        loading: false
                    })
                    const lobbies = []
                    snapshot.forEach(doc => {
                        lobbies.push(doc.data())
                    })
                    this.setState({
                        lobbies: [...lobbies],
                    })
                })
        }, 1000)
    }
    toggleForm = () => {
        if(!this.props.currentUser.id) {
            this.props.setError("You must be logged in to create/join a room")
            this.props.history.push("/auth/signin")
            return
        }
        this.setState({
            showForm: !this.state.showForm
        })
    }
    sendUserToRoom = roomId => {
        this.props.history.push(`/lobby/${roomId}`)
    }
    render() {
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser} signOut={this.props.signOut}/>
                <S.CreateRoomButton type="submit" onClick={this.toggleForm} value="Create Room">Make a Room</S.CreateRoomButton>
                <button onClick={() => {this.getLobbies()}}>Refresh</button>
                {this.state.showForm 
                    ?
                        <RoomForm currentUser={this.props.currentUser} toggleForm={this.toggleForm}/>
                    :
                        null
                }
                {this.state.loading 
                    ?
                        <S.Loading className="fas fa-spinner fa-pulse"></S.Loading>
                    :
                this.state.lobbies.length === 0 
                    ?
                        <S.NoRoom>No rooms available</S.NoRoom>
                    :
                        <RoomList lobbies={this.state.lobbies} setUserRoomId={this.setUserRoomId} sendUserToRoom={this.sendUserToRoom}/>
                }
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Lobby))