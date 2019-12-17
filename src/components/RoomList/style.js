import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 30rem;
    width: 75rem;
    display: flex;
    flex-wrap: wrap;
`
S.RoomContainer = styled.div`
    height: 8rem;
    width: 17rem;
    display: flex;
    flex-direction: column;
    background-color: lightskyblue;
    border-radius: 20px;
    margin: 1rem 0.35rem;
    padding: 0.5rem 1rem;
`

S.RoomName = styled.h1`
    border-bottom: 0.1rem solid white;
    color: white;
    &:hover {
        cursor: pointer;
    }
`
S.Phase = styled.span`
    color: ${props => props.waiting ? "white" : "#ff8c00"};
`

S.NumOfPlayers = styled.span`
    color: white;
`

export default S