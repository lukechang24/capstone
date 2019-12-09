import React, { Component } from "react"
import WaitingRoom from "../WaitingRoom"
import UserList from "../UserList"
import Draw1 from "../Draw1"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Room extends Component {
    state = {
        userList: [],
        chatLog: [],
        message: "",
        waiting: true
    }
    componentDidMount() {
        const updatedUser = {...this.props.currentUser, currentRoomId: this.props.match.params.id}
        this.props.setCurrentUser(updatedUser)
        this.addUsertoRoom()
        this.getUsers()
    }
    addUsertoRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const updatedUsers = [...snapshot.data().users]
                if(snapshot.data().users.indexOf(this.props.currentUser.id) === -1) {
                    updatedUsers.push(this.props.currentUser.id)
                }
                this.props.firebase.findRoom(snapshot.data().id).update({...snapshot.data(), users: [...updatedUsers]})
            })
        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: this.props.match.params.id})
        
    }
    getUsers = () => {
        this.props.firebase.findUsers(this.props.match.params.id)
            .onSnapshot(snapshot => {
                console.log("snapped")
                const userList = []
                snapshot.forEach(doc => {
                    userList.push(doc.data())
                })
                this.setState({
                    userList
                })
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
        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: null})
    }
    componentWillUnmount() {
        this.removeUserFromRoom()
    }
    startGame = () => {
        this.setState({
            waiting: false
        })
    }
    handleInput = e => {
        this.setState({
            message: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        this.props.firebase.chatRef().where("roomId", "==", this.props.match.params.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(this.state.message)
                    const newMessage = {
                        content: this.state.message,
                        userId: this.props.currentUser.id,
                        createdAt: Date.now()
                    }
                    const updatedChat = [...doc.data().messages]
                    updatedChat.push(newMessage)
                    this.props.firebase.chatRef().doc(doc.id).update({messages: [...updatedChat]})
                    this.setState({
                        message: ""
                    })
                })
            })
    }
    render() {
        return(
            <S.Container1>
                <S.Container2>
                    <UserList userList={this.state.userList} waiting={this.state.waiting} startGame={this.startGame}/>
                    {this.state.waiting 
                        ? null
                        : <Draw1 currentUser={this.props.currentUser}/>
                    }
                </S.Container2>
                <S.ChatContainer>
                    <S.ChatBox>

                    </S.ChatBox>
                    <S.MessageForm onSubmit={this.handleSubmit}>
                        <S.MessageInput type="text" onChange={this.handleInput} value={this.state.message} placeholder="Type your message here..."></S.MessageInput>
                    </S.MessageForm>
                </S.ChatContainer>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Room))