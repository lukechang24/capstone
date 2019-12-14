import React from "react"
import S from "./style"

const UserList = (props) => {
    const userList = props.userList.map((user,i) => {
        return(
                <S.Username key={i}>
                    {user.isMaster && props.waiting ? <i className="fas fa-crown"></i> : null}
                    {user.displayName}
                </S.Username>
        )
    })
    // const waitingList
    return(
        <S.Container1 className={props.waiting ? "big" : "small"}>
            {props.waiting 
                ?
                    <S.Heading>Waiting for players...</S.Heading> 
                : 
                    null
            }
            <S.UserContainer className={props.waiting ? "big" : "small"}>
                {userList}
                {/* {props.} */}
            </S.UserContainer>
            {props.waiting && props.isMaster
                ?
                    <button onClick={() => {props.startGame()}}>Start Game</button> 
                : 
                    null
            }
        </S.Container1>
    )
}

export default UserList