import styled from "styled-components"
import paintBrush from "../../images/paint-brush.png"

const S = {};

S.Container1 = styled.div`
`

S.CanvasContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
`

S.Canvas = styled.canvas`
    max-width: 1500px;
    width: 100%;
    height: auto;
`

S.Undo = styled.i`
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    &:hover {
        color: grey;
    }
`

S.TrashCan = styled.i`
    position: absolute;
    bottom: 5px;
    left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    transition: 0.1s ease-in-out;
    &:hover {
        color: red;
    }
`

export default S