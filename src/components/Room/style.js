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
`

S.Title = styled.h1`
    font-size: 25px;
`

S.Container3 = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
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
    z-index: 4;
    @media only screen and (max-width: 1350px) {
        width: 300px;
    }
    @media only screen and (max-width: 1000px) {
        width: 250px;
    }
`

S.ChatSpace = styled.div`
    min-width: 300px;
    height: 100px;
    background-color: white;
    display: block;
    @media only screen and (max-width: 1350px) {
        min-width: 300px;
    }
    @media only screen and (max-width: 1000px) {
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
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 15px solid black;
    border-radius: 25px;
    background-color: white;
    z-index: 20;
`

S.Timer = styled.h1`
    padding-bottom: 5px;
`
S.WaitingContainer = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 10;
`

S.Waiting = styled.h1`
    text-align: center;
    color: white;
`

export default S