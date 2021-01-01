import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &.hide {
        justify-content: center;
    }
`

// S.Container2 = styled.div`
//     height: 100%;
//     width: 65rem;
//     display: flex;
//     justify-content: space-between;
// `

S.Container2 = styled.div`
    height: 100%;
    min-height: 500px;
    max-height: 700px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 25px;
    transition: 0.25s;
    z-index: 15;
    &.hide {
        position: absolute;
        right: 0;
        transform: translateX(20rem);
    }
`

S.ToggleChat = styled.div`
    width: 25px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: grey;
    border: 2px solid black;
    border-right: 0;
    border-radius: 10px 0 0 10px;
    z-index: 15;
    :hover {
        background-color: slategrey;
    }
`

S.Arrow = styled.i`
    font-size: 20px;
    transition: 1s;
    &.hide {
        transform: rotateY(180deg);
    }
`

S.ChatContainer = styled.div`
    height: 100%;
    width: 20rem;
    background-color: rgb(235, 235, 235);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 4;
        /* margin-top: 15px; */
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
    width: 85%;
    font-size: 1rem;
    margin: 0 auto 0.5rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 10px;
`

S.Spinner = styled.i`
    font-size: 3rem;
`

S.TimerContainer = styled.div`
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    height: 3rem;
    width: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1rem solid black;
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

S.DudDiv = styled.div`
    height: 100%;
    width: 45rem;
`

export default S