import React, { Component } from "react"
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
        }, () => {
            this.redraw()
        })
    }
    redraw = () => {
        const ctx = this.state.ctx
        const { clickX, clickY, clickDrag, clickColor, clickSize, backgroundColor } = this.props.currentCanvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineJoin = "round"
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, 550, 550)
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
                <S.CanvasContainer>
                    <S.UtilityLeft></S.UtilityLeft>
                    <S.Container2>
                        <S.UtilityTop>
                            <S.DrawnByHeading>
                                Drawn By: <S.DrawnBy>{this.props.currentCanvas.displayName}</S.DrawnBy>
                            </S.DrawnByHeading>
                        </S.UtilityTop>
                        <S.Canvas 
                            className="canvas2"
                            height="550"
                            width="550"
                        >
                        </S.Canvas>
                        <S.UtilityBottom>
                            <S.Prompt>{this.props.currentCanvas.prompt}</S.Prompt>
                        </S.UtilityBottom>
                    </S.Container2>
                    <S.UtilityRight>

                    </S.UtilityRight>
                </S.CanvasContainer>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(ShowCanvas))