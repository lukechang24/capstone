import React from "react"
import S from "./style"

const UserList = (props) => {
    const userList = props.userList.map((user,i) => {
        return(
            <S.UserContainer className={props.waiting ? "big" : "small"}>
                <S.Username key={i}>
                    {user.isMaster && props.waiting ? <i className="fas fa-crown"></i> : null} {user.displayName}
                </S.Username>
                {!props.waiting 
                    ?
                        <S.Points>{user.points}</S.Points>
                    :
                        null
                }
            </S.UserContainer>
        )
    })
    const waitingList = props.waitingList.map((user,i) => {
        return(
            <S.Username key={i}>
                {user.displayName}
            </S.Username>
        )
    })
    return(
        <S.Container1 className={props.waiting ? "big" : "small"}>
            {props.waiting 
                ?
                    <S.Heading>Waiting for players...</S.Heading> 
                : 
                    null
            }
            <S.UsersContainer className={props.waiting ? "big" : "small"}>
                <S.PlayingUsers className={props.waiting ? "big" : "small"}>
                    {userList}
                </S.PlayingUsers>
                {!props.waiting && props.waitingList[0]
                    ? 
                        <S.WaitingUsers>
                            WAITING
                            {waitingList}
                        </S.WaitingUsers>
                    :
                        null
                }
            </S.UsersContainer>
            {props.waiting
                ?
                    <S.StartButton onClick={() => {props.startGame()}} disabled={!props.isMaster}>Start Game</S.StartButton> 
                : 
                    null
            }
        </S.Container1>
    )
}

export default UserList