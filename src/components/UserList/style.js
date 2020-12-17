import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    height: 100%;
    min-height: 500px;
    max-height: 700px;
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
        width: 15rem;
    }
    margin-top: 25px;
    background-color: rgb(167, 218, 250);
`

S.UsersContainer = styled.div`
    display: flex;
    &.big {
        width: 70%;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
    &.small {
        height: 100%;
        width: 100%;
        flex-direction: column;
    }
`
S.PlayingUsers = styled.div`
    width: 100%;
    &.big {
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

S.UserContainer = styled.div`
    display: flex;
    justify-content: space-between;
    &.small {
        background-color: white;
        border-radius: 5px;
        margin: 0.5rem;
    }
`

S.Username = styled.h3`
    margin: 0rem 1rem;
`
S.Points = styled.p`
    vertical-align: middle;
    margin: 0rem 1rem;
`

S.Heading = styled.h1`
    text-align: center;
`

S.StartButton = styled.button`

`

export default S