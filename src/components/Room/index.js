import React, { Component } from "react"
import WaitingRoom from "../WaitingRoom"
import UserList from "../UserList"
import ChatLog from "../ChatLog"
import PromptForm from "../PromptForm"
import PromptSelection from "../PromptSelection"
import Draw1 from "../Draw1"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Room extends Component {
    constructor(props) {
        super(props)
        this.unsubscribe1 = null
        this.unsubscribe2 = null
        this.unsubscribe3 = null
        this.unsubscribe4 = null
    }
    state = {
        userList: [],
        chatLog: [],
        message: "",
        waiting: true,
        phase: null,
        showMoreMessages: false,
        timer: 20,
    }
    componentDidMount() {
        this.addUsertoRoom()
        this.getUsers()
        this.checkForRoomUpdates()
        this.updateRoomMaster()
        this.getChatLog()
    }
    getUsers = () => {
        this.unsubscribe1 = this.props.firebase.findUsers(this.props.match.params.id)
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
        this.unsubscribe2 = this.props.firebase.findChatLogs(this.props.match.params.id)
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({chatLog: doc.data().messages}, () => {
                        const chatDiv = document.querySelector(".chatbox")
                        if(chatDiv.scrollTop > chatDiv.scrollHeight-700 || this.state.chatLog.length === 0) {
                            console.log(chatDiv.scrollTop, "top")
                            console.log(chatDiv.scrollHeight, "height")
                            chatDiv.scrollTop = chatDiv.scrollHeight
                            this.setState({
                                showMoreMessages: false
                            })
                        } else {
                            this.setState({
                                showMoreMessages: true
                            })
                        }
                    })
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
                this.props.firebase.findRoom(snapshot1.data().id).update({users: [...updatedUsers]})
                const isMaster = !snapshot1.data().users[0]
                this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: this.props.match.params.id, joinedAt: Date.now(), isMaster})
                if(isMaster) {
                    return
                }
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
                                    console.log(snapshot2.data(), "hi1")
                                    const updatedChatLog = [...snapshot2.data().messages, introStatement]
                                    this.props.firebase.chatRef().doc(snapshot2.id).update({messages: updatedChatLog})
                                })
                        })
                    })
            })
    }
    updateRoomMaster = () => {
        this.unsubscribe3 = this.props.firebase.findRoom(this.props.match.params.id)
            .onSnapshot(snapshot => {
                const isMaster = this.props.currentUser.id === snapshot.data().users[0]
                this.props.firebase.findUser(this.props.currentUser.id).update({isMaster})
            })
    }
    removeUserFromRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const updatedUsers = [...snapshot.data().users]
                updatedUsers.splice(updatedUsers.indexOf(this.props.currentUser.id), 1)
                this.props.firebase.findRoom(snapshot.data().id).update({users: [...updatedUsers]})
            })
        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: null, joinedAt: null, isMaster: null, givenPrompts: {}})
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
    startGame = () => {
        this.props.firebase.findRoom(this.props.match.params.id).update({waiting: false, phase: "write"})
        this.startTimer()
    }
    assignUserPrompts = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const userChoices = {
                    nouns: [],
                    verbs: [],
                    adjectives: []
                }
                const prompts = {...snapshot.data().prompts}
                for(let key in prompts) {
                    for(let i = 0; i < 3; i++) {
                        const randomNum = Math.floor(Math.random()*prompts[key].length)
                        userChoices[key].push(prompts[key].splice(randomNum, 1)[0])
                    }
                }
                console.log(userChoices)
                this.props.firebase.findUser(this.props.currentUser.id).update({givenPrompts: userChoices})
                    .then(() => {
                        this.props.firebase.findRoom(this.props.match.params.id).update({phase: "selection"})
                    })
            })
    }
    startTimer = () => {
        const timer = setInterval(() => {
            this.props.firebase.findRoom(this.props.match.params.id).get()
                .then(snapshot => {
                    const updatedTime = snapshot.data().timer - 1
                    this.props.firebase.findRoom(this.props.match.params.id).update({timer: updatedTime})
                    if(this.state.timer === 1 || this.state.timer <= 0) {
                        const phase = snapshot.data().phase === "write" ? "writeFinished" : snapshot.data().phase === "selection" ? "draw" : "finished"
                        clearInterval(timer)
                        setTimeout(() => {
                            const setTime = snapshot.data().phase === "write" ? 20 : snapshot.data().phase === "selection" ? 50 : 5
                            this.props.firebase.findRoom(this.props.match.params.id).update({phase: phase, timer: setTime})
                            this.startTimer()
                        }, 1000)
                    }
                })
        },1000)
    }
    checkForRoomUpdates = () => {
        this.unsubscribe4 = this.props.firebase.findRoom(this.props.match.params.id)
            .onSnapshot(snapshot => {
                this.props.firebase.findRoom(snapshot.id).get()
                    .then(doc => {
                        this.setState({
                            waiting: doc.data().waiting,
                            phase: doc.data().phase,
                            timer: doc.data().timer,
                        })
                        if(doc.data().phase === "writeFinished") {
                            this.assignUserPrompts()
                        }
                    })
            })
    }
    handleInput = e => {
        this.setState({
            message: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault()
        if(!this.state.message) {
            return
        }
        this.props.firebase.chatRef().where("roomId", "==", this.props.match.params.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
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
    scrollToBottomOfChat = () => {
        const chatBox = document.querySelector(".chatbox")
        chatBox.scrollTop = chatBox.scrollHeight
        this.setState({
            showMoreMessages: false
        })
    }
    componentWillUnmount() {
        this.removeUserFromRoom()
        this.unsubscribe1()
        this.unsubscribe2()
        this.unsubscribe3()
        this.unsubscribe4()
    }
    render() {
        return(
            <S.Container1>
                {!this.state.waiting 
                    ?
                        <S.TimerContainer>
                            <S.Timer>{this.state.timer}</S.Timer>
                        </S.TimerContainer>
                    :
                        null
                }
                {this.state.phase === "write" 
                    ? 
                        <PromptForm />
                    :
                        null
                }
                {this.state.phase === "selection" 
                    ?
                        <PromptSelection currentUser={this.props.currentUser}/>
                    :
                        null
                }
                <S.Container2>
                    <UserList userList={this.state.userList} waiting={this.state.waiting} startGame={this.startGame} isMaster={this.props.currentUser.isMaster}/>
                    {this.state.waiting 
                        ? 
                            null
                        : 
                            <Draw1 currentUser={this.props.currentUser}/>
                    }
                </S.Container2>
                <S.ChatContainer>
                    <ChatLog currentUser={this.props.currentUser} chatLog={this.state.chatLog} showMoreMessages={this.state.showMoreMessages}/>
                    <S.MessageForm onSubmit={this.handleSubmit}>
                        {this.state.showMoreMessages 
                            ?
                                <S.MoreMessages onClick={this.scrollToBottomOfChat}>Show recent messages</S.MoreMessages> 
                            :
                                null
                        }
                        <S.MessageInput type="text" onChange={this.handleInput} value={this.state.message} placeholder="Type your message here..."></S.MessageInput>
                    </S.MessageForm>
                </S.ChatContainer>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Room))