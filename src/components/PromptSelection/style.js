import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.SelectionForm = styled.div`
    height: 20rem;
    width: 30rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
` 
S.Container2 = styled.div`
    display: flex;
    justify-content: space-around;
`

S.SelectContainer = styled.select`
    width: 8rem;
    height: 2rem;
    background-color: lightblue;
`

S.SelectOption = styled.option`
    padding: 1rem;
    background-color: grey;
`

S.Heading = styled.h3`
    text-align: center;
`

S.ChosenWordHeader = styled.h3`
    text-align: center;
`

S.ChosenWord = styled.span`
    text-align: center;
    font-weight: 400;
`

export default S