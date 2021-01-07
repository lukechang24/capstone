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
                <S.UtilityLeft></S.UtilityLeft>
                <S.Container2>
                    <S.UtilityTop>
                        {/* {this.props.phase === "draw"
                            ?
                                <S.PromptHeader>
                                    Draw: <br/><S.Prompt>{this.state.canvas.prompt}</S.Prompt>
                                </S.PromptHeader>
                            :
                                null
                        } */}
                    </S.UtilityTop>
                    <S.CanvasContainer className="container">
                        <S.Canvas 
                            className="canvas2"
                            width="700" 
                            height="700" 
                            onMouseDown={this.startDrawing}
                            onMouseMove={this.drawing}
                            onMouseUp={this.stopDrawing}
                            onMouseLeave={this.stopDrawing}
                        ></S.Canvas>
                    </S.CanvasContainer>
                    <S.UtilityBottom>
                        <S.Prompt>Playing league of legends</S.Prompt>
                    </S.UtilityBottom>
                </S.Container2>
                <S.UtilityRight></S.UtilityRight>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(ShowCanvas))