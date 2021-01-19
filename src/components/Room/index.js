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
        timer: 20,
        curColor: "black",
        curSize: 5,
        mode: "pen",
        curPresentor: "",
        showVote: false,
        showPrompt: false,
        promptOptions: {}
    }
    componentDidMount() {
        if(!this.props.currentUser.id) {
            this.props.setError("You must be signed in to create/join a lobby")
            this.props.history.push("/auth/signin")
            return
        }
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                if(snapshot.exists) {
                        this.addUsertoRoom()
                        this.getUsers()
                        this.checkForRoomUpdates()
                        this.getChatLog()
                        if(snapshot.data().phase.indexOf("write") === -1 && snapshot.data().phase !== "selection" && !snapshot.data().waiting) {
                            this.props.firebase.findUser(this.props.currentUser.id).update({waiting: true})
                        } else {
                            this.props.firebase.findUser(this.props.currentUser.id).update({waiting: false})
                        }
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
                            this.setState({
                                currentCanvas: {...doc.data(), userId: user.id, displayName: user.data().displayName, id: doc.id}
                            }, () => {
                                this.props.firebase.findChatLogs(this.props.match.params.id).get()
                                    .then(snapshot => {
                                        const newMessage = {
                                            content: `What prompt did ${user.data().displayName} draw?`,
                                            type: null,
                                            isSpecial: true,
                                            createdAt: Date.now()
                                        }
                                        snapshot.forEach(chat => {
                                            const updatedChat = [...chat.data().messages]
                                            updatedChat.push(newMessage)
                                            this.props.firebase.chatRef().doc(chat.id).update({messages: updatedChat})
                                        })
                                    })
                                this.assignPromptOptions()
                            })
                            this.props.firebase.findRoom(this.props.match.params.id).update({currentCanvas: {...doc.data(), userId: user.id, displayName: user.data().displayName, id: doc.id}})
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
                        const newMessage = {
                            content: `${this.props.currentUser.displayName} has joined the room.`,
                            type: "joining",
                            isSpecial: true,
                            createdAt: Date.now()
                        }
                        snapshot1.forEach(doc => {
                            this.props.firebase.chatRef().doc(doc.id).get()
                                .then(snapshot2 => {
                                    const updatedChatLog = [...snapshot2.data().messages, newMessage]
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
                        this.props.firebase.findUser(this.props.currentUser.id).update({currentRoomId: null, joinedAt: null, isMaster: null, givenPrompts: {}, chosenPrompt: null, waiting: null, answer: null})
                        if(updatedUserList.length > 0 || updatedWaitingList.length > 0) {
                            this.props.firebase.findChatLogs(this.props.match.params.id).get()
                                .then(snapshot1 => {
                                    const newMessage = {
                                        content: `${this.props.currentUser.displayName} has left the room.`,
                                        type: "leaving",
                                        isSpecial: true,
                                        createdAt: Date.now()
                                    }
                                    snapshot1.forEach(doc => {
                                        this.props.firebase.chatRef().doc(doc.id).get()
                                            .then(snapshot2 => {
                                                const updatedChatLog = [...snapshot2.data().messages, newMessage]
                                                this.props.firebase.chatRef().doc(snapshot2.id).update({messages: updatedChatLog})
                                            })
                                    })
                                })
                        }
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
    assignPromptOptions = () => {
        this.props.firebase.findRoom(this.props.match.params.id).get()
            .then(snapshot => {
                const promptOptions = {
                    nouns: [],
                    verbs: [],
                    adjectives: []
                }
                const splitPrompt = this.state.currentCanvas.canvas.prompt.split(" ")
                const noun = splitPrompt[2]
                const verb = splitPrompt[0]
                const adjective = splitPrompt[1]
                let prompts = {...snapshot.data().prompts}
                const { nouns, verbs, adjectives } = prompts
                nouns.splice(nouns.indexOf(noun), 1)
                verbs.splice(verbs.indexOf(verb), 1)
                adjectives.splice(adjectives.indexOf(adjective), 1)
                prompts = { nouns, verbs, adjectives }
                for(let key in prompts) {
                    for(let i = 0; i < 5; i++) {
                        const randomNum = Math.floor(Math.random()*prompts[key].length)
                        promptOptions[key].push(prompts[key].splice(randomNum, 1)[0])
                    }
                    const randomNum = Math.floor(Math.random()*prompts[key].length)
                    if(key === "nouns") {
                        promptOptions[key].splice(randomNum, 1, noun)
                    }
                    if(key === "verbs") {
                        promptOptions[key].splice(randomNum, 1, verb)
                    }
                    if(key === "adjectives") {
                        promptOptions[key].splice(randomNum, 1, adjective)
                    }
                }
                this.setState({
                    promptOptions
                }, () => {
                    this.props.firebase.findRoom(snapshot.id).update({promptOptions})
                })
                // prompts["nouns"].splice(prompts["nouns"])
                // for(let key in prompts) {
                //     for(let i = 0; i < 4; i++) {
                //         const randomNum = Math.floor(Math.random()*prompts[key].length)
                //         userChoices[key].push(prompts[key].splice(randomNum, 1)[0])
                //     }
                // }
                // this.props.firebase.findUser(this.props.currentUser.id).update({givenPrompts: userChoices})
                //     .then(() => {
                //         this.props.firebase.findRoom(this.props.match.params.id).update({phase: "selection"})
                //     })
            })
    }
    assignPoints = () => {
        this.props.firebase.findUsers(this.props.match.params.id).get()
            .then(snapshot => {
                this.props.firebase.findChatLogs(this.props.match.params.id).get()
                    .then(snap => {
                        snap.forEach(chat => {
                            const updatedChat = [...chat.data().messages]
                            snapshot.forEach(doc => {
                                if(doc.id !== this.state.currentCanvas.userId) {
                                    let totalPoints = doc.data().points
                                    let points = 0
                                    const splitUserPrompt = doc.data().answer.split(" ")
                                    const splitCanvasPrompt = this.state.currentCanvas.canvas.prompt.split(" ")
                                    if(splitUserPrompt.indexOf(splitCanvasPrompt[0]) !== -1) {
                                        points += 100
                                    }
                                    if(splitUserPrompt.indexOf(splitCanvasPrompt[1]) !== -1) {
                                        points += 100
                                    }
                                    if(splitUserPrompt.indexOf(splitCanvasPrompt[2]) !== -1) {
                                        points += 50
                                    }
                                    this.props.firebase.findUser(doc.id).update({points: points + totalPoints})
                                    const newMessage = {
                                        content: `${doc.data().displayName} guessed "${doc.data().answer}" (+${points})`,
                                        type: "points",
                                        isSpecial: true,
                                        createdAt: Date.now()
                                    }
                                    updatedChat.push(newMessage)
                                }
                            })
                            const newMessage = {
                                content: `The correct prompt was "${this.state.currentCanvas.canvas.prompt}"`,
                                type: null,
                                isSpecial: true,
                                createdAt: Date.now()
                            }
                            updatedChat.push(newMessage)
                            this.props.firebase.chatRef().doc(chat.id).update({messages: [...updatedChat]})
                        })
                        
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
                    let voteDelay = false
                    if(this.state.phase.indexOf("vote") !== -1 && this.state.timer === 15) {
                        // this.assignPromptOptions()
                        // setTimeout(() => {
                            this.props.firebase.findRoom(this.props.match.params.id).update({showVote: true})
                        // }, 1000)
                    }
                    if(this.state.timer <= 1) {
                        clearInterval(this.timer)
                        let newPhase = snapPhase === "writeNouns" ? "writeVerbs" : snapPhase === "writeVerbs" ? "writeAdjectives" : snapPhase === "writeAdjectives" ? "writeFinished" : snapPhase === "selection" ? "draw" : snapPhase === "draw" ? "vote1" : `vote${parseInt(snapshot.data().phase.replace("vote", ""))+1}`
                        if(parseInt(snapPhase.replace("vote", "")) >= snapshot.data().userList.length) {
                            newPhase = snapshot.data().rounds === snapshot.data().currentRound ? "finished" : "writeNouns"
                            this.props.firebase.findRoom(this.props.match.params.id).get()
                                .then(snapshot => {
                                    this.props.firebase.findRoom(this.props.match.params.id).update({currentRound: snapshot.data().currentRound+1})
                                })
                            // this.props.firebase.findRoom(this.props.match.params.id).update({currentCanvas: null})
                            this.props.firebase.findCanvases(this.props.match.params.id).get()
                                .then(snapshot => {
                                    snapshot.forEach(doc => {
                                        this.props.firebase.findCanvas(doc.id).get()
                                            .then(canvas => {
                                                if(!canvas.data().isSaved) {
                                                    this.props.firebase.findCanvas(canvas.id).delete()
                                                } else {
                                                    this.props.firebase.findCanvas(canvas.id).update({roomId: null})
                                                }
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
                                            this.props.firebase.createCanvas({canvas: newCanvas, roomId: this.props.match.params.id, userId: doc.id, votes: [], createdAt: Date.now()})
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
                        if(snapPhase.indexOf("vote") !== -1) {
                            voteDelay = true
                        }
                        if(newPhase === "vote1") {
                            this.setCurrentCanvas()
                        }
                        const setTime = snapPhase.indexOf("write") !== -1 ? 20 : snapPhase ===  "selection" ? 125 : newPhase === "writeNouns" ? 20 : snapPhase === "draw" || snapPhase.indexOf("vote") !== -1 ? 25 : 0
                        if(voteDelay) {
                            
                        } else {
                            this.props.firebase.findRoom(this.props.match.params.id).update({phase: newPhase})
                        }
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
                        this.props.firebase.findRoom(this.props.match.params.id).update({timer: setTime})
                        if(voteDelay) {
                            this.props.firebase.findRoom(this.props.match.params.id).update({showVote: false, showPrompt: true})
                            this.assignPoints()
                            setTimeout(() => {
                                this.props.firebase.findRoom(this.props.match.params.id).update({phase: newPhase, showVote: false, showPrompt: false})
                                this.setCurrentCanvas()
                                this.startTimer()
                            }, 5000)
                        } else {
                            this.props.firebase.findRoom(this.props.match.params.id).update({phase: newPhase})
                            setTimeout(() => {
                                // this.props.firebase.findRoom(this.props.match.params.id).update({timer: setTime})
                                // if(this.state.phase.indexOf("vote") !== -1) {
                                //     this.props.firebase.findCanvas(this.state.currentCanvas.id).update({roomId: null})
                                // }
                                this.startTimer()
                            }, 1000)
                        }
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
                                showVote: doc.data().showVote
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
                                    currentCanvas: doc.data().currentCanvas,
                                    showVote: doc.data().showVote,
                                    showPrompt: doc.data().showPrompt,
                                    promptOptions: doc.data().promptOptions
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
                        type: "message",
                        isSpecial: false,
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
    handleColor = (e) => {
        this.setState({
            curColor: e.target.getAttribute("name"),
            mode: "pen"
        })
    }
    handlePaintSize = (e) => {
        const curSize = this.state.curSize
        this.setState({
            curSize: curSize === 1 ? 5 : curSize === 5 ? 10 : 1
        })
    }
    handleMode = (e) => {
        this.setState({
            mode: e.target.getAttribute("name")
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
                        <S.TimerContainer className={this.state.phase.indexOf("write") !== -1 || this.state.phase === "selection" ? "middle" : ""}>
                            <S.Timer>{this.state.timer}</S.Timer>
                        </S.TimerContainer>
                    :
                        null
                }
                <S.Container2>
                    <S.TitleDiv>
                        <S.Title>Accurate or Nah</S.Title>
                    </S.TitleDiv>
                    <S.Container3 className="gameContainer">
                        <S.WaitingContainer className={!this.props.currentUser.waiting ? "hide" : ""}>
                            <S.Waiting>Waiting for next round...</S.Waiting>
                        </S.WaitingContainer>
                        <PromptForm phase={this.state.phase}/>
                        {this.state.phase === "selection" 
                            ?
                                <PromptSelection currentUser={this.props.currentUser}/>
                            :
                                null
                        }
                        <S.Container4 className={this.state.waiting ? "" : "small" }>
                            <UserList userList={this.state.userList} waitingList={this.state.waitingList} waiting={this.state.waiting} startGame={this.startGame} isMaster={this.props.currentUser.isMaster}/>
                            {/* {this.state.phase.indexOf("vote") === -1
                                ? */}
                                    <S.Interface className={this.state.waiting || this.state.phase.indexOf("vote") !== -1 ? "hide" : ""}>
                                        <S.ColorContainer>
                                            <S.ColorRow>
                                                <S.Color className={`${this.state.curColor === "red" ? "selected" : ""}`} name="red" color="red" onClick={this.handleColor}></S.Color>
                                                <S.Color className={`${this.state.curColor === "orange" ? "selected" : ""}`} name="orange" color="orange" onClick={this.handleColor}></S.Color>
                                                <S.Color className={`${this.state.curColor === "yellow" ? "selected" : ""}`} name="yellow" color="yellow" onClick={this.handleColor}></S.Color>
                                            </S.ColorRow>
                                            <S.ColorRow>
                                                <S.Color className={`${this.state.curColor === "green" ? "selected" : ""}`} name="green" color="green" onClick={this.handleColor}></S.Color>
                                                <S.Color className={`${this.state.curColor === "blue" ? "selected" : ""}`} name="blue" color="blue" onClick={this.handleColor}></S.Color>
                                                <S.Color className={`${this.state.curColor === "purple" ? "selected" : ""}`} name="purple" color="purple" onClick={this.handleColor}></S.Color>
                                            </S.ColorRow>
                                            <S.ColorRow>
                                                <S.Color className={`${this.state.curColor === "black" ? "selected" : ""}`} name="black" color="black" onClick={this.handleColor}></S.Color>
                                                <S.Color className={`${this.state.curColor === "brown" ? "selected" : ""}`} name="brown" color="brown" onClick={this.handleColor}></S.Color>
                                                <S.Color className={`${this.state.curColor === "white" ? "selected" : ""}`} name="white" color="white" onClick={this.handleColor}></S.Color>
                                            </S.ColorRow>
                                        </S.ColorContainer>
                                        <S.Container5>
                                            <S.Square onClick={this.handlePaintSize}>
                                                <S.PaintSize className={`${this.state.curSize === 1 ? "small" : this.state.curSize === 5 ? "medium" : "large"}`}></S.PaintSize>
                                            </S.Square>
                                            <S.PaintBrush className={this.state.mode === "pen" ? "selected fas fa-paint-brush" : "fas fa-paint-brush"} name="pen" onClick={this.handleMode}></S.PaintBrush>
                                            <S.Eraser className={this.state.mode === "eraser" ? "selected fas fa-eraser" : "fas fa-eraser"} name="eraser" onClick={this.handleMode}></S.Eraser>
                                        </S.Container5>
                                    </S.Interface>
                                {/* :
                                    null
                            } */}
                        </S.Container4>
                        <S.InterfaceSpace className={this.state.waiting ? "hide" : ""}></S.InterfaceSpace>
                        {!this.state.waiting
                            ? 
                                <Draw1 currentUser={this.props.currentUser} phase={this.state.phase} curColor={this.state.curColor} curSize={this.state.curSize} mode={this.state.mode}/>
                            : 
                                null
                        }
                        {this.state.phase.indexOf("vote") !== -1 && this.state.currentCanvas
                            ?
                                <S.Container3>
                                    <ShowCanvas canvasList={this.state.canvasList} phase={this.state.phase} currentCanvas={this.state.currentCanvas} currentUser={this.props.currentUser} showVote={this.state.showVote} showPrompt={this.state.showPrompt} promptOptions={this.state.promptOptions}/>
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
                            :
                                null
                        }
                        <S.ChatContainer className={this.state.phase.indexOf("vote") !== -1 ? "hide" : ""}>
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
                        <S.ChatSpace className={this.state.phase.indexOf("vote") !== -1 ? "hide" : ""}></S.ChatSpace>
                    </S.Container3>
                </S.Container2>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Room))