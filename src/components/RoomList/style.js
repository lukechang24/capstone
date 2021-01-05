import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    width: 80%;
    display: flex;
    flex-wrap: wrap;
`
S.RoomContainer = styled.div`
    width: 250px;
    display: flex;
    flex-direction: column;
    background-color: lightskyblue;
    border-radius: 20px;
    margin: 5px 15px;
    padding: 15px;
`

S.RoomName = styled.h2`
    color: white;
    border-bottom: 2.5px solid white;
    margin: 0 0 25px;
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