import React, { Component } from "react"
import { withFirebase } from "../Firebase"
import S from "./style"

class Draw1 extends Component {
    state = {
        canvas: {
            clickX: [],
            clickY: [],
            clickDrag: [],
            clickColor: [],
            clickSize: [],
            backgroundColor: "white",
        },
        ctx: null,
        curColor: "black",
        curSize: 1,
        paint: false,
        strokes: 0,
        strokeCount: []
    }
    componentDidMount() {
        document.addEventListener("keydown", (e) => {
            if(e.ctrlKey && e.which === 90) {
                this.undo()
            }
        })
        this.setState({
            ctx: document.querySelector(".canvas").getContext("2d")
        })

    }
    componentDidUpdate() {
        this.redraw()
    }
    startDrawing = (e) => {
        const mouseX = e.pageX - e.currentTarget.offsetLeft
        const mouseY = e.pageY - e.currentTarget.offsetTop
        this.setState({
            paint: true
        })
        this.addClick(mouseX, mouseY)
    }
    drawing = (e) => {
        if(this.state.paint) {
            this.addClick(e.pageX - e.currentTarget.offsetLeft, e.pageY - e.currentTarget.offsetTop, true)
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
        const { ctx } = this.state
        const { clickX, clickY, clickDrag, clickColor, clickSize, backgroundColor } = this.state.canvas

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineJoin = "round"
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, 600, 600);
                    
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
    }
    changeColor = (e) => {
        this.setState({
            curColor: e.target.name
        })
    }
    changeBackgroundColor = (e) => {
        const { ctx } = this.state
        ctx.fillStyle = e.target.name
        ctx.fillRect(0, 0, 600, 600);
        this.setState({
            canvas: {
                backgroundColor: e.target.name,
                ...this.state.canvas
            }
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
        this.setState({
            canvas: {
                clickX: clickX.slice(0, clickX.length - recentStroke),
                clickY: clickY.slice(0, clickY.length - recentStroke),
                clickDrag: clickDrag.slice(0, clickDrag.length-recentStroke),
                clickColor: clickColor.slice(0, clickColor.length - recentStroke),
                clickSize: clickSize.slice(0, clickSize.length - recentStroke),
            }
        })
    }
    clearCanvas = (e) => {
        const { ctx } = this.state
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.setState({
            canvas: {
                ...this.state.canvas,
                clickX: [],
                clickY: [],
                clickDrag: [],
                clickColor: [],
                clickSize: [],
            }
        })
    }
    render() {
        return(
            <S.Container1>
                <S.UtilityLeft>
                    <S.ClearCanvas className="fas fa-trash-alt clear" onClick={this.clearCanvas}></S.ClearCanvas>
                </S.UtilityLeft>
                <S.Container2>
                    <S.UtilityTop>
                        <S.BackgroundColor
                            className={`${this.state.backgroundColor === "white" ? "selected" : ""}`}
                            name="white" 
                            color="white" 
                            onClick={this.changeBackgroundColor}
                        ></S.BackgroundColor>
                        <S.BackgroundColor 
                            className={`${this.state.backgroundColor === "black" ? "selected" : ""}`}
                            name="black" 
                            color="black" 
                            onClick={this.changeBackgroundColor}
                        ></S.BackgroundColor>
                        <S.BackgroundColor 
                            className={`${this.state.backgroundColor === "grey" ? "selected" : ""}`}
                            name="grey" 
                            color="grey" 
                            onClick={this.changeBackgroundColor}
                        ></S.BackgroundColor>
                    </S.UtilityTop>
                    <S.Canvas 
                        className="canvas"
                        width="600" 
                        height="600" 
                        onMouseDown={this.startDrawing}
                        onMouseMove={this.drawing}
                        onMouseUp={this.stopDrawing}
                        onMouseLeave={this.stopDrawing}
                    ></S.Canvas>
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

export default Draw1