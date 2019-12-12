import styled from "styled-components"
import { NavLink } from "react-router-dom"

const S = {}

S.NavContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 3.5rem;
    background-color: lightsteelblue;
    display: flex;
    justify-content: space-between;
`
S.Title = styled.div`
    width: 50%;
`

S.AuthContainer = styled.div`
    min-width: 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 1.5rem;
`

S.AuthLink = styled(NavLink)`
    text-decoration: none;
    color: white;
    margin: 0rem 0.5rem 0rem;
    padding: 0.5rem 0rem;
    &:hover {
        color: darkblue;
    }
    &.active {
        border-bottom: 0.1rem solid white;
    }
`
S.SignOut = styled.p`
    color: white;
    margin: 0rem 0.5rem 0rem;
    padding: 0.5rem 0rem;
    &:hover {
        color: darkblue;
        cursor: pointer;
    }
    &.active {
        border-bottom: 0.1rem solid white;
    }
`

export default S