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
        timer: 10,
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
        this.props.firebase.findRoom1(this.props.match.params.id).once("value", room => {
            if(room.exists()) {
                    this.addUsertoRoom()
                    this.getUsers()
                    this.checkForRoomUpdates()
                    this.getChatLog()
                    if(room.val().phase.indexOf("write") === -1 && room.val().phase !== "selection" && !room.val().waiting) {
                        this.props.firebase.findUser1(this.props.currentUser.id).update({waiting: true})
                    } else {
                        this.props.firebase.findUser1(this.props.currentUser.id).update({waiting: false})
                    }
            } else {
                this.props.setError("The room you have searched for does not exist")
                this.props.history.push("/lobby")
            }
        })
    }
    getUsers = () => {
        this.unsubscribe1 = this.props.firebase.userRef1().orderByChild("currentRoomId").equalTo(this.props.match.params.id).on("value", users => {
            const userList = []
            const waitingList = []
            users.forEach(user => {
                if(!user.val().waiting) {
                    userList.push(user.val())
                } else {
                    waitingList.push(user.val())
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
        this.unsubscribe2 = this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).on("value", chats => {
            chats.forEach(chat => {
                this.setState({
                    chatLog: chat.val().messages ? chat.val().messages : []
                }, () => {
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
        this.props.firebase.canvasRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", canvases => {
            const canvasList = []
            const index = parseInt(this.state.phase.replace("vote", ""))-1
            let counter = 0
            canvases.forEach(canvas => {
                if(counter === index) {
                    this.props.firebase.findUser1(canvas.val().userId).once("value", user => {
                        this.setState({
                            currentCanvas: {...canvas.val(), userId: user.key, displayName: user.val().displayName, id: canvas.key}
                        }, () => {
                            this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", chats => {
                                const newMessage = {
                                    content: `What prompt did ${user.val().displayName} draw?`,
                                    type: "",
                                    isSpecial: true,
                                    createdAt: Date.now()
                                }
                                chats.forEach(chat => {
                                    const updatedChat = chat.val().messages ? [...chat.val().messages] : []
                                    updatedChat.push(newMessage)
                                    this.props.firebase.findChatLog1(chat.key).update({messages: updatedChat})
                                })
                            })
                            this.assignPromptOptions()
                        })
                        this.props.firebase.findRoom1(this.props.match.params.id).update({currentCanvas: {...canvas.val(), userId: user.key, displayName: user.val().displayName, id: canvas.key}})
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
        this.props.firebase.findRoom1(this.props.match.params.id).once("value", room => {
            if(!room.exists()) {
                return
            }
            const updatedUsers = room.val().userList ? [...room.val().userList] : []
            const waitingList = room.val().waitingList ? [...room.val().waitingList] : []
            const isMaster = !updatedUsers[0]
            console.log(isMaster, updatedUsers)
            if(this.props.currentUser.waiting && waitingList.indexOf(this.props.currentUser.id) === -1) {
                waitingList.push(this.props.currentUser.id)

            } else if(updatedUsers.indexOf(this.props.currentUser.id) === -1) {
                updatedUsers.push(this.props.currentUser.id)
            }
            console.log(updatedUsers)
            this.setState({
                userList: [...updatedUsers],
                waitingList: [...waitingList]
            }, () => {
                this.props.firebase.findRoom1(this.props.match.params.id).update({userList: [...updatedUsers], waitingList: [...waitingList]})
                this.props.firebase.findUser1(this.props.currentUser.id).update({currentRoomId: this.props.match.params.id, joinedAt: Date.now(), isMaster, points: 0, chosenPrompt: "", givenPrompts: {}})
            })
            if(isMaster) {
                return
            }
            this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", chats => {
                const newMessage = {
                    content: `${this.props.currentUser.displayName} has joined the room.`,
                    type: "joining",
                    isSpecial: true,
                    createdAt: Date.now()
                }
                chats.forEach(chat1 => {
                    this.props.firebase.findChatLog1(chat1.key).once("value", chat2 => {
                        const updatedChatLog = chat2.val().messages ? [...chat2.val().messages] : []
                        updatedChatLog.push(newMessage)
                        this.props.firebase.findChatLog1(chat2.key).update({messages: updatedChatLog})
                    })
                })
            })
        })
    }
    removeUserFromRoom = () => {
        this.props.firebase.findRoom1(this.props.match.params.id).once("value", room => {
            if(room.exists()) {
                const updatedUserList = room.val().userList ? [...room.val().userList] : []
                const updatedWaitingList = room.val().waitingList ? [...room.val().waitingList] : []
                if(updatedUserList.indexOf(this.props.currentUser.id) !== -1 || updatedWaitingList.indexOf(this.props.currentUser.id) !== -1) {
                    if(updatedUserList.indexOf(this.props.currentUser.id) !== -1) {
                        updatedUserList.splice(updatedUserList.indexOf(this.props.currentUser.id), 1)
                    }
                    if(updatedWaitingList.indexOf(this.props.currentUser.id) !== -1) {
                        updatedWaitingList.splice(updatedWaitingList.indexOf(this.props.currentUser.id), 1)
                    }
                    this.props.firebase.findRoom1(room.key).update({userList: [...updatedUserList], waitingList: [...updatedWaitingList]})
                    this.props.firebase.findUser1(this.props.currentUser.id).update({currentRoomId: "", joinedAt: 0, isMaster: false, givenPrompts: "", chosenPrompt: "", waiting: false, answer: ""})
                    if(updatedUserList.length > 0 || updatedWaitingList.length > 0) {
                        this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", chats => {
                            const newMessage = {
                                content: `${this.props.currentUser.displayName} has left the room.`,
                                type: "leaving",
                                isSpecial: true,
                                createdAt: Date.now()
                            }
                            chats.forEach(chat => {
                                const updatedChatLog = [...chat.val().messages, newMessage]
                                this.props.firebase.findChatLog1(chat.key).update({messages: updatedChatLog})
                            })
                        })
                    }
                }
            }
        })
    }
    startGame = () => {
        this.props.firebase.findRoom1(this.props.match.params.id).update({waiting: false, phase: "writeNouns"})
        this.startTimer()
    }
    assignUserPrompts = () => {
        this.props.firebase.findRoom1(this.props.match.params.id).once("value", room => {
            const userChoices = {
                nouns: [],
                verbs: [],
                adjectives: []
            }
            const prompts = {...room.val().prompts}
            for(let key in prompts) {
                for(let i = 0; i < 3; i++) {
                    const randomNum = Math.floor(Math.random()*prompts[key].length)
                    userChoices[key].push(prompts[key].splice(randomNum, 1)[0])
                }
            }
            this.props.firebase.findUser1(this.props.currentUser.id).update({givenPrompts: userChoices})
                .then(() => {
                    this.props.firebase.findRoom1(room.key).update({phase: "selection"})
                })
        })
    }
    assignPromptOptions = () => {
        this.props.firebase.findRoom1(this.props.match.params.id).once("value", room => {
            if(!room.exists()) {
                return
            }
            const promptOptions = {
                nouns: [],
                verbs: [],
                adjectives: []
            }
            const splitPrompt = this.state.currentCanvas.canvas.prompt.split(" ")
            const noun = splitPrompt[2]
            const verb = splitPrompt[0]
            const adjective = splitPrompt[1]
            let prompts = {...room.val().prompts}
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
                this.props.firebase.findRoom1(room.key).update({promptOptions})
            })
        })
    }
    assignPoints = () => {
        this.props.firebase.userRef1().orderByChild("currentRoomId").equalTo(this.props.match.params.id).once("value", users => {
            this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", chats => {
                chats.forEach(chat => {
                    const updatedChat = [...chat.val().messages]
                    users.forEach(user => {
                        if(user.key !== this.state.currentCanvas.userId) {
                            let totalPoints = user.val().points
                            let points = 0
                            const splitUserPrompt = user.val().answer.split(" ")
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
                            this.props.firebase.findUser1(user.key).update({points: points + totalPoints})
                            const newMessage = {
                                content: `${user.val().displayName} guessed "${user.val().answer}" (+${points})`,
                                type: "points",
                                isSpecial: true,
                                createdAt: Date.now()
                            }
                            updatedChat.push(newMessage)
                        }
                    })
                    const newMessage = {
                        content: `The correct prompt was "${this.state.currentCanvas.canvas.prompt}"`,
                        type: "",
                        isSpecial: true,
                        createdAt: Date.now()
                    }
                    updatedChat.push(newMessage)
                    this.props.firebase.findChatLog1(chat.key).update({messages: [...updatedChat]})
                })
            })
        })
    }
    startTimer = () => {
        this.timer = setInterval(() => {
            this.props.firebase.findRoom1(this.props.match.params.id).once("value", room => {
                if(!room.exists()) {
                    return
                }
                const updatedTime = room.val().timer - 1
                this.props.firebase.findRoom1(this.props.match.params.id).update({timer: updatedTime})
                const snapPhase = room.val().phase
                let voteDelay = false
                if(this.state.phase.indexOf("vote") !== -1 && this.state.timer === 15) {
                    // this.assignPromptOptions()
                    // setTimeout(() => {
                        this.props.firebase.findRoom1(this.props.match.params.id).update({showVote: true})
                    // }, 1000)
                }
                if(this.state.timer <= 0) {
                    clearInterval(this.timer)
                    let newPhase = snapPhase === "writeNouns" ? "writeVerbs" : snapPhase === "writeVerbs" ? "writeAdjectives" : snapPhase === "writeAdjectives" ? "writeFinished" : snapPhase === "selection" ? "draw" : snapPhase === "draw" ? "vote1" : `vote${parseInt(room.val().phase.replace("vote", ""))+1}`
                    if(parseInt(snapPhase.replace("vote", "")) >= room.val().userList.length) {
                        newPhase = room.val().rounds === room.val().currentRound ? "finished" : "writeNouns"
                        this.props.firebase.findRoom1(this.props.match.params.id).update({currentRound: room.val().currentRound+1})
                        this.props.firebase.canvasRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", canvases => {
                            canvases.forEach(canvas => {
                                if(!canvas.val().isSaved) {
                                    this.props.firebase.findCanvas1(canvas.key).remove()
                                } else {
                                    this.props.firebase.findCanvas1(canvas.key).update({roomId: ""})
                                }   
                            })
                        })
                        if(newPhase === "writeNouns") {
                            this.props.firebase.userRef1().orderByChild("currentRoomId").equalTo(this.props.match.params.id).once("value", users => {
                                users.forEach(user => {
                                    if(user.val().waiting) {
                                        const newCanvas = {
                                            clickX: [],
                                            clickY: [],
                                            clickDrag: [],
                                            clickColor: [],
                                            clickSize: [],
                                            backgroundColor: "white",
                                            prompt: ""
                                        }
                                        this.props.firebase.createCanvas1({canvas: newCanvas, roomId: this.props.match.params.id, userId: user.key, votes: [], createdAt: Date.now(), isSaved: false})
                                        .then(() => {
                                            this.props.firebase.findUser1(user.key).update({waiting: false})
                                        })
                                    }
                                })
                            })
                        }
                        const waitingList = room.val().waitingList ? room.val().waitingList : []
                        this.props.firebase.findRoom1(this.props.match.params.id).update({userList: room.val().userList.concat(waitingList), waitingList: []})
                    }
                    if(snapPhase.indexOf("vote") !== -1) {
                        voteDelay = true
                    }
                    if(newPhase === "vote1") {
                        this.setCurrentCanvas()
                    }
                    const setTime = snapPhase.indexOf("write") !== -1 ? 10 : snapPhase ===  "selection" ? 15 : newPhase === "writeNouns" ? 20 : snapPhase === "draw" || snapPhase.indexOf("vote") !== -1 ? 25 : 0
                    if(voteDelay) {
                        
                    } else {
                        this.props.firebase.findRoom1(this.props.match.params.id).update({phase: newPhase})
                    }
                    if(newPhase === "finished") {
                        setTimeout(() => {
                            this.props.firebase.findRoom1(this.props.match.params.id).update({
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
                    this.props.firebase.findRoom1(this.props.match.params.id).update({timer: setTime})
                    if(voteDelay) {
                        this.props.firebase.findRoom1(this.props.match.params.id).update({showVote: false, showPrompt: true})
                        this.assignPoints()
                        setTimeout(() => {
                            this.props.firebase.findRoom1(this.props.match.params.id).update({phase: newPhase, showVote: false, showPrompt: false})
                            this.setCurrentCanvas()
                            this.startTimer()
                        }, 5000)
                    } else {
                        this.props.firebase.findRoom1(this.props.match.params.id).update({phase: newPhase})
                        setTimeout(() => {
                            this.startTimer()
                        }, 250)
                    }
                }
            })
        },1000)
    }
    checkForRoomUpdates = () => {
        this.unsubscribe3 = this.props.firebase.findRoom1(this.props.match.params.id).on("value", room => {
            if(room.exists()) {
                this.setState({
                    waiting: room.val().waiting,
                    phase: room.val().phase,
                    timer: room.val().timer,
                    showVote: room.val().showVote,
                })
                let isMaster = true
                if(room.val().userList) {
                    isMaster = this.props.currentUser.id === room.val().userList[0]
                } else {
                    isMaster = !room.val().userList
                }
                console.log(isMaster)
                this.props.firebase.findUser1(this.props.currentUser.id).once("value", user => {
                    if(room.val().phase === "draw") {
                        this.props.firebase.canvasRef1().orderByChild("userId").equalTo(this.props.currentUser.id).once("value", canvases => {
                            canvases.forEach(canvas => {
                                this.props.firebase.findCanvas1(canvas.key).update({canvas: {...canvas.val().canvas, prompt: user.val().chosenPrompt}})
                            })
                        })
                    }
                    if(room.val().phase === "writeFinished") {
                        this.assignUserPrompts()
                    }
                    if(room.val().phase.indexOf("vote") !== -1) {
                        this.setState({
                            currentCanvas: room.val().currentCanvas,
                            showVote: room.val().showVote,
                            showPrompt: room.val().showPrompt,
                            promptOptions: room.val().promptOptions
                        })
                    }
                    if((!user.val().isMaster && isMaster) && room.val().waiting === false && room.val().phase !== "finished") {
                        this.startTimer()    
                    }
                    this.props.firebase.findUser1(user.key).update({isMaster})
                })
            }
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
        this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).once("value", chats => {
            const newMessage = {
                content: this.state.message,
                type: "message",
                isSpecial: false,
                userId: this.props.currentUser.id,
                displayName: this.props.currentUser.displayName,
                createdAt: Date.now()
            }
            chats.forEach(chat => {
                const updatedChat = chat.val().messages ? [...chat.val().messages] : []
                updatedChat.push(newMessage)
                this.props.firebase.findChatLog1(chat.key).update({messages: [...updatedChat]})
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
        this.props.firebase.userRef1().orderByChild("currentRoomId").equalTo(this.props.match.params.id).off("value", this.unsubscribe1)
        this.props.firebase.chatRef1().orderByChild("roomId").equalTo(this.props.match.params.id).off("value", this.unsubscribe2)
        this.props.firebase.findRoom1(this.props.match.params.id).off("value", this.unsubscribe3)
    }
    render() {
        return(
            <S.Container1 phase={this.state.phase}>
                {!this.state.waiting 
                    ?
                        <S.TimerContainer className={this.state.phase.indexOf("write") !== -1 || this.state.phase === "selection" ? "middle" : ""}>
                            <S.Timer className={this.state.timer <= 15 && this.state.phase === "draw" ? "red" : ""}>{this.state.timer}</S.Timer>
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