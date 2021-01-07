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
        const filteredLobbies = this.state.lobbies.filter(room => {
            if(room.userList.length > 0) {
                return true
            } else {
                return false
            }
        })
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser} signOut={this.props.signOut}/>
                <S.CreateRoomButton type="submit" onClick={this.toggleForm} value="Create Room">Make a Room</S.CreateRoomButton>
                <S.RefreshButton onClick={() => {this.getLobbies()}}>Refresh</S.RefreshButton>
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
                filteredLobbies.length === 0 
                    ?
                        <S.NoRoom>No rooms available</S.NoRoom>
                    :
                        <RoomList lobbies={filteredLobbies} setUserRoomId={this.setUserRoomId} sendUserToRoom={this.sendUserToRoom}/>
                }
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Lobby))