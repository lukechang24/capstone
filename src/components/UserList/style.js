import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 45rem;
    &.big {
        width: 65rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }
    &.small {
        user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        width: 23rem;
    }
    background-color: rgb(167, 218, 250);
`

S.UserContainer = styled.div`
    &.big {
        width: 70%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
    &.small {
        height: 100%;
    }
`
S.PlayingUsers = styled.div`
    &.big {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    &.small {
        height: 50%;
    }
`

S.WaitingUsers = styled.div`
    height: 50%;
`

S.Username = styled.h3`
    margin: 1rem;
`

S.Heading = styled.h1`
    text-align: center;
    margin: 1rem;
`

S.StartButton = styled.button`

`

export default S