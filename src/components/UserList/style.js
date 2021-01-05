import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    &.big {
        width: 1000px;
        height: 700px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin-left: 5%;
        margin-right: 5%;
    }
    &.small {
        user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        width: 250px;
    }
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
        width: 245px;
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
        /* height: 50%; */
    }
`

S.WaitingHeader = styled.h3`
    margin-left: 10px;
`

S.WaitingUsers = styled.div`
    /* height: 50%; */
`

S.UserContainer = styled.div`
    display: flex;
    justify-content: space-between;
    &.small {
        background-color: white;
        border-radius: 5px;
        margin: 7.5px 10px;
    }
`

S.Username = styled.h3`
    margin: 0 5px;
`
S.Points = styled.p`
    vertical-align: middle;
    margin: 0 5px;
`

S.Heading = styled.h1`
    text-align: center;
`

S.StartButton = styled.button`

`

export default S