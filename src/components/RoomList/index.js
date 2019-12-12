import React from "react"
import { NavLink } from "react-router-dom"
import S from "./style"

const RoomList = (props) => {
    const lobbyList = props.lobbies.map((lobby, i) => {
        return(
            <S.RoomContainer>
                <NavLink to={`/lobby/${lobby.id}`} key={i}>
                    <h1>{lobby.roomName}</h1>
                    <p>{lobby.users.length}/4</p>
                </NavLink>
            </S.RoomContainer>
        )
    })
    return(
        <S.Container1>
            {lobbyList}
        </S.Container1>
    )
}

export default RoomList