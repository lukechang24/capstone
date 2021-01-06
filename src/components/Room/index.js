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
    unsubscribe1 = () => {}
    unsubscribe2 = () => {}
    unsubscribe4 = () => {}
    timer = null
    state = {
        userList: [],
        waitingList: [],
        chatLog: [],
        canvasList: [],
        currentCanvas: null,
        message: "",
        waiting: true,
        phase: "",
        showMoreMessages: false,
        timer: 5,
        createNewCanvas: true,
        curColor: "black",
        curSize: 5,
    }
    componentDidMount() {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                if(!this.props.currentUser.id) {
                    this.props.setError("You must be logged in to create/join a lobby")
                    this.props.history.push("/auth/signin")
                    return
                }
                if(snapshot.exists) {
                    // if(snapshot.data().waiting) {
                        this.addUsertoRoom()
                        this.getUsers()
                        this.checkForRoomUpdates()
                        this.getChatLog()
                        if(snapshot.data().phase.indexOf("write") === -1 && snapshot.data().phase !== "selection" && !snapshot.data().waiting) {
                            this.props.firebase.findUser(this.props.currentUser.id).update({waiting: true})
                        } else {
                            this.props.firebase.findUser(this.props.currentUser.id).update({waiting: false})
                        }
                    // } else {
                        // this.props.setError("This game has already started")
                        // this.props.history.push("/lobby")
                    // }
                } else {
                    this.props.setError("The room you have searched for does not exist")
                    this.props.history.push("/lobby")
                }
            })
    }
    getUsers = () => {
        this.unsubscribe1 = this.props.firebase.findUsers(this.props.match.params.id)
            .onSnapshot(snapshot => {
                const userList = []
                const waitingList = []
                snapshot.forEach(doc => {
                    if(!doc.data().waiting) {
                        userList.push(doc.data())
                    } else {
                        waitingList.push(doc.data())
                    }
                })
                userList.sort((a,b) => a.joinedAt - b.joinedAt)
                waitingList.sort((a,b) => a.joinedAt - b.joinedAt)
                this.setState({
                    userList,
                    waitingList
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
    setCurrentCanvas = () => {
        this.props.firebase.findCanvases(this.props.match.params.id).get()
            .then(snapshot => {
                const canvasList = []
                const index = parseInt(this.state.phase.replace("vote", ""))-1
                let counter = 0
                snapshot.forEach(doc => {
                    if(counter === index) {
                        this.props.firebase.findUser(doc.data().userId).get()
                            .then(user => {
                                this.props.firebase.findRoom(this.props.match.params.id).update({currentCanvas: {...doc.data(), userId: user.id}})
                            })
                    }
                    counter++
                })
                this.setState({
                    canvasList: canvasList,
                })
            })
    }
    addUsertoRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot1 => {
                const updatedUsers = [...snapshot1.data().userList]
                const waitingList = [...snapshot1.data().waitingList]
                if(this.props.currentUser.waiting && snapshot1.data().waitingList.indexOf(this.props.currentUser.id) === -1) {
                    waitingList.push(this.props.currentUser.id)

                } else if(snapshot1.data().userList.indexOf(this.props.currentUser.id) === -1) {
                    updatedUsers.push(this.props.currentUser.id)
                }
                this.props.firebase.findRoom(this.props.match.params.id).update({userList: [...updatedUsers], waitingList: [...waitingList]})
                const isMaster = !snapshot1.data().userList[0]
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
    removeUserFromRoom = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                if(snapshot.exists) {
                    const updatedUserList = [...snapshot.data().userList]
                    const updatedWaitingList = [...snapshot.data().waitingList]
                    if(updatedUserList.indexOf(this.props.currentUser.id) !== -1 || updatedWaitingList.indexOf(this.props.currentUser.id) !== -1) {
                        if(updatedUserList.indexOf(this.props.currentUser.id) !== -1) {
                            updatedUserList.splice(updatedUserList.indexOf(this.props.currentUser.id), 1)
                        }
                        if(updatedWaitingList.indexOf(this.props.currentUser.id) !== -1) {
                            updatedWaitingList.splice(updatedWaitingList.indexOf(this.props.currentUser.id), 1)
                        }
                        this.props.firebase.findRoom(snapshot.data().id).update({userList: [...updatedUserList], waitingList: [...updatedWaitingList]})
                        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: null, joinedAt: null, isMaster: null, givenPrompts: {}, chosenPrompt: null, waiting: null})
                        this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentUser.id).get()
                            .then(snapshot => {
                                snapshot.forEach(doc => {
                                    this.props.firebase.findCanvas(doc.id).update({roomId: null})
                                })
                            })
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
                }
            })
    }
    startGame = () => {
        this.props.firebase.findRoom(this.props.match.params.id).update({waiting: false, phase: "writeNouns"})
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
        this.timer = setInterval(() => {
            this.props.firebase.findRoom(this.props.match.params.id).get()
                .then(snapshot => {
                    const updatedTime = snapshot.data().timer - 1
                    this.props.firebase.findRoom(this.props.match.params.id).update({timer: updatedTime})
                    const snapPhase = snapshot.data().phase
                    if(this.state.timer <= 1) {
                        clearInterval(this.timer)
                        let newPhase = snapPhase === "writeNouns" ? "writeVerbs" : snapPhase === "writeVerbs" ? "writeAdjectives" : snapPhase === "writeAdjectives" ? "writeFinished" : snapPhase === "selection" ? "draw" : snapPhase === "draw" ? "vote1" : `vote${parseInt(snapshot.data().phase.replace("vote", ""))+1}`

                        if(parseInt(snapPhase.replace("vote", "")) >= snapshot.data().userList.length) {
                            newPhase = snapshot.data().rounds === snapshot.data().currentRound ? "finished" : "writeNouns"
                            this.props.firebase.findRoom(this.props.match.params.id).get()
                                .then(snapshot => {
                                    this.props.firebase.findRoom(this.props.match.params.id).update({currentRound: snapshot.data().currentRound+1})
                                })
                            this.props.firebase.findRoom(this.props.match.params.id).update({currentCanvas: null})
                            this.props.firebase.findCanvases(this.props.match.params.id).get()
                                .then(snapshot => {
                                    snapshot.forEach(doc => {
                                        this.props.firebase.findCanvas(doc.id).get()
                                            .then(canvas => {
                                                this.props.firebase.findUser(canvas.data().userId).get()
                                                    .then(user => {
                                                        let totalPoints = user.data().points
                                                        let extraPoints = ((this.state.userList.length-1) - canvas.data().votes.length) * 50
                                                        canvas.data().votes.forEach(vote => {
                                                            if(vote === "accurate") {
                                                                totalPoints += 100
                                                            }
                                                        })
                                                        totalPoints += extraPoints
                                                        this.props.firebase.findUser(user.id).update({points: totalPoints})
                                                            .then(() => {
                                                                this.props.firebase.findCanvas(canvas.id).delete()
                                                            })
                                                    })
                                            })
                                    })
                                })
                            if(newPhase === "writeNouns") {
                                this.props.firebase.findUsers(this.props.match.params.id).where("waiting", "==", true).get()
                                    .then(snapshot => {
                                        snapshot.forEach(doc => {
                                            const newCanvas = {
                                                clickX: [],
                                                clickY: [],
                                                clickDrag: [],
                                                clickColor: [],
                                                clickSize: [],
                                                backgroundColor: "white",
                                                prompt: ""
                                            }
                                            this.props.firebase.createCanvas({canvas: newCanvas, roomId: this.props.match.params.id, userId: doc.id})
                                        })
                                    })
                            }
                            this.props.firebase.findRoom(this.props.match.params.id).update({userList: snapshot.data().userList.concat(snapshot.data().waitingList), waitingList: []})
                            this.props.firebase.findUsers(this.props.match.params.id).where("waiting", "==", true).get()
                                    .then(snapshot => {
                                        snapshot.forEach(doc => {
                                            this.props.firebase.findUser(doc.id).update({waiting: false})
                                        })
                                    })
                        }
                        if(newPhase.indexOf("vote") !== -1) {
                            this.setCurrentCanvas()
                        }
                        const setTime = snapPhase.indexOf("write") !== -1 ? 5 : snapPhase ===  "selection" ? 100 : newPhase === "writeNouns" ? 5 : snapPhase === "draw" || snapPhase.indexOf("vote") !== -1 ? 10 : 0
                        this.props.firebase.findRoom(this.props.match.params.id).update({phase: newPhase})
                        if(newPhase === "finished") {
                            setTimeout(() => {
                                this.props.firebase.findRoom(this.props.match.params.id).update({
                                    phase: "", 
                                    waiting: true, 
                                    timer: 20, 
                                    currentRound: 1, 
                                    currentCanvas: null, 
                                    prompts: {
                                        adjectives: [],
                                        nouns: [],
                                        verbs: []
                                    }
                                })
                            }, 10000)
                            return
                        }
                        setTimeout(() => {
                            this.props.firebase.findRoom(this.props.match.params.id).update({timer: setTime})
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
                        if(doc.exists) {
                            this.setState({
                                waiting: doc.data().waiting,
                                phase: doc.data().phase,
                                timer: doc.data().timer,
                            })
                            const isMaster = this.props.currentUser.id === snapshot.data().userList[0] || !snapshot.data().userList
                            this.props.firebase.findUser(this.props.currentUser.id).get()
                                .then(user => {
                                    if((!user.data().isMaster && isMaster) && snapshot.data().waiting === false && snapshot.data().phase !== "finished") {
                                        this.startTimer()    
                                    }
                                })
                            this.props.firebase.findUser(this.props.currentUser.id).update({isMaster})
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
    // toggleChat = () => {
    //     // let chat = document.querySelector(".chat")
    //     this.setState({
    //         showChat: !this.state.showChat
    //     })
    // }
    changeColor = (e) => {
        this.setState({
            curColor: e.target.getAttribute("name")
        })
    }
    changePaintSize = (e) => {
        const curSize = this.state.curSize
        this.setState({
            curSize: curSize === 1 ? 5 : curSize === 5 ? 10 : 1
        })
    }
    componentWillUnmount() {
        this.removeUserFromRoom()
        clearInterval(this.timer)
        this.unsubscribe1()
        this.unsubscribe2()
        this.unsubscribe4()
    }
    render() {
        return(
            <S.Container1 phase={this.state.phase}>
                {!this.state.waiting 
                    ?
                        <S.TimerContainer>
                            <S.Timer>{this.state.timer}</S.Timer>
                        </S.TimerContainer>
                    :
                        null
                }
                <S.Container2>
                    <S.TitleDiv>
                        <S.Title>Accurate or Not</S.Title>
                    </S.TitleDiv>
                    <S.Container3 className="gameContainer">
                        {this.props.currentUser.waiting 
                            ?
                                <S.WaitingContainer>
                                    <S.Waiting>Waiting for next round...</S.Waiting>
                                </S.WaitingContainer>
                            :
                                null
                        }
                        {this.state.phase.indexOf("write") !== -1 
                            ? 
                                <PromptForm phase={this.state.phase}/>
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
                                <ShowCanvas canvasList={this.state.canvasList} phase={this.state.phase} currentCanvas={this.state.currentCanvas} currentUser={this.props.currentUser}/>
                            :
                                null
                        }
                        <S.Container4 className={this.state.waiting ? "" : "small" }>
                            <UserList userList={this.state.userList} waitingList={this.state.waitingList} waiting={this.state.waiting} startGame={this.startGame} isMaster={this.props.currentUser.isMaster}/>
                            <S.Interface className={this.state.waiting ? "hide" : ""}>
                                <S.ColorContainer>
                                    <S.Color className={`${this.state.curColor === "red" ? "selected" : ""}`} name="red" color="red" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "orange" ? "selected" : ""}`} name="orange" color="orange" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "yellow" ? "selected" : ""}`} name="yellow" color="yellow" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "green" ? "selected" : ""}`} name="green" color="green" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "blue" ? "selected" : ""}`} name="blue" color="blue" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "purple" ? "selected" : ""}`} name="purple" color="purple" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "black" ? "selected" : ""}`} name="black" color="black" onClick={this.changeColor}></S.Color>
                                    <S.Color className={`${this.state.curColor === "brown" ? "selected" : ""}`} name="brown" color="brown" onClick={this.changeColor}></S.Color>
                                </S.ColorContainer>
                                <S.Container5>
                                    <S.TrashCan className="fas fa-trash-alt clear"></S.TrashCan>
                                    <S.Square onClick={this.changePaintSize}>
                                        <S.PaintSize className={`${this.state.curSize === 1 ? "small" : this.state.curSize === 5 ? "medium" : "large"}`}></S.PaintSize>
                                    </S.Square>
                                </S.Container5>
                            </S.Interface>
                        </S.Container4>
                        <S.InterfaceSpace className={this.state.waiting ? "hide" : ""}></S.InterfaceSpace>
                        {!this.state.waiting
                            ? 
                                <Draw1 currentUser={this.props.currentUser} phase={this.state.phase} curColor={this.state.curColor} curSize={this.state.curSize}/>
                            : 
                                null
                        }
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
                        <S.ChatSpace></S.ChatSpace>
                    </S.Container3>
                </S.Container2>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Room))