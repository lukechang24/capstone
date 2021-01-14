import React, { Component } from "react"
import VoteForm from "../VoteForm"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class ShowCanvas extends Component {
    state = {
        ctx: null,
    }
    componentDidMount() {
        this.setState({
            ctx: document.querySelector(".canvas2").getContext("2d")
        })
    }
    redraw = () => {
        const ctx = this.state.ctx
        const { clickX, clickY, clickDrag, clickColor, clickSize, backgroundColor } = this.props.currentCanvas.canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineJoin = "round"
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, 1000, 1000)
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
    render() {
        setTimeout(() => {
            this.redraw()
        }, 1000)
        return(
            <S.Container1>
                <S.Container2 className={this.props.showPrompt ? "" : "hide"}>
                    <S.Heading>
                        <S.Prompt>{this.props.currentCanvas.canvas.prompt}</S.Prompt>
                        <S.DrawnBy>Drawn by: {this.props.currentCanvas.displayName}</S.DrawnBy>
                    </S.Heading>
                </S.Container2>
                <S.CanvasContainer className="container">
                    {/* <S.Heading className={this.props.showPrompt ? "" : "hide"}>
                        <S.Prompt>{this.props.currentCanvas.canvas.prompt}</S.Prompt>
                        <S.DrawnBy>Drawn by: {this.props.currentCanvas.displayName}</S.DrawnBy>
                    </S.Heading> */}
                    <S.Canvas 
                        className="canvas2"
                        width="700" 
                        height="700" 
                    ></S.Canvas>
                    <S.VoteContainer className={this.props.currentCanvas.userId === this.props.currentUser.id || this.props.showPrompt ? "hide" : ""}>
                    <VoteForm currentCanvas={this.props.currentCanvas}/>
                    </S.VoteContainer>
                </S.CanvasContainer>
                <S.OverLay></S.OverLay>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(ShowCanvas))