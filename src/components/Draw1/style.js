import styled from "styled-components"
import paintBrush from "../../images/paint-brush.png"

const S = {};

S.Container1 = styled.div`
    max-width: 750px;
    max-height: 750px;
    display: flex;
    justify-content: center;
    background-color: rgb(167, 218, 250);
    margin: 25px 25px 0;
`

S.UtilityLeft = styled.div`
    /* height: 100%; */
    width: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    @media only screen and (max-width: 700px) {
        width: 3.5rem
    }
`

S.UtilityRight = styled.div`
    /* height: auto; */
    width: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @media only screen and (max-width: 700px) {
        width: 3.5rem
    }
`
S.Container2 = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

S.Container3 = styled.div`
    max-width: 600px;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.Canvas = styled.canvas`
    max-width: 1000px;
    width: 100%;
    height: auto;
    &:hover {
        cursor: url(${paintBrush}) 2 20, auto;
    }
`

S.UtilityTop = styled.div`
    position: relative;
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

S.UtilityBottom = styled.div`
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 700px) {
        height: 3.5rem;
    }
`
S.Color = styled.button`
    width: 2.5rem;
    height: 2.5rem;
    margin: 0.25rem;
    border-radius: 0.5rem;
    background-color: ${props => props.color};
    border: 0.08rem solid black;
    &.selected {
        box-shadow: 0 0 6px 6px white;
    }
    &:hover {
        cursor: pointer;
    }
    @media only screen and (max-width: 700px) {
        width: 2rem;
        height: 2rem;
    }
`

S.BackgroundColorDiv = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
`

S.BackgroundColor = styled.button`
    width: 2.5rem;
    height: 2.5rem;
    background-color: ${props => props.color};
    border: 0;
    border-radius: 0.75rem 0.75rem 0 0;
    margin-right: 0.05rem;
    &.selected {
        height: 3rem;
    }
    @media only screen and (max-width: 700px) {
        width: 2rem;
        height: 2rem;
        &.selected {
            height: 2.5rem;
        }
    }
`
S.WhiteSquare = styled.div`
    height: 2.8rem;
    width: 2.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    margin-top: 5rem;
    @media only screen and (max-width: 700px) {
        width: 2rem;
        height: 2rem;
    }
`

S.PaintSize = styled.button`
    border: none;
    border-radius: 100rem;
    background-color: black;
    &.small {
        height: 0.8rem;
        width: 0.8rem;
    }
    &.medium {
        height: 1.25rem;
        width: 1.25rem;
    }
    &.large {
        height: 1.7rem;
        width: 1.7rem;
    }
    &:focus {
        outline: 0;
    }
    @media only screen and (max-width: 700px) {
        &.small {
            height: 0.25rem;
            width: 0.25rem;
        }
        &.medium {
            height: 0.5rem;
            width: 0.5rem;
        }
        &.large {
            height: 0.75rem;
            width: 0.75rem;
        }
    }
`

S.Undo = styled.i`
    height: 2.8rem;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    margin: 1rem 0;
    transition: 0.1s ease-in-out;
    &:hover {
        color: white;
    }
    @media only screen and (max-width: 700px) {
        font-size: 1.5rem;
        margin: 0.5rem;
    }
`

S.ClearCanvas = styled.i`
    height: 2.8rem;
    width: 2.8rem;
    font-size: 2rem;
    margin: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.1s ease-in-out;
    &:hover {
        color: white;
    }
    @media only screen and (max-width: 700px) {
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }
`

S.PromptHeader = styled.h3`
    text-align: center;
    @media only screen and (max-width: 700px) {
        font-size: 17.5px;
    }
`

S.Prompt = styled.span`
    font-weight: 400;
`


export default S