import styled from "styled-components"
import { NavLink } from "react-router-dom"

const S = {}

S.Container1 = styled.div`
    width: 75rem;
    min-height: 35rem;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
`
S.RoomContainer = styled.div`
    width: 17rem;
    height: 7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: lightskyblue;
    border-radius: 2rem;
    margin: 1rem 0.85rem;
`

S.RoomLink = styled(NavLink)`

`


export default S