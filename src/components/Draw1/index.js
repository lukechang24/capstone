import React, { Component } from "react"
import S from "./style"

class Draw1 extends Component {
    state = {
        ctx: null,
        clickX: [],
        clickY: [],
        clickDrag: [],
        clickColor: [],
        clickSize: [],
        curColor: "black",
        fillColor: "white",
        paint: false,
        paintState: "paint"
    }
    componentDidMount() {
        this.setState({
            ctx: document.querySelector(".canvas").getContext("2d")
        })
    }
    componentDidUpdate() {
        this.redraw(document.querySelector(".canvas"))
    }
    startDrawing = (e) => {
        if(this.state.paintState === "paint") {
            const mouseX = e.pageX - e.currentTarget.offsetLeft
            const mouseY = e.pageY - e.currentTarget.offsetTop
            this.setState({
                paint: true
            })
            this.addClick(mouseX, mouseY)
        }
    }
    drawing = (e) => {
        if(this.state.paint && this.state.paintState === "paint") {
            this.addClick(e.pageX - e.currentTarget.offsetLeft, e.pageY - e.currentTarget.offsetTop, true)
        }
    }
    stopDrawing = () => {
        this.setState({
            paint: false
        })
    }
    addClick = (x, y, dragging) => {
        console.log("nice")
        console.log(this.state.clickX)
        this.setState({
            clickX: [...this.state.clickX, x],
            clickY: [...this.state.clickY, y],
            clickDrag: [...this.state.clickDrag, dragging],
            clickColor: [...this.state.clickColor, this.state.curColor]
        })
    }
    redraw = (canvas) => {
        const { ctx } = this.state
        const clickX = this.state.clickX
        const clickY = this.state.clickY
        const clickDrag = this.state.clickDrag
        const clickColor = this.state.clickColor

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineJoin = "round"
        ctx.lineWidth = 5
        ctx.fillStyle = this.state.fillColor;
        ctx.fillRect(20, 20, 400, 400);
                    
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
            ctx.stroke()
        }
    }
    changeColor = (e) => {
        this.setState({
            curColor: e.target.name
        })
    }
    fillCanvas = () => {
        if(this.state.paintState === "fill") {
            const { ctx } = this.state
            console.log(ctx)
            ctx.fillStyle = this.state.curColor;
            ctx.fillRect(20, 20, 420, 400);
            this.setState({
                fillColor: this.state.curColor
            })
        }
    }
    changePaintState = (e) => {
        this.setState({
            paintState: e.target.name
        })
    }
    clearCanvas = (e) => {
        const { ctx } = this.state
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.setState({
            clickX: [],
            clickY: [],
            clickDrag: [],
            clickColor: [],
            clickSize: [],
        })
    }
    render() {
        return(
            <S.Container1>
                {console.log(this.state.paintState)}
                <S.UtilityLeft>
                    <S.Bucket name="fill" onClick={this.changePaintState}>
                        bucket
                    </S.Bucket>
                </S.UtilityLeft>
                <S.Container2>
                    <S.UtilityTop>
                        
                    </S.UtilityTop>
                    <S.Canvas1 
                        className="canvas"
                        width="400" 
                        height="400" 
                        style={{"border": "0.1rem solid black"}} 
                        onMouseDown={this.startDrawing}
                        onMouseMove={this.drawing}
                        onMouseUp={this.stopDrawing}
                        onMouseLeave={this.stopDrawing}
                        onClick={this.fillCanvas}
                    ></S.Canvas1>
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
                    </S.UtilityBottom>
                </S.Container2>
                <S.UtilityRight>
                    <S.ClearCanvas className="clear" onClick={this.clearCanvas}>Clear</S.ClearCanvas>
                </S.UtilityRight>
            </S.Container1>
        )
    }
}

export default Draw1