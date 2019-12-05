import React, { Component } from "react"
import S from "./style"

class Draw extends Component {
    state = {
        selectedColor: "black",
    }
    componentDidMount() {
        const canvas = document.getElementById("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = 400
        canvas.height = 400

        const clickX = []
        const clickY = []
        const clickDrag = []
        const clickColor = []
        const clickSize = []
        const colors = document.querySelectorAll(".color")
        let curColor = "black"
        let curSize = "5"
        const ClearCanvas = document.querySelector(".clear")
        let paint = false

        function addClick(x, y, dragging) {
            clickX.push(x)
            clickY.push(y)
            clickDrag.push(dragging)
            clickColor.push(curColor)
        }
        function redraw() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.lineJoin = "round"
            ctx.lineWidth = 5
                        
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
        canvas.addEventListener("mousedown", (e) => {
            const mouseX = e.pageX - e.currentTarget.offsetLeft
            const mouseY = e.pageY - e.currentTarget.offsetTop
            paint = true
            addClick(mouseX, mouseY)
            redraw()
        })
        canvas.addEventListener("mousemove", (e) => {
            if(paint) {
                addClick(e.pageX - e.currentTarget.offsetLeft, e.pageY - e.currentTarget.offsetTop, true)
                redraw()
            }
        })
        canvas.addEventListener("mouseup", () => {
            paint = false
        })
        canvas.addEventListener("mouseleave", () => {
            paint = false
        })
        colors.forEach(color => {
            color.addEventListener("click", (e) => {
                curColor = e.target.name
                this.setState({
                    selectedColor: e.target.name
                })
            })
        })
        ClearCanvas.addEventListener("click", () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            clickX.length = 0
            clickY.length = 0
            clickDrag.length = 0
            clickColor.length = 0
        })
    }
    render() {
        return(
            <S.Container1>
                <S.UtilityLeft>
                    
                </S.UtilityLeft>
                <S.Container2>
                    <S.UtilityTop>
                        
                    </S.UtilityTop>
                    <S.Canvas1 id="canvas"></S.Canvas1>
                    <S.UtilityBottom>
                        <S.Color className={`color ${this.state.selectedColor === "red" ? "selected" : ""}`} name="red" color="red"></S.Color>
                        <S.Color className={`color ${this.state.selectedColor === "orange" ? "selected" : ""}`} name="orange" color="orange"></S.Color>
                        <S.Color className={`color ${this.state.selectedColor === "yellow" ? "selected" : ""}`} name="yellow" color="yellow"></S.Color>
                        <S.Color className={`color ${this.state.selectedColor === "green" ? "selected" : ""}`} name="green" color="green"></S.Color>
                        <S.Color className={`color ${this.state.selectedColor === "blue" ? "selected" : ""}`} name="blue" color="blue"></S.Color>
                        <S.Color className={`color ${this.state.selectedColor === "purple" ? "selected" : ""}`} name="purple" color="purple"></S.Color>
                        <S.Color className={`color ${this.state.selectedColor === "black" ? "selected" : ""}`} name="black" color="black"></S.Color>
                    </S.UtilityBottom>
                </S.Container2>
                <S.UtilityRight>
                    <S.ClearCanvas className="clear">Clear</S.ClearCanvas>
                </S.UtilityRight>
            </S.Container1>
        )
    }
}

export default Draw