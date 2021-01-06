import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.SelectionForm = styled.div`
    width: 400px;
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
    width: 100px;
    background-color: lightblue;
    margin: 0 0 100px;
`

S.SelectOption = styled.option`
    padding: 50px;
    background-color: grey;
`

S.Heading = styled.h3`
    margin: 15px 0 25px;
    text-align: center;
`

S.ChosenWordHeader = styled.h3`
    text-align: center;
    margin: 0 0 15px;
`

S.ChosenWord = styled.span`
    text-align: center;
    font-weight: 400;
`

export default S