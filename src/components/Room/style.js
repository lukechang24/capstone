import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
`

S.Container2 = styled.div`
    height: 45rem;
    width: 65rem;
    display: flex;
    justify-content: space-between;
`

S.ChatContainer = styled.div`
    height: 45rem;
    width: 23rem;
    background-color: rgb(235, 235, 235);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 4;
`

S.MessageForm = styled.form`
    position: relative;
    width: 100%;
    height: 6rem;
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
    width: 90%;
    font-size: 1rem;
    margin: 0.5rem auto;
    padding: 0.5rem;
    border: none;
    border-radius: 0.3rem;
`

S.Spinner = styled.i`
    font-size: 3rem;
`

S.TimerContainer = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    height: 3rem;
    width: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1rem solid black;
    border-radius: 2rem;
    background-color: white;
    z-index: 5;
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

S.DudDiv = styled.div`
    height: 100%;
    width: 45rem;
`

export default S