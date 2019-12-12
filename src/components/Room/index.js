import React, { Component } from "react"
import WaitingRoom from "../WaitingRoom"
import UserList from "../UserList"
import ChatLog from "../ChatLog"
import PromptForm from "../PromptForm"
import PromptSelection from "../PromptSelection"
import Draw1 from "../Draw1"
import ShowCanvas from "../ShowCanvas"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Room extends Component {
    unsubscribe1 = null
    unsubscribe2 = null
    unsubscribe3 = null
    unsubscribe4 = null
    state = {
        userList: [],
        chatLog: [],
        canvasList: [],
        currentCanvas: {
            clickX: [],
            clickY: [],
            clickDrag: [],
            clickColor: [],
            clickSize: [],
            backgroundColor: "white",
            prompt: ""
        },
        message: "",
        waiting: true,
        phase: "",
        showMoreMessages: false,
        timer: 20,
        doGetCanvases: true
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
    getCanvases = () => {
        console.log(this.state.phase, "OPHASE")
        this.props.firebase.findCanvases(this.props.match.params.id).get()
            .then(snapshot => {
                const canvasList = []
                snapshot.forEach(doc => {
                    this.props.firebase.findUser(doc.data().userId).get()
                        .then(user => {
                            canvasList.push({...doc.data().canvas, displayName: user.data().displayName})
                            this.setState({
                                canvasList: canvasList,
                                doGetCanvases: false
                            })
                            console.log(canvasList)
                            const index = parseInt(this.state.phase.replace("vote", ""))-1
                            console.log(index," index")
                            const oneCanvas = canvasList[index]
                            console.log(oneCanvas, "one canvas")
                            this.props.firebase.findRoom(this.props.match.params.id).update({currentCanvas: {...oneCanvas}})
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
                this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: this.props.match.params.id, joinedAt: Date.now(), isMaster, points: 0, chosenPrompt: null, givenPrompts: {}})
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
                const isMaster = this.props.currentUser.id === snapshot.data().users[0] || !snapshot.data().users
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
        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: null, joinedAt: null, isMaster: null, givenPrompts: {}, chosenPrompt: null})
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
                this.props.firebase.findUser(this.props.currentUser.id).update({givenPrompts: userChoices})
                    .then(() => {
                        this.props.firebase.findRoom(this.props.match.params.id).update({phase: "selection"})
                    })
            })
    }
    startTimer = () => {
        this.setState({
            doGetCanvases: true
        })
        const timer = setInterval(() => {
            this.props.firebase.findRoom(this.props.match.params.id).get()
                .then(snapshot => {
                    const updatedTime = snapshot.data().timer - 1
                    this.props.firebase.findRoom(this.props.match.params.id).update({timer: updatedTime})
                    const snapPhase = snapshot.data().phase
                    if(snapPhase.indexOf("vote") !== -1 && this.state.doGetCanvases) {
                        this.getCanvases()
                    }
                    if(this.state.timer === 1 || this.state.timer <= 0) {
                        let phase = snapPhase === "write" ? "writeFinished" : snapPhase === "selection" ? "draw" : snapPhase === "draw" ? "vote1" : snapPhase === "vote1" ? "vote2" : snapPhase === "vote2" ? "vote3" : snapPhase === "vote3" ? "vote4" : "finished"
                        clearInterval(timer)
                        if(snapPhase === `vote${snapshot.data().users.length}`) {
                            phase = "write"
                            this.props.firebase.findRoom(this.props.match.params.id).update({currentCanvas: {
                                clickX: [],
                                clickY: [],
                                clickDrag: [],
                                clickColor: [],
                                clickSize: [],
                                backgroundColor: "white",
                                prompt: ""
                            }})
                        }
                        setTimeout(() => {
                            const setTime = snapPhase === "write" ? 5 : snapPhase === "selection" ? 10 : snapPhase === "draw" || snapPhase === "vote1" || snapPhase === "vote2" || snapPhase === "vote3" || snapPhase === "vote4" || snapPhase === "vote5" || snapPhase === "vote6" || snapPhase === "vote7" || snapPhase === "vote8" ? 15 : 0
                            this.props.firebase.findRoom(this.props.match.params.id).update({phase: phase, timer: setTime})
                            this.startTimer()
                        }, 3000)
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
                        if(doc.data().phase === "write") {
                            this.props.firebase.findCanvases(this.props.match.params.id).get()
                                .then(snapshot => {
                                    snapshot.forEach(doc => {
                                        this.props.firebase.findCanvas(doc.id).update({roomId: null})
                                    })
                                })
                            this.props.firebase.createCanvas({
                                canvas: {
                                    clickX: [],
                                    clickY: [],
                                    clickDrag: [],
                                    clickColor: [],
                                    clickSize: [],
                                    backgroundColor: "white",
                                    prompt: ""
                                }, 
                                roomId: this.props.match.params.id, 
                                userId: this.props.currentUser.id
                            })
                        }
                        if(doc.data().phase === "writeFinished") {
                            this.assignUserPrompts()
                        }
                        if(doc.data().phase === "draw") {
                            this.props.firebase.findUser(this.props.currentUser.id).get()
                                .then(snapshot => {
                                    this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", snapshot.id).get()
                                        .then(doc => {
                                            doc.forEach(canvas => {
                                                this.props.firebase.findCanvas(canvas.id).get()
                                                    .then(snap => {
                                                        this.props.firebase.findCanvas(snap.id).update({canvas: {...snap.data().canvas, prompt: snapshot.data().chosenPrompt}})
                                                        })
                                            })
                                        })
                                })
                        }
                        if(doc.data().phase.indexOf("vote") !== -1) {
                            this.setState({
                                currentCanvas: doc.data().currentCanvas
                            })
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
                {this.state.phase.indexOf("vote") !== -1 && this.state.currentCanvas
                    ?
                        <ShowCanvas canvasList={this.state.canvasList} phase={this.state.phase} currentCanvas={this.state.currentCanvas}/>
                    :
                        null
                }
                <S.Container2>
                    <UserList userList={this.state.userList} waiting={this.state.waiting} startGame={this.startGame} isMaster={this.props.currentUser.isMaster}/>
                    {!this.state.waiting
                        ? 
                            <Draw1 currentUser={this.props.currentUser} phase={this.state.phase}/>
                        : 
                            null
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