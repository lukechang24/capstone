import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
    display: flex; 
    justify-content: center;
    align-items: center;
`

S.PromptForm = styled.form`
    width: 400px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`
S.PromptHeading = styled.h3`
    font-weight: bold;
    margin: 15px 0;
`

S.GrammerContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 25px;
`

S.Grammer = styled.h3`
    font-weight: 500;
    margin: 0 0 5px;
`

S.PromptInput = styled.input`
    width: 60%;
    text-align: center;
    font-size: 15px;
    padding: 5px;
`

S.SubmitPrompt = styled.input`
    color: white;
    background-color: lightskyblue;
    border: none;
    border-radius: 5px;
    padding: 5px;
    margin: 0 0 15px;
    &:hover {
        color: white;
        background-color: lightsteelblue;
    }
`

export default S