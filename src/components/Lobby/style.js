import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

S.CreateRoomButton = styled.button`
    width: 150px;
    background-color: steelblue;
    color: white;
    font-size: 15px;
    border: none;
    border-radius: 10px;
    padding: 15px 25px;
    margin: 100px 0 25px;
    &:hover {
        background-color: lightseagreen;

    }
`

S.RefreshButton = styled.button`
    padding: 5px;
    border: none;
    border-radius: 5px;
    :hover {
        background-color: lightgrey;
    }
`

S.LoadingContainer = styled.div`
    
`

S.Loading = styled.i`
    position: fixed;
    top: calc(100vh / 2);
    font-size: 50px;
    z-index: 1;
`

S.NoRoom = styled.h1`
    position: fixed;
    top: calc(100vh / 2);
`

export default S