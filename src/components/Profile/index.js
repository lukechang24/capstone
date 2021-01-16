import React, { Component } from "react"
import CanvasList from "../CanvasList"
import { withRouter } from "react-router-dom"
import { withFirebase } from "../Firebase"
import S from "./style"

class Profile extends Component {
    state = {
        canvasList: [],
        ctxList: []
    }
    componentDidMount() {
        this.props.firebase.findUserCanvases(this.props.currentUser.id).get()
            .then(snapshot => {
                snapshot.forEach(snap => {
                    this.setState({
                        canvasList: [...this.state.canvasList, snap.data()]
                    })
                })
                for(let i = 0; i < snapshot.size; i++) {
                    this.setState({
                        // [`ctx${i}`]: document.querySelector(`.canvas${i}`)
                        ctxList: [...this.state.ctxList, document.querySelector(`.canvas${i}`).getContext("2d")]
                    })
                }
            })
    }
    redraw = () => {
        for(let i = 0; i < this.state.canvasList.length; i++) {
            const ctx = this.state.ctxList[i]
            const { clickX, clickY, clickDrag, clickColor, clickSize, backgroundColor } = this.state.canvasList[i].canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.lineJoin = "round"
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, 700, 700)
            for(var j = 0; j < clickX.length; j++) {		
                ctx.beginPath()
                if(clickDrag[j] && j) {
                    ctx.moveTo(clickX[j-1], clickY[j-1])
                } else {
                    ctx.moveTo(clickX[j]-1, clickY[j])
                }
                ctx.lineTo(clickX[j], clickY[j])
                ctx.closePath()
                ctx.strokeStyle = clickColor[j]
                ctx.lineWidth = clickSize[j]
                ctx.stroke()
            }
        }
    }
    render() {
        setTimeout(() => {
            this.redraw()
        }, 1000)
        return(
            <S.Container1>
                <S.Heading>Your Saved Drawings: </S.Heading>
                <CanvasList canvasList={this.state.canvasList}/>
            </S.Container1>
        )
    }
}

export default withRouter(withFirebase(Profile))