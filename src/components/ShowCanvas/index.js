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
            this.props.firebase.findCanvas1(this.props.currentCanvas.id).update({isSaved: true})
        })
    }
    redraw = () => {
        const ctx = this.state.ctx
        const { backgroundColor } = this.props.currentCanvas.canvas
        const clickX = this.props.currentCanvas.canvas.clickX ? this.props.currentCanvas.canvas.clickX : []
        const clickY = this.props.currentCanvas.canvas.clickY ? this.props.currentCanvas.canvas.clickY : []
        const clickSize = this.props.currentCanvas.canvas.clickSize ? this.props.currentCanvas.canvas.clickSize : []
        const clickColor = this.props.currentCanvas.canvas.clickColor ? this.props.currentCanvas.canvas.clickColor : []
        const clickDrag = this.props.currentCanvas.canvas.clickDrag ? this.props.currentCanvas.canvas.clickDrag : []
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
                <S.CanvasContainer className="container">
                    {this.props.showPrompt
                        ?
                            <S.Heading className={this.props.showPrompt ? "" : "hide"}>
                                <S.Prompt>The prompt: <br/>{this.props.currentCanvas.canvas.prompt}</S.Prompt>
                            </S.Heading>
                        :
                            <S.Heading className={this.props.showPrompt ? "" : "hide"}>
                                <S.DrawnBy>Drawn by: <br/>{this.props.currentCanvas.displayName}</S.DrawnBy>
                            </S.Heading>

                    }
                    <S.Canvas 
                        className="canvas2"
                        width="700" 
                        height="700" 
                    ></S.Canvas>
                    {this.props.showVote && this.props.currentUser.id !== this.props.currentCanvas.userId && !this.props.currentUser.waiting
                        ?
                            <VoteForm currentUser={this.props.currentUser} currentCanvas={this.props.currentCanvas} promptOptions={this.props.promptOptions}/>
                        :
                            null

                    }
                </S.CanvasContainer>
                <S.OverLay></S.OverLay>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(ShowCanvas))