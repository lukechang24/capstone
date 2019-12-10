import React, { Component } from "react"
import WaitingRoom from "../WaitingRoom"
import UserList from "../UserList"
import ChatLog from "../ChatLog"
import Draw1 from "../Draw1"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Room extends Component {
    state = {
        userList: [],
        chatLog: [],
        message: "",
        waiting: true,
        phase: 1,
        loading: true,
    }
    componentDidMount() {
        setTimeout(() => {
            this.addUsertoRoom()
            this.getUsers()
            this.getChatLog()
            this.setState({
                loading: false
            })
        }, 1000)
    }
    getUsers = () => {
        this.props.firebase.findUsers(this.props.match.params.id)
            .onSnapshot(snapshot => {
                const userList = []
                snapshot.forEach(doc => {
                    userList.push(doc.data())
                })
                this.setState({
                    userList
                })
            })
    }
    getChatLog = () => {
        this.props.firebase.findChatLogs(this.props.match.params.id)
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({chatLog: doc.data().messages})
                })
            })
    }
    addUsertoRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot1 => {
                const updatedUsers = [...snapshot1.data().users]
                if(snapshot1.data().users.indexOf(this.props.currentUser.id) === -1) {
                    updatedUsers.push(this.props.currentUser.id)
                }
                this.props.firebase.findRoom(snapshot1.data().id).update({...snapshot1.data(), users: [...updatedUsers]})
            })
        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: this.props.match.params.id, joinedAt: Date.now()})
        this.props.firebase.findUser(this.props.currentUser.id).get()
            .then(snapshot => {
                this.props.setCurrentUser({...snapshot.data(), id: this.props.currentUser.id, currentRoomId: this.props.match.params.id})
            })
        this.props.firebase.findChatLogs(this.props.match.params.id).get()
            .then(snapshot1 => {
                const introStatement = {
                    content: `${this.props.currentUser.displayName} has joined the room.`,
                    isSpecial: true,
                    createdAt: Date.now()
                }
                snapshot1.forEach(doc => {
                    this.props.firebase.chatRef().doc(doc.id).get()
                        .then(snapshot2 => {
                            const updatedChatLog = [...snapshot2.data().messages, introStatement]
                            this.props.firebase.chatRef().doc(snapshot2.id).update({messages: updatedChatLog})
                        })
                })
            })
    }
    // assignRoomMaster = () => {
    //     this.props.firebase.findRoom()
    // }
    removeUserFromRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const updatedUsers = [...snapshot.data().users]
                updatedUsers.splice(updatedUsers.indexOf(this.props.currentUser.id), 1)
                console.log(updatedUsers)
                this.props.firebase.findRoom(snapshot.data().id).update({...snapshot.data(), users: [...updatedUsers]})
            })
        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: null})
        this.props.firebase.findChatLogs(this.props.match.params.id).get()
            .then(snapshot1 => {
                const introStatement = {
                    content: `${this.props.currentUser.displayName} has left the room.`,
                    isSpecial: true,
                    createdAt: Date.now()
                }
                snapshot1.forEach(doc => {
                    this.props.firebase.chatRef().doc(doc.id).get()
                        .then(snapshot2 => {
                            const updatedChatLog = [...snapshot2.data().messages, introStatement]
                            this.props.firebase.chatRef().doc(snapshot2.id).update({messages: updatedChatLog})
                        })
                })
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
                        displayName: this.props.currentUser.displayName,
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
            this.state.loading
                ?
                    <S.Spinner className="fas fa-spinner fa-pulse"></S.Spinner>
                :
                    <S.Container1>
                        <S.Container2>
                            <UserList userList={this.state.userList} waiting={this.state.waiting} startGame={this.startGame}/>
                            {this.state.waiting 
                                ? 
                                    null
                                : 
                                    <Draw1 currentUser={this.props.currentUser}/>
                            }
                        </S.Container2>
                        <S.ChatContainer>
                            <ChatLog currentUser={this.props.currentUser} chatLog={this.state.chatLog}/>
                            <S.MessageForm onSubmit={this.handleSubmit}>
                                <S.MessageInput type="text" onChange={this.handleInput} value={this.state.message} placeholder="Type your message here..."></S.MessageInput>
                            </S.MessageForm>
                        </S.ChatContainer>
                    </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Room))