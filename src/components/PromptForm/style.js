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
    height: 20rem;
    width: 30rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`
S.PromptHeading = styled.h3`
    font-weight: bold;
`

S.GrammerContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
// S.GrammarContainer = styled.div`
//     display: flex;
//     justify-content: center;

// `

S.Grammer = styled.h3`
    font-weight: 500;
`

S.PromptInput = styled.input`
    width: 60%;
    text-align: center;
    font-size: 1rem;
    margin: 0.3rem 0rem 0.75rem;
    padding: 0.25rem;
`

S.SubmitPrompt = styled.input`
    color: white;
    background-color: lightskyblue;
    border: none;
    border-radius: 0.3rem;
    padding: 0.25rem;
    margin: 0.2rem;
    &:hover {
        color: white;
        background-color: lightsteelblue;
    }
`

export default S