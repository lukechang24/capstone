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
    z-index: 23;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
`

S.Prompt = styled.h2`
    font-size: 50px;
    color: white;
`

S.DrawnBy = styled.span`
    font-size: 45px;
    font-weight: 400;
    color: white;
`

S.VoteContainer = styled.div`
    position: absolute;
    top: -50px;
    z-index: 25;
    &.hide {
        display: none;
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