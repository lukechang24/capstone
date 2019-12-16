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
    border-radius: 10px;
    font-size: 1rem;
    margin: 5rem 0 1rem;
    &:hover {
        background-color: lightseagreen;

    }
`

S.LoadingContainer = styled.div`
    
`

S.Loading = styled.i`
    position: fixed;
    top: calc(100vh / 2);
    font-size: 3rem;
    z-index: 1;
`
S.NoRoom = styled.h1`
    position: fixed;
    top: calc(100vh / 2);
`

export default S