import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Draw1 extends Component {
    unsubscribe = null
    state = {
        canvas: {
            clickX: [],
            clickY: [],
            clickDrag: [],
            clickColor: [],
            clickSize: [],
            backgroundColor: "white",
            prompt: ""
        },
        ctx: null,
        paint: false,
        strokes: 0,
        strokeCount: [],
        doNotMove: false,
        ratio: 1,
    }
    componentDidMount() {
        this.unsubscribe = this.props.firebase.findCanvases(this.props.match.params.id)
            .where("userId", "==", this.props.currentUser.id)
                .onSnapshot(snapshot => {
                    if(this.props.currentUser.waiting || this.props.phase === "finished") {
                        return
                    }
                    let exists = false
                    snapshot.forEach(doc => {
                        if(doc.data().userId === this.props.currentUser.id && doc.data().roomId === this.props.match.params.id) {
                            exists = true
                            const canvasInfo = {
                                ...doc.data().canvas
                            }
                            this.setState({
                                ...this.state,
                                canvas: {...canvasInfo},
                                prompt: doc.data().prompt
                            })
                        }
                    })
                    if(!exists) {
                        const newCanvas = {
                            clickX: [],
                            clickY: [],
                            clickDrag: [],
                            clickColor: [],
                            clickSize: [],
                            backgroundColor: "white",
                            prompt: ""
                        }
                        this.props.firebase.createCanvas({canvas: newCanvas, roomId: this.props.match.params.id, userId: this.props.currentUser.id, votes: []})
                            .then(doc => {
                                this.props.firebase.findCanvas(doc.id).get()
                                    .then(snapshot => {
                                        const canvasInfo = {
                                            ...snapshot.data().canvas
                                        }
                                        this.setState({
                                            ...this.state,
                                            canvas: {...canvasInfo},
                                            prompt: ""
                                        })
                                    })
                            })
                    }
                })
        document.addEventListener("keydown", (e) => {
            if(e.ctrlKey && e.which === 90) {
                this.undo()
            }
        })
        this.setState({
            ctx: document.querySelector(".canvas").getContext("2d")
        })
        this.resize()
        window.addEventListener("resize", this.throttle(this.resize, 500))
    }
    componentDidUpdate() {
        this.redraw()
    }
    resize = () => {
        let container = document.querySelector(".container")
        setTimeout(() => {
            let newRatio = container.getBoundingClientRect().width/700
            this.setState({
                ratio: newRatio
            })
        }, 500)
    }
    throttle = (callback, limit) => {
        var waiting = false
        return function () {
            if (!waiting) {
                callback.apply(this, arguments)
                waiting = true
                setTimeout(function () {
                    waiting = false
                }, limit)
            }
        }
    }
    startDrawing = (e) => {
        const gameContainer = document.querySelector(".gameContainer")
        const container = document.querySelector(".container")
        const mouseX = (e.pageX - container.offsetLeft - gameContainer.offsetLeft)/this.state.ratio
        const mouseY = (e.pageY - container.offsetTop - gameContainer.offsetTop)/this.state.ratio
        this.setState({
            paint: true
        })
        this.addClick(mouseX, mouseY, false)
    }
    drawing = (e) => {
        const gameContainer = document.querySelector(".gameContainer")
        const container = document.querySelector(".container")
        if(this.state.paint) {
            this.addClick((e.pageX - container.offsetLeft - gameContainer.offsetLeft)/this.state.ratio, (e.pageY - container.offsetTop - gameContainer.offsetTop)/this.state.ratio, true)
        }
    }
    stopDrawing = () => {
        if(this.state.paint) {
            this.setState({
                strokeCount: [...this.state.strokeCount, this.state.strokes],
                strokes: 0,
            })
        }
        this.setState({
            paint: false,
        })
        this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentUser.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.props.firebase.findCanvas(doc.id).update({canvas: {...this.state.canvas}})
                })
            })
    }
    addClick = (x, y, dragging) => {
        this.setState({
            canvas: {
                ...this.state.canvas,
                clickX: [...this.state.canvas.clickX, x],
                clickY: [...this.state.canvas.clickY, y],
                clickDrag: [...this.state.canvas.clickDrag, dragging],
                clickColor: [...this.state.canvas.clickColor, this.props.curColor],
                clickSize: [...this.state.canvas.clickSize, this.props.curSize],
            },
            strokes: this.state.strokes+1
        })
    }
    redraw = () => {
        if(this.state.doNotDraw) {
            return
        }
        const { ctx } = this.state
        const { clickX, clickY, clickDrag, clickColor, clickSize, backgroundColor } = this.state.canvas

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineJoin = "round"
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, 700, 700);
                    
        for(var i = 0; i < clickX.length; i++) {		
            ctx.beginPath()
            if(clickDrag[i] && i) {
                ctx.moveTo(clickX[i-1], clickY[i-1])
            } else {
                ctx.moveTo(clickX[i]-1, clickY[i])
            }
            ctx.lineTo(clickX[i], clickY[i])
            ctx.closePath()
            ctx.strokeStyle = clickColor[i]
            ctx.lineWidth = clickSize[i]
            ctx.stroke()
        }
        this.setState({
            doNotDraw: true
        }, () => {
            setTimeout(() => {
                this.setState({doNotDraw: false})
            }, 10)
        })
    }
    changeBackgroundColor = (e) => {
        e.persist()
        this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentUser.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.props.firebase.findCanvas(doc.id).update({canvas: {...doc.data().canvas, backgroundColor: e.target.name}})
                })
            })
    }
    undo = () => {
        const recentStroke = this.state.strokeCount.pop()
        const { clickX, clickY, clickDrag, clickColor, clickSize } = this.state.canvas
        const canvasInfo = {
            ...this.state.canvas,
            clickX: clickX.slice(0, clickX.length - recentStroke),
            clickY: clickY.slice(0, clickY.length - recentStroke),
            clickDrag: clickDrag.slice(0, clickDrag.length-recentStroke),
            clickColor: clickColor.slice(0, clickColor.length - recentStroke),
            clickSize: clickSize.slice(0, clickSize.length - recentStroke),
        }
        this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentUser.id).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        this.props.firebase.findCanvas(doc.id).update({canvas: {...canvasInfo}})
                    })
                })
    }
    clearCanvas = (e) => {
        const { ctx } = this.state
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const canvasInfo = {
            ...this.state.canvas,
            clickX: [],
            clickY: [],
            clickDrag: [],
            clickColor: [],
            clickSize: [],
        }
        this.setState({
            canvas: canvasInfo
        })
        this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentUser.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.props.firebase.findCanvas(doc.id).update({canvas: {...canvasInfo}})
                })
            })
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.throttle)
        this.unsubscribe()
    }
    render() {  
        return(
            <S.Container1>
                <S.CanvasContainer className="container">
                    <S.Canvas 
                        className="canvas"
                        width="700" 
                        height="700" 
                        onMouseDown={this.startDrawing}
                        onMouseMove={this.drawing}
                        onMouseUp={this.stopDrawing}
                        onMouseLeave={this.stopDrawing}
                    ></S.Canvas>
                    <S.TrashCan className="fas fa-trash-alt clear" onClick={this.clearCanvas}></S.TrashCan>
                    <S.Undo className="fas fa-undo" onClick={this.undo}></S.Undo>
                </S.CanvasContainer>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Draw1))