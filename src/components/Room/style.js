import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 50rem;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
`

S.Container2 = styled.div`
    height: 90%;
    width: 65rem;
    display: flex;
    justify-content: space-between;
`

S.ChatContainer = styled.div`
    height: 90%;
    width: 20rem;
    background-color: purple;
    display: flex;
    flex-direction: column;
`

S.ChatBox = styled.div`
    width: 100%;
    height: 90%;
    background-color: pink;
`

S.MessageForm = styled.form`
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
`

S.MessageInput = styled.input`
    width: 90%;
    font-size: 1rem;
    margin: 0.5rem;
`

export default S