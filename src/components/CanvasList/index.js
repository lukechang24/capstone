import React from "react"
import S from "./style"

const CanvasList = (props) => {
    const canvasList = props.canvasList.filter(canvas => {
        if(canvas.canvas.prompt.length > 0) {
            return true
        } else {
            return false
        }
    })
    const filteredCanvasList = canvasList.map((canvas, i) => {
        return(
            <S.CanvasContainer key={i}>
                <S.Prompt>{canvas.canvas.prompt}</S.Prompt>
                <S.Canvas className={`canvas${i}`} width="700" height="700"></S.Canvas>
            </S.CanvasContainer>
        )
    })
    return(
        <S.Canvases>
            {filteredCanvasList}
        </S.Canvases>
    )
}

export default CanvasList