import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
`

S.Container2 = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: skyblue;
    z-index: 25;
    &.hide {
        display: none;
    }
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
    border: 5px solid black;
    z-index: 15;
`

S.Heading = styled.div`
    position: absolute;
    top: -65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
    &.big {
        position: static;
    }
`

S.Prompt = styled.h2`
    color: white;
    &.big {
        font-size: 50px;
    }
`

S.DrawnBy = styled.span`
    font-weight: 400;
    color: white;
    &.big {
        font-size: 45px;
    }
`

S.OverLay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
`

export default S