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
    width: 350px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    border-radius: 10px;
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
    margin: 5px 10px 5px 0;
`

S.RoomInput = styled.input`
    width: 150px;
    text-align: ${props => props.align ? props.align : "left" };
    vertical-align: bottom;
`

S.RoomSubmit = styled.input`
    color: white;
    background-color: #24a0ed;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    margin: 25px 0 0;
    &:hover {
        background-color: lightgray;
    }
`

S.CancelForm = styled.i`
    position: absolute;
    right: 8px;
    top: 5.5px;
    &:hover {
        color: red;
    }
`

export default S