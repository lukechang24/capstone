import styled from "styled-components"
import { NavLink } from "react-router-dom"

const S = {}

S.Container1 = styled.div`
    width: 75rem;
    display: flex;
    flex-wrap: wrap;
`
S.RoomContainer = styled.div`
    width: 17rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: lightskyblue;
    border-radius: 2rem;
    margin: 1rem 0.35rem;
    padding: 0.5rem;
`

S.RoomLink = styled(NavLink)`
    text-decoration: none;
    margin-left: 1rem;
`

S.RoomName = styled.h1`
    width: 100%;
    border-bottom: 0.1rem solid blue;
    padding: auto;
`

S.NoRoom = styled.h1`
    margin: 10rem auto;
`


export default S