import React, { Component } from "react"
import Navbar from "../Navbar"
import RoomForm from "../RoomForm"
import RoomList from "../RoomList"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Lobby extends Component {
    unsubscribe = null
    state = {
        lobbies: [],
        showForm: false
    }
    componentDidMount() {
        this.getLobbies()
        // setTimeout(() => {
        //     if(!this.props.currentUser.id) {
        //         this.props.setError("You must be logged in to create/join a room")
        //         this.props.history.push("/auth/signin")
        //         return
        //     }
        // }, 500)
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
    render() {
        return(
            <S.Container1>
                <Navbar currentUser={this.props.currentUser} signOut={this.props.signOut}/>
                <S.Container2>
                    <S.CreateRoomButton type="submit" onClick={this.toggleForm} value="Create Room">Make a Room</S.CreateRoomButton>
                    {this.state.showForm 
                        ?
                            <RoomForm currentUser={this.props.currentUser} toggleForm={this.toggleForm}/>
                        :
                            null
                    }
                    <RoomList lobbies={this.state.lobbies} setUserRoomId={this.setUserRoomId}/>
                </S.Container2>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Lobby))