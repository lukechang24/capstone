import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`
S.Container2 = styled.div`
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`
S.CreateRoomButton = styled.button`
    width: 8rem;
    height: 3rem;
    background-color: steelblue;
    color: white;
    border: none;
    border-radius: 1rem;
    font-size: 1rem;
    margin: 1.5rem;
    &:hover {
        background-color: lightseagreen;

    }
`

export default S