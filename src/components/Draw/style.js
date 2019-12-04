import styled from "styled-components"

const S = {};

S.Container1 = styled.div`
    height: 35rem;
    width: 35rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5rem;
`

S.UtilityLeft = styled.div`
    height: 100%;
    width: 100%;
    background-color: blue;
`

S.UtilityRight = styled.div`
    height: 100%;
    width: 100%;
    background-color: green;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`
S.Container2 = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`

S.Canvas1 = styled.canvas`
    border: 0.1rem solid black;
`

S.UtilityTop = styled.div`
    height: 100%;
    width: 100%;
    background-color: purple;
`

S.UtilityBottom = styled.div`
    height: 100%;
    width: 100%;
    background-color: yellow;
    display: flex;
`
S.Color = styled.button`
    width: 2rem;
    height: 80%;
    border-radius: 0rem 0rem 1rem 1rem;
    background-color: ${props => props.color};
    border: 0.08rem solid black;
    &.selected {
        height: 95%;
    }
`

S.ClearCanvas = styled.button`

`


export default S