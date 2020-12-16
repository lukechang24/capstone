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
        curColor: "black",
        curSize: 5,
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
        let container1 = document.querySelector(".container")
        let newRatio = container1.getBoundingClientRect().width/1000
        this.setState({
            ratio: newRatio
        })
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
        const mouseX = (e.pageX - e.currentTarget.offsetLeft)/this.state.ratio
        const mouseY = (e.pageY - e.currentTarget.offsetTop)/this.state.ratio
        this.setState({
            paint: true
        })
        this.addClick(mouseX, mouseY, false)
    }
    drawing = (e) => {
        if(this.state.paint) {
            this.addClick((e.pageX - e.currentTarget.offsetLeft)/this.state.ratio, (e.pageY - e.currentTarget.offsetTop)/this.state.ratio, true)
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
                clickColor: [...this.state.canvas.clickColor, this.state.curColor],
                clickSize: [...this.state.canvas.clickSize, this.state.curSize],
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
        ctx.fillRect(0, 0, 1000, 1000);
                    
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
    changeColor = (e) => {
        this.setState({
            curColor: e.target.name
        })
    }
    changeBackgroundColor = (e) => {
        e.persist()
        // this.setState({
        //     canvas: {
        //         ...this.state.canvas,
        //         backgroundColor: e.target.name
        //     }
        // })
        this.props.firebase.findCanvases(this.props.match.params.id).where("userId", "==", this.props.currentUser.id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.props.firebase.findCanvas(doc.id).update({canvas: {...doc.data().canvas, backgroundColor: e.target.name}})
                })
            })
    }
    changeClickSize = (e) => {
        const { curSize } = this.state
        this.setState({
            curSize: curSize === 1 ? 5 : curSize === 5 ? 10 : 1
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
        // this.setState({
        //     canvas: canvasInfo
        // })
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
    }
    render() {  
        return(
            <S.Container1>
                <S.UtilityLeft>
                    <S.ClearCanvas className="fas fa-trash-alt clear" onClick={this.clearCanvas}></S.ClearCanvas>
                </S.UtilityLeft>
                <S.Container2>
                    <S.UtilityTop>
                        {this.props.phase === "draw"
                            ?
                                <S.PromptHeader>
                                    Draw: <br/><S.Prompt>{this.state.canvas.prompt}</S.Prompt>
                                </S.PromptHeader>
                            :
                                null
                        }
                        <S.BackgroundColorDiv>
                            <S.BackgroundColor
                                className={`${this.state.canvas.backgroundColor === "white" ? "selected" : ""}`}
                                name="white" 
                                color="white" 
                                onClick={this.changeBackgroundColor}
                            ></S.BackgroundColor>
                            <S.BackgroundColor 
                                className={`${this.state.canvas.backgroundColor === "black" ? "selected" : ""}`}
                                name="black" 
                                color="black" 
                                onClick={this.changeBackgroundColor}
                            ></S.BackgroundColor>
                            <S.BackgroundColor 
                                className={`${this.state.canvas.backgroundColor === "grey" ? "selected" : ""}`}
                                name="grey" 
                                color="grey" 
                                onClick={this.changeBackgroundColor}
                            ></S.BackgroundColor>
                        </S.BackgroundColorDiv>
                    </S.UtilityTop>
                    <S.Container3 className="container">
                        <S.Canvas 
                            className="canvas"
                            width="1000" 
                            height="1000" 
                            onMouseDown={this.startDrawing}
                            onMouseMove={this.drawing}
                            onMouseUp={this.stopDrawing}
                            onMouseLeave={this.stopDrawing}
                        ></S.Canvas>
                    </S.Container3>
                    <S.UtilityBottom>
                        <S.Color 
                            className={`${this.state.curColor === "red" ? "selected" : ""}`} 
                            name="red" 
                            color="red" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "orange" ? "selected" : ""}`} 
                            name="orange" 
                            color="orange" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "yellow" ? "selected" : ""}`} 
                            name="yellow" 
                            color="yellow" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "green" ? "selected" : ""}`} 
                            name="green" 
                            color="green" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "blue" ? "selected" : ""}`} 
                            name="blue" 
                            color="blue" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "purple" ? "selected" : ""}`} 
                            name="purple" 
                            color="purple" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "black" ? "selected" : ""}`} 
                            name="black" 
                            color="black" 
                            onClick={this.changeColor}
                        ></S.Color>
                        <S.Color 
                            className={`${this.state.curColor === "white" ? "selected" : ""}`} 
                            name="white" 
                            color="white" 
                            onClick={this.changeColor}
                        ></S.Color>
                    </S.UtilityBottom>
                </S.Container2>
                <S.UtilityRight>
                    <S.WhiteSquare onClick={this.changeClickSize}>
                        <S.PaintSize 
                            className={`${this.state.curSize === 1 ? "small" : this.state.curSize === 5 ? "medium" : "large"}`} 
                        ></S.PaintSize>
                    </S.WhiteSquare>
                    <S.Undo className="fas fa-undo" onClick={this.undo}></S.Undo>
                </S.UtilityRight>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Draw1))