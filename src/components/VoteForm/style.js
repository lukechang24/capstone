import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 25;
    display: flex;
    justify-content: center;
    align-items: center;
    &.hide {
        display: none;
    }
`

S.SelectionForm = styled.div`
    width: 400px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    /* margin-bottom: 25px; */
` 
S.Container2 = styled.div`
    display: flex;
    justify-content: space-around;
`

S.SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 75px;
`

S.Select = styled.select`
    width: 100px;
    background-color: lightblue;
    margin: 0 15px 0;
`

S.SelectOption = styled.option`
    padding: 50px;
    background-color: grey;
`

S.SelectPoints = styled.p`
    font-size: 15px;
    margin: 5px 0 0;
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