import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`

S.Container2 = styled.div`
    margin: 0 50px;
`

S.TitleDiv = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin: 15px 0 15px;
    z-index: 5;
`

S.Title = styled.h1`
    font-family: 'Jua', sans-serif;
    font-size: 40px;
    color: white;
`

S.Container3 = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`

S.Container4 = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.small {
        position: absolute;
        left: 0;
    }
`

S.Interface = styled.div`
    width: 250px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0191C8;
    &.hide {
        display: none;
    }
`

S.ColorContainer = styled.div`
    display: flex;
    flex-direction: column;
`

S.ColorRow = styled.div`
    display: flex;
    
`

S.Color = styled.div`
    width: 25px;
    height: 25px;
    background-color: ${props => props.color ? props.color : "black"};
    &.selected {
        box-shadow: 0px 0px 5px 2.5px white;
        z-index: 5;
    }
`

S.Container5 = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding: 0 25px;
`

S.Square = styled.div`
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    margin: 0 0 5px;
`

S.PaintSize = styled.div`
    width: 20px;
    height: 20px;
    background-color: black;
    border-radius: 25px;
    &.small {
        width: 2.5px;
        height: 2.5px;
    }
    &.medium {
        width: 7.5px;
        height: 7.5px;
    }
    &.large {
        width: 13.5px;
        height: 13.5px;
    }
    &:focus {
        outline: 0;
    }
`

S.PaintBrush = styled.i`
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.selected {
        box-shadow: 0px 0px 10px 2.5px white;
        background-color: lightblue;
    }
`

S.Eraser = styled.i`
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.selected {
        box-shadow: 0px 0px 10px 2.5px white;
        background-color: lightblue;
    }
`

S.InterfaceSpace = styled.div`
    min-width: 250px;
    height: 100px;
    background-color: transparent;
    display: block;
    &.hide {
        display: none;
    }
`

S.ChatContainer = styled.div`
    position: absolute;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: rgb(235, 235, 235);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 15;
    &.hide {
        display: none;
    }
    @media only screen and (max-width: 1350px) {
        width: 300px;
    }
    @media only screen and (max-width: 1040px) {
        width: 250px;
    }
`

S.ChatSpace = styled.div`
    min-width: 300px;
    height: 100px;
    background-color: transparent;
    display: block;
    &.hide {
        display: none;
    }
    @media only screen and (max-width: 1350px) {
        min-width: 300px;
    }
    @media only screen and (max-width: 1040px) {
        min-width: 250px;
    }
`

S.MessageForm = styled.form`
    position: relative;
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`
S.MoreMessages = styled.span`
    width: 100%;
    color: blue;
    text-decoration: underline;
    text-align: center;
`

S.MessageInput = styled.input`
    position: absolute;
    bottom: 0;
    width: 85%;
    font-size: 15px;
    margin: 0 0 10px;
    padding: 10px 15px;
    border: none;
    border-radius: 10px;
`

S.TimerContainer = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    height: 60px;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 15px solid black;
    border-radius: 25px;
    background-color: white;
    z-index: 20;
    &.middle {
        top: calc(50% - 250px);
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
    }
`

S.Timer = styled.h1`
    padding-bottom: 5px;
`

S.WaitingContainer = styled.div`
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 30;
    &.hide {
        display: none;
    }
`

S.Waiting = styled.h1`
    text-align: center;
    color: white;
`

// S.ShowCanvasContainer = styled.div`
//     position: relative;

// `

export default S