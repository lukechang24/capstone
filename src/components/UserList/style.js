import styled from "styled-components"

const S = {}

S.Container1 = styled.div`
    &.big {
        width: 1000px;
        /* height: 700px; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin-right: 15px;
        @media only screen and (max-width: 1300px) {
            width: 700px;
            /* height: 500px; */
        }
        @media only screen and (max-width: 1040px) {
            width: 500px;
        }
    }
    &.small {
        user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        width: 250px;
    }
    background-color: #74C2E1;
`

S.UsersContainer = styled.div`
    display: flex;
    &.big {
        width: 70%;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin: 275px 0 275px;
        @media only screen and (max-width: 1300px) {
            margin: 250px 0 250px;
        }
        @media only screen and (max-width: 1040px) {
            margin: 200px 0 200px;
        }
    }
    &.small {
        width: 245px;
        flex-direction: column;
        padding: 15px 0;
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
    }
`

S.WaitingHeader = styled.h3`
    color: white;
    font-weight: bolder;
    margin-left: 10px;
`

S.WaitingUsers = styled.div`
`

S.UserContainer = styled.div`
    display: flex;
    justify-content: space-between;
    &.small {
        background-color: #0191C8;
        border-radius: 5px;
        padding: 5px 0;
        margin: 7.5px 10px;
    }
`

S.Username = styled.h3`
    margin: 0 0 0 10px;
    color: white;
`
S.Points = styled.p`
    color: white;
    vertical-align: middle;
    margin: 0 10px 0 0;
`

S.Heading = styled.h1`
    color: white;
    text-align: center;
    margin: 15px 0;
`

S.StartButton = styled.button`
    margin: 0 0 15px;
`

export default S