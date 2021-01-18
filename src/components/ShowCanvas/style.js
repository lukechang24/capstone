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
    width: 100%;
    max-width: 1500px;
    min-width: 300px;
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
`

S.Prompt = styled.h2`
    color: white;
    text-align: center;
`

S.DrawnBy = styled.h2`
    color: white;
    text-align: center;
`

S.VoteContainer = styled.div`
    position: absolute;
    top: -50px;
    z-index: 25;
    &.hide {
        display: none;
    }
`

S.SaveCanvas = styled.button`
    font-family: 'Fjalla One', sans-serif;
    font-size: 20px;
    color: white;
    background-color: #005B9A;
    padding: 5px 10px;
    border: none;
    border-radius: 2.5px;
    margin: 0 10px;
    &.hide {
        display: none;
    }
    &:hover {
        background-color: skyblue;
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