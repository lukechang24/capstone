import React from "react"
import WaitingRoom from "../WaitingRoom"
import S from "./style"

const UserList = (props) => {
    const userList = props.userList.map((user,i) => {
        return(
            <div className={props.wait ? "big" : "small"} key={i}>
                <h1>{user.displayName}</h1>
            </div>
        )
    })
    console.log(props.waiting)
    return(
        <S.Container1 className={props.waiting ? "big" : "small"}>
            {props.waiting 
                ?
                    <button onClick={() => {props.startGame()}}>Start Game</button> 
                : 
                    null
            }
            {userList}
            {props.waiting 
                ?
                    <button onClick={() => {props.startGame()}}>Start Game</button> 
                : 
                    null
            }
        </S.Container1>
    )
}

export default UserList