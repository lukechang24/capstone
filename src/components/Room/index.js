import React, { Component } from "react"
import WaitingRoom from "../WaitingRoom"
import Draw1 from "../Draw1"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Room extends Component {
    state = {
        waiting: true
    }
    componentDidMount() {
        window.addEventListener("beforeunload", (e) => {
            e.preventDefault()
            this.removeUserFromRoom()
            return e.returnValue = ""
        })
        const updatedUser = {...this.props.currentUser, currentRoomId: this.props.match.params.id}
        this.props.setCurrentUser(updatedUser)
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const updatedUsers = [...snapshot.data().users]
                if(snapshot.data().users.indexOf(this.props.currentUser.id) === -1) {
                    updatedUsers.push(this.props.currentUser.id)
                    console.log(this.props.currentUser.id, "it")
                }
                this.props.firebase.findRoom(snapshot.data().id).update({...snapshot.data(), users: [...updatedUsers]})
            })
    }
    removeUserFromRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const updatedUsers = [...snapshot.data().users]
                updatedUsers.splice(updatedUsers.indexOf(this.props.currentUser.id), 1)
                console.log(updatedUsers)
                this.props.firebase.findRoom(snapshot.data().id).update({...snapshot.data(), users: [...updatedUsers]})
            })
    }
    componentWillUnmount() {
        this.removeUserFromRoom()
    }
    startGame = () => {
        this.setState({
            waiting: false
        })
    }
    render() {
        return(
            <S.Container1>
                {this.state.waiting 
                    ? <WaitingRoom startGame={this.startGame}/> 
                    : <Draw1 currentUser={this.props.currentUser}/>
                }
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Room))