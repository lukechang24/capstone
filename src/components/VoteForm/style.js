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
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    user-select: none;
` 

S.SelectionBar = styled.div`
    width: 100%;
    height: 20px;
    background-color: black;
    cursor: grab;
`

S.Container2 = styled.div`
    display: flex;
    justify-content: space-around;
`

S.WordContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 25px 0;
`

S.Word = styled.p`
    min-width: 80px;
    background-color: skyblue;
    text-align: center;
    padding: 2.5px 10px;
    border: 2px solid transparent;
    margin: 2.5px 0;
    &.selected {
        background-color: #005B9A;
        color: white;
        border-color: black;
    }
`

S.Points = styled.p`
    font-size: 15px;
    text-align: center;
`

S.Heading = styled.h3`
    width: 450px;
    margin: 10px 0 25px;
    text-align: center;
`

S.ChosenWordHeader = styled.h3`
    text-align: center;
    margin: 25px 0 10px;
`

S.ChosenWord = styled.span`
    text-align: center;
    font-weight: 400;
`

export default S