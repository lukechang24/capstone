import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
    display: flex; 
    justify-content: center;
    align-items: center;
`
S.RoomForm = styled.form`
    position: relative;
    height: 10rem;
    width: 20rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
`
S.InputContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
S.Container2 = styled.div`
    display: flex;
    align-items: center;
`

S.Options = styled.h3`
    text-align: left;
    padding: 0.25rem;
    margin-right: 0.5rem;
`

S.RoomInput = styled.input`
    height: 60%;
    width: ${props => props.width ? props.width : "7.5rem"};
    text-align: ${props => props.align ? props.align : "left" };
    vertical-align: bottom;
`

S.Required = styled.span`
    font-style: italic;
    color: blue;
    vertical-align: top;
`

S.RoomSubmit = styled.input`
    width: 5rem;
`

S.CancelForm = styled.i`
    position: absolute;
    right: 7.5px;
    top: 5px;
    &:hover {
        color: red;
    }
`

export default S