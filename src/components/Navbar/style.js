import styled from "styled-components"
import { NavLink } from "react-router-dom"

const S = {}

S.NavContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: #93E2D5;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

S.Title = styled.h1`
    font-family: 'Jua', sans-serif;
    font-size: 40px;
    font-weight: bold;
    color: white;
    margin-left: 15px;
`

S.AuthContainer = styled.div`
    min-width: 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 15px;
`

S.AuthLink = styled(NavLink)`
    text-decoration: none;
    color: white;
    margin: 0 15px 0;
    padding: 0 0 2.5px;
    &:hover {
        color: darkblue;
    }
    &.active {
        border-bottom: 2.5px solid white;
    }
`
S.SignOut = styled.p`
    color: white;
    margin: 0 15px 0;
    padding: 0 0 2.5px;
    &:hover {
        color: darkblue;
        cursor: pointer;
    }
    &.active {
        border-bottom: 2.5px solid white;
    }
`

export default S