import React, { Component } from "react"
import Navbar from "../Navbar"
import RoomForm from "../RoomForm"
import PasswordForm from "../PasswordForm"
import RoomList from "../RoomList"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Lobby extends Component {
    state = {
        lobbies: [],
        showForm: false,
        showPasswordForm: false,
        currentRoomId: "",
        loading: false
    }
    componentDidMount() {
        this.interval = setTimeout(() => {
            if(!this.props.currentUser.id) {
                this.props.history.push("/auth/signin")
            } else {
                this.getLobbies()
            }
        }, 500)
    }
    getLobbies = () => {
        this.setState({
            loading: true
        })
        setTimeout(() => {
            this.props.firebase.roomRef1().once("value", rooms => {
                const lobbies = []
                this.setState({
                    loading: false
                })
                rooms.forEach(room => {
                    lobbies.push(room.val())
                })
                console.log(lobbies)
                this.setState({
                    lobbies: [...lobbies]
                })
                    
            })
        }, 1000)
    }
    toggleForm = () => {
        if(!this.props.currentUser.id) {
            this.props.setError("You must be signed in to create/join a room")
            this.props.history.push("/auth/signin")
            return
        }
        this.setState({
            showForm: !this.state.showForm
        })
    }
    togglePassword = () => {
        this.setState({
            showPasswordForm: !this.state.showPasswordForm,
        })
    }
    sendUserToRoom = roomId => {
        this.props.firebase.findRoom1(roomId).once("value", room => {
            if(room.exists()) {
                if(room.val().password.length > 0) {
                    this.togglePassword()
                    this.setState({
                        currentRoomId: room.key
                    })
                } else {
                    this.props.history.push(`/lobby/${roomId}`)
                }
            } else {
                this.props.setError("The room you have searched for does not exist")
                this.getLobbies()
            }
        })
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    render() {
        const filteredLobbies = this.state.lobbies.filter(room => {
            if(room.userList){
                if(room.userList.length > 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        })
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser} signOut={this.props.signOut}/>
                <S.CreateRoomButton type="submit" onClick={this.toggleForm} value="Create Room">Create a Room</S.CreateRoomButton>
                <S.RefreshButton onClick={() => {this.getLobbies()}}>Refresh</S.RefreshButton>
                {this.state.showForm 
                    ?
                        <RoomForm currentUser={this.props.currentUser} toggleForm={this.toggleForm}/>
                    :
                        null
                }
                {this.state.showPasswordForm
                    ?
                        <PasswordForm currentRoomId={this.state.currentRoomId} togglePassword={this.togglePassword}/>
                    :
                        null
                }
                {this.state.loading 
                    ?
                        <S.Loading className="fas fa-spinner fa-pulse"></S.Loading>
                    :
                filteredLobbies.length === 0 
                    ?
                        <S.NoRoom>{this.props.currentUser ? "No rooms available" : "Sign in to join a lobby"}</S.NoRoom>
                    :
                        <RoomList lobbies={filteredLobbies} setUserRoomId={this.setUserRoomId} sendUserToRoom={this.sendUserToRoom}/>
                }
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Lobby))