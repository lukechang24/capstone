import React, { Component } from "react"
import VoteForm from "../VoteForm"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class ShowCanvas extends Component {
    state = {
        ctx: null,
        isSaved: false
    }
    componentDidMount() {
        this.setState({
            ctx: document.querySelector(".canvas2").getContext("2d")
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            isSaved: true
        }, () => {
            this.props.firebase.findCanvas(this.props.currentCanvas.id).update({isSaved: true})
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
                    <S.Canvas 
                        className="canvas2"
                        width="700" 
                        height="700" 
                    ></S.Canvas>
                    {this.props.currentCanvas.userId === this.props.currentUser.id || this.props.showPrompt
                        ?
                            <S.VoteContainer className={this.props.currentCanvas.userId === this.props.currentUser.id || this.props.showPrompt ? "hide" : ""}>
                                <VoteForm currentCanvas={this.props.currentCanvas}/>
                            </S.VoteContainer>
                        :
                            null

                    }
                    <S.VoteContainer className={this.props.currentCanvas.userId !== this.props.currentUser.id || this.props.showPrompt ? "hide" : ""}>
                        <S.SaveCanvas className={this.isSaved ? "hide" : ""} onClick={(e) => {this.handleSubmit(e)}} disabled={this.state.isSaved}>Save Drawing</S.SaveCanvas>
                    </S.VoteContainer>
                </S.CanvasContainer>
                <S.OverLay></S.OverLay>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(ShowCanvas))